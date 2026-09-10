import React, { useEffect, useRef } from 'react';

interface RealisticFireCannonProps {
  active: boolean;
  side: 'left' | 'right';
}

export const RealisticFireCannon: React.FC<RealisticFireCannonProps> = ({
  active,
  side,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 320;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      colorType: 'flame' | 'spark';
    }

    const particles: Particle[] = [];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (active) {
        // Spawn flame body particles
        for (let i = 0; i < 6; i++) {
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 24,
            y: canvas.height - 20,
            vx: (Math.random() - 0.5) * 3,
            vy: -(Math.random() * 9 + 8),
            size: Math.random() * 26 + 18,
            life: 0,
            maxLife: Math.random() * 20 + 25,
            colorType: 'flame',
          });
        }

        // Spawn high-speed flying ember sparks
        for (let i = 0; i < 3; i++) {
          particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 30,
            y: canvas.height - 25,
            vx: (Math.random() - 0.5) * 6 + (side === 'left' ? 1.5 : -1.5),
            vy: -(Math.random() * 14 + 10),
            size: Math.random() * 3.5 + 1.5,
            life: 0,
            maxLife: Math.random() * 35 + 30,
            colorType: 'spark',
          });
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;

        if (p.colorType === 'flame') {
          p.size *= 0.96;
          p.vx += (Math.random() - 0.5) * 1.5;

          // Color transition: White core -> Intense Yellow -> Flaming Orange -> Dark Smoke
          let color: string;
          if (progress < 0.2) {
            color = `rgba(255, 255, 240, ${1 - progress})`;
          } else if (progress < 0.5) {
            color = `rgba(255, 200, 30, ${0.9 - progress * 0.8})`;
          } else if (progress < 0.8) {
            color = `rgba(245, 100, 10, ${0.7 - progress * 0.7})`;
          } else {
            color = `rgba(120, 20, 5, ${0.4 - progress * 0.4})`;
          }

          ctx.beginPath();
          const radGrad = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            Math.max(1, p.size)
          );
          radGrad.addColorStop(0, color);
          radGrad.addColorStop(1, 'rgba(255, 50, 0, 0)');
          ctx.fillStyle = radGrad;
          ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ember Spark
          p.vx *= 0.98;
          p.vy += 0.15; // slight gravity

          ctx.beginPath();
          ctx.fillStyle = `rgba(255, ${Math.floor(180 + Math.random() * 75)}, 50, ${
            1 - progress
          })`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#fbbf24';
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        if (p.life >= p.maxLife || p.size <= 0.5) {
          particles.splice(i, 1);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, side]);

  return (
    <div
      className={`relative flex flex-col items-center pointer-events-none z-20 ${
        side === 'left' ? 'left-2 sm:left-10' : 'right-2 sm:right-10'
      }`}
    >
      {/* Dynamic Ground Heat Glow */}
      {active && (
        <div className="absolute bottom-0 w-36 h-20 bg-orange-500/50 rounded-full blur-2xl animate-pulse" />
      )}

      {/* Canvas Fire & Ember Emitter */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-36 sm:w-44 h-72 sm:h-80 -mb-4"
      />

      {/* Stage Pyro Cannon Nozzle Box */}
      <div className="relative z-20 w-16 sm:w-20 h-7 rounded-lg bg-gradient-to-t from-zinc-950 to-zinc-800 border border-zinc-600 shadow-2xl flex flex-col items-center justify-center">
        {/* Burning Nozzle Core */}
        <div
          className={`w-8 sm:w-10 h-2 rounded-full transition-all duration-300 ${
            active
              ? 'bg-yellow-200 shadow-[0_0_20px_#fde047]'
              : 'bg-zinc-900 border border-zinc-700'
          }`}
        />
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              active ? 'bg-red-500 animate-ping' : 'bg-zinc-600'
            }`}
          />
          <span className="text-[8px] font-mono font-bold text-zinc-400">
            PYRO {side.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};
