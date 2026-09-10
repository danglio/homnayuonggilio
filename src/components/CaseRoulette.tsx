import React, { useRef, useEffect, useState } from 'react';
import { Drink } from '../types/drink';
import { RARITY_CONFIG } from '../data/drinks';
import { soundFx } from '../lib/audio';

interface CaseRouletteProps {
  items: Drink[];
  targetItem: Drink | null;
  isRolling: boolean;
  onSpinEnd: () => void;
}

const CARD_WIDTH = 180; // px
const CARD_GAP = 12; // px
const ITEM_STRIDE = CARD_WIDTH + CARD_GAP;
const TARGET_INDEX = 42; // Index in the strip where target is placed

export const CaseRoulette: React.FC<CaseRouletteProps> = ({
  items,
  targetItem,
  isRolling,
  onSpinEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [strip, setStrip] = useState<Drink[]>([]);
  const lastTickIndexRef = useRef<number>(-1);
  const animationFrameRef = useRef<number | null>(null);

  // Generate a random strip of items when pool changes or before roll
  useEffect(() => {
    if (!items.length) return;
    const newStrip: Drink[] = [];
    for (let i = 0; i < 60; i++) {
      const rand = items[Math.floor(Math.random() * items.length)];
      newStrip.push(rand);
    }
    setStrip(newStrip);
  }, [items]);

  // Execute the roll animation when isRolling becomes true
  useEffect(() => {
    if (!isRolling || !targetItem || !containerRef.current || !trackRef.current) {
      return;
    }

    // Build the strip with targetItem at TARGET_INDEX
    const currentStrip = [...strip];
    while (currentStrip.length < TARGET_INDEX + 15) {
      currentStrip.push(items[Math.floor(Math.random() * items.length)]);
    }
    currentStrip[TARGET_INDEX] = targetItem;
    setStrip(currentStrip);

    soundFx.playSpinStart();

    const containerWidth = containerRef.current.clientWidth;
    const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;

    // Slight random offset inside the card to look realistic (not dead-center every time)
    const randomCardOffset = (Math.random() - 0.5) * (CARD_WIDTH * 0.5);
    const targetTranslateX = -(TARGET_INDEX * ITEM_STRIDE - centerOffset + randomCardOffset);

    // Initial position
    let currentX = 0;
    trackRef.current.style.transform = `translateX(${currentX}px)`;
    lastTickIndexRef.current = -1;

    const duration = 6500; // 6.5 seconds roll duration
    const startTime = performance.now();

    // Smooth cubic bezier easing function: easeOutCubic / custom CS2 ease
    const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      currentX = targetTranslateX * easedProgress;

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${currentX}px)`;
      }

      // Check current item passing center for tick sound
      const currentPassedIndex = Math.floor((-currentX + centerOffset) / ITEM_STRIDE);
      if (currentPassedIndex !== lastTickIndexRef.current && currentPassedIndex >= 0) {
        lastTickIndexRef.current = currentPassedIndex;
        // Pitch sound gets slightly lower as speed drops
        const pitch = 1.2 - progress * 0.4;
        soundFx.playTick(pitch);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Finished roll
        soundFx.playWin(targetItem.rarity === 'legendary' || targetItem.rarity === 'exotic');
        onSpinEnd();
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRolling]);

  return (
    <div className="relative w-full max-w-5xl mx-auto my-6 select-none overflow-hidden rounded-2xl bg-zinc-900/90 border border-zinc-800 p-2 shadow-2xl backdrop-blur-xl">
      {/* Top & Bottom Needle Markers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]" />
        <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
        <div className="w-0.5 h-6 bg-gradient-to-t from-amber-400 to-transparent" />
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-amber-400 drop-shadow-[0_-2px_8px_rgba(251,191,36,0.8)]" />
      </div>

      {/* Center Laser Line */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-amber-400/80 via-amber-400/30 to-amber-400/80 pointer-events-none z-20" />

      {/* Gradient Fog Overlays */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-zinc-900 via-zinc-900/80 to-transparent z-20 pointer-events-none" />

      {/* Carousel Track Container */}
      <div ref={containerRef} className="overflow-hidden py-3">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform"
          style={{ gap: `${CARD_GAP}px` }}
        >
          {strip.map((item, index) => {
            const rarity = RARITY_CONFIG[item.rarity];
            return (
              <div
                key={`${item.id}-${index}`}
                style={{
                  width: `${CARD_WIDTH}px`,
                  minWidth: `${CARD_WIDTH}px`,
                }}
                className={`group relative h-48 rounded-xl bg-zinc-950/80 border-2 ${rarity.border} p-3.5 flex flex-col justify-between transition-all duration-200 overflow-hidden shadow-lg`}
              >
                {/* Background glow on top edge */}
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: rarity.color }}
                />

                {/* Top Badge: Rarity & Category */}
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold"
                    style={{ backgroundColor: `${rarity.color}25`, color: rarity.color }}
                  >
                    {rarity.tag}
                  </span>
                  <span className="text-zinc-400">{item.price}k</span>
                </div>

                {/* Center Image & Name */}
                <div className="my-auto flex flex-col items-center text-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden mb-1.5 border border-zinc-800 shadow-md bg-zinc-900 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span className="text-2xl select-none absolute inset-0 flex items-center justify-center -z-10">
                      {item.icon}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-zinc-100 line-clamp-1 px-1">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                    {item.cafes[0]}
                  </div>
                </div>

                {/* Bottom Accent Bar */}
                <div
                  className="w-full py-1 rounded text-center text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: rarity.color }}
                >
                  {item.cafes.length} quán gợi ý
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
