import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Drink } from '../types/drink';
import { getFifaCardData } from '../lib/fifaStats';
import { FifaCard } from './FifaCard';
import { RealisticFireCannon } from './RealisticFireCannon';
import { WalkoutTunnel } from './WalkoutTunnel';
import { soundFx } from '../lib/audio';
import {
  Sparkles,
  Zap,
  MapPin,
  ExternalLink,
  RotateCcw,
  FastForward,
  Trophy,
  Flame,
  Coffee,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

interface FifaPackOpeningProps {
  drinks: Drink[];
  onOpenCafeDirectory?: (cafeName?: string) => void;
}

type PackPhase =
  | 'idle'
  | 'tearing'
  | 'tease_origin'
  | 'tease_position'
  | 'tease_club'
  | 'walkout';

export const FifaPackOpening: React.FC<FifaPackOpeningProps> = ({
  drinks,
  onOpenCafeDirectory,
}) => {
  const [phase, setPhase] = useState<PackPhase>('idle');
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [flashWhite, setFlashWhite] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [showFlames, setShowFlames] = useState(false);

  const phaseRef = useRef<PackPhase>(phase);
  phaseRef.current = phase;
  const selectedDrinkRef = useRef<Drink | null>(selectedDrink);
  selectedDrinkRef.current = selectedDrink;

  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((t) => clearTimeout(t));
    timeoutRefs.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (phaseRef.current === 'idle') {
          e.preventDefault();
          handleOpenPack();
        } else if (phaseRef.current !== 'walkout' && selectedDrinkRef.current) {
          e.preventDefault();
          handleSkip();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearAllTimeouts();
      soundFx.stopPackRiser();
    };
  }, []); // Only runs cleanup on actual unmount!

  // Pick random drink from pool (weighted toward exciting rare items if available)
  const getRandomDrink = (): Drink => {
    if (!drinks || drinks.length === 0) return {} as Drink;
    return drinks[Math.floor(Math.random() * drinks.length)];
  };

  // Start Pack Opening Sequence
  const handleOpenPack = () => {
    if (phaseRef.current !== 'idle' && phaseRef.current !== 'walkout') return;
    clearAllTimeouts();

    const target = getRandomDrink();
    setSelectedDrink(target);
    selectedDrinkRef.current = target;
    setPhase('tearing');
    setShowFlames(true);

    // Audio: Tear + Heavy Bass Riser + Stage Flame Roar
    soundFx.playPackTear();
    soundFx.playPackRiser();
    soundFx.playFlameRoar();

    // Stage 1: Pack Tearing & Crack (1.1s)
    const t1 = setTimeout(() => {
      setPhase('tease_origin');
      soundFx.playHeavyThud(0.85);

      // Stage 2: Sprint in Tunnel -> 1. QUỐC KỲ (1.8s)
      const t2 = setTimeout(() => {
        setPhase('tease_position');
        soundFx.playHeavyThud(1.15);

        // Stage 3: Sprint in Tunnel -> 2. KÍ HIỆU VỊ TRÍ & CLB (1.8s) -> Then 3. THẺ BÀI!
        const t3 = setTimeout(() => {
          triggerWalkout(target);
        }, 1800);
        timeoutRefs.current.push(t3);
      }, 1800);
      timeoutRefs.current.push(t2);
    }, 1100);
    timeoutRefs.current.push(t1);
  };

  // Immediate Skip
  const handleSkip = () => {
    if (phase === 'walkout' || !selectedDrink) return;
    clearAllTimeouts();
    triggerWalkout(selectedDrink);
  };

  // Walkout Trigger (The Boom & Card Drop)
  const triggerWalkout = (drink: Drink) => {
    soundFx.stopPackRiser();
    soundFx.playWalkoutExplosion();

    setFlashWhite(true);
    setScreenShake(true);

    setTimeout(() => setFlashWhite(false), 280);
    setTimeout(() => setScreenShake(false), 650);

    setPhase('walkout');
    setShowFlames(true);

    // Stadium Confetti & Pyro Fireworks burst
    confetti({
      particleCount: 140,
      spread: 120,
      origin: { y: 0.45 },
      colors: ['#f59e0b', '#3b82f6', '#ec4899', '#ffffff', '#10b981', '#fbbf24'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 90,
        angle: 55,
        spread: 80,
        origin: { x: 0.05, y: 0.65 },
        colors: ['#f59e0b', '#ffd700', '#ffffff'],
      });
      confetti({
        particleCount: 90,
        angle: 125,
        spread: 80,
        origin: { x: 0.95, y: 0.65 },
        colors: ['#f59e0b', '#ffd700', '#ffffff'],
      });
    }, 350);
  };

  const cardStats = selectedDrink ? getFifaCardData(selectedDrink) : null;

  return (
    <div
      className={`relative w-full max-w-5xl mx-auto my-6 rounded-3xl overflow-hidden border border-zinc-700/80 bg-gradient-to-b from-slate-950 via-zinc-950 to-black shadow-[0_0_80px_rgba(0,0,0,0.8)] p-4 sm:p-8 flex flex-col items-center justify-center min-h-[640px] transition-all duration-300 ${
        screenShake ? 'animate-screen-shake' : ''
      }`}
    >
      {/* Stadium Arena Spotlight Beams & Smoke Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sweeping Stadium Searchlights */}
        <div className="absolute top-0 left-10 w-96 h-[600px] bg-gradient-to-b from-amber-400/20 via-blue-500/10 to-transparent -rotate-25 blur-2xl animate-pulse" />
        <div className="absolute top-0 right-10 w-96 h-[600px] bg-gradient-to-b from-cyan-400/20 via-purple-500/10 to-transparent rotate-25 blur-2xl animate-pulse delay-700" />

        {/* Volumetric Fog Layer along bottom runway */}
        <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-black via-zinc-900/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-white/5 blur-xl pointer-events-none" />
      </div>

      {/* Dual Ultra-Realistic 60FPS Stage Fire Projectors */}
      {(showFlames || phase === 'walkout' || phase === 'tearing') && (
        <div className="absolute inset-x-0 bottom-4 flex justify-between pointer-events-none z-30 px-2 sm:px-6">
          <RealisticFireCannon active={showFlames || phase === 'walkout'} side="left" />
          <RealisticFireCannon active={showFlames || phase === 'walkout'} side="right" />
        </div>
      )}

      {/* Full-screen Blinding White Flash on Walkout Impact */}
      {flashWhite && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-300" />
      )}

      {/* Top EA FC Header Bar & Skip Button */}
      <div className="relative z-10 w-full flex items-center justify-between gap-3 mb-6 pb-3 border-b border-zinc-800/80 text-xs backdrop-blur-xs">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-wider text-[11px] shadow-md flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 fill-black" />
            <span>EA FC 25 / FO4</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-zinc-300 font-bold">
            <span>PACK OPENING ARENA</span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400 text-[11px] font-mono">66 MÓN ĐỒ UỐNG CHUẨN OVR 99</span>
          </div>
        </div>

        {/* Skip button during animation */}
        {phase !== 'idle' && phase !== 'walkout' && (
          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-amber-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            <FastForward className="w-4 h-4 text-amber-400" />
            <span>BỎ QUA (SPACE)</span>
          </button>
        )}
      </div>

      {/* Stage Arena Center */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[440px]">
        {/* ================= STAGE 1: IDLE / TEARING 3D FOIL PACK ================= */}
        {(phase === 'idle' || phase === 'tearing') && (
          <div className="flex flex-col items-center justify-center">
            {/* Stage Plinth / Circular Neon Pedestal */}
            <div className="relative flex flex-col items-center select-none">
              {/* Circular Stage Floor Base with Rotating Laser Ring */}
              <div className="absolute -bottom-6 w-72 sm:w-96 h-20 rounded-[100%] bg-gradient-to-r from-blue-600/30 via-amber-400/40 to-cyan-500/30 blur-md border-2 border-amber-400/50 pointer-events-none" />

              {/* 3D EA FC Gold Foil Pack Graphic */}
              <div
                onClick={handleOpenPack}
                className={`relative cursor-pointer transition-all duration-500 ${
                  phase === 'tearing'
                    ? 'scale-110 filter drop-shadow-[0_0_60px_rgba(245,158,11,1)]'
                    : 'hover:scale-105 active:scale-95'
                }`}
              >
                {/* Outer Golden Pack Aura */}
                <div className="absolute -inset-6 bg-gradient-to-r from-amber-500/30 via-yellow-400/40 to-amber-600/30 rounded-3xl blur-2xl opacity-80 animate-pulse" />

                {/* The EA FC Gold Card Pack Container */}
                <div
                  style={{
                    clipPath: 'polygon(8% 0%, 92% 0%, 100% 6%, 100% 92%, 92% 100%, 8% 100%, 0% 92%, 0% 6%)',
                  }}
                  className="relative w-64 h-96 sm:w-72 sm:h-[420px] rounded-2xl bg-gradient-to-b from-amber-200 via-amber-500 to-amber-950 border-4 border-yellow-300 p-2 shadow-2xl overflow-hidden flex flex-col justify-between"
                >
                  {/* Hologram metallic sheen that glides over pack */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                  {/* Lightning Crack Line when tearing */}
                  {phase === 'tearing' && (
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 bg-white shadow-[0_0_30px_#ffffff] z-30 animate-ping" />
                  )}

                  {/* Pack Top Brand Header */}
                  <div className="bg-black/85 rounded-xl p-3 text-center border border-amber-400/50 backdrop-blur-md">
                    <div className="flex items-center justify-center gap-1.5 text-[11px] tracking-widest text-amber-400 font-black uppercase">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>EA SPORTS FC 2026</span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white tracking-tight uppercase mt-0.5">
                      GÓI TOTY CỰC PHẨM
                    </div>
                    <div className="text-[10px] text-amber-300/90 font-bold uppercase tracking-wider">
                      ★ 100% Walkout Đồ Uống ★
                    </div>
                  </div>

                  {/* Pack Center Crest: Giant 3D Coffee / FUT Shield */}
                  <div className="flex-1 flex flex-col items-center justify-center relative my-2">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-black/80 via-amber-950/80 to-black/80 border-2 border-yellow-300 flex items-center justify-center shadow-2xl relative">
                      <Coffee className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
                      <div className="absolute -top-1 -right-1 p-1 rounded-full bg-amber-400 text-black text-[10px] font-black">
                        99
                      </div>
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-black bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-300 px-4 py-1 rounded-full mt-4 shadow-lg border border-yellow-100">
                      Hôm Nay Uống Gì
                    </div>
                  </div>

                  {/* Pack Footer */}
                  <div className="bg-black/90 rounded-xl p-2.5 text-center border border-amber-400/40">
                    <div className="text-xs font-bold text-zinc-300 flex items-center justify-center gap-1">
                      <span>Xé Để Xem Walkout</span>
                      <ChevronRight className="w-4 h-4 text-amber-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button: Xé Gói Thẻ */}
            <button
              onClick={handleOpenPack}
              disabled={phase === 'tearing'}
              className={`mt-8 px-10 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider flex items-center gap-3 transition-all shadow-2xl ${
                phase === 'tearing'
                  ? 'bg-amber-600 text-black cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-black hover:scale-105 active:scale-95 shadow-amber-500/30'
              }`}
            >
              <Flame className="w-6 h-6 fill-current text-black" />
              <span>{phase === 'tearing' ? 'Đang Xé Gói...' : 'Bẻ Gói Thẻ EA FC Ngay'}</span>
              <Sparkles className="w-5 h-5 text-black" />
            </button>
            <p className="text-zinc-500 text-xs mt-2.5">
              Phím tắt: Bấm Space hoặc Enter để bẻ gói thẻ
            </p>
          </div>
        )}

        {/* ================= STAGE 2: THE WALKOUT TUNNEL CLUES ================= */}
        {/* ================= STAGE 2: THE 3D WALKOUT TUNNEL SPRINT ================= */}
        {(phase === 'tease_origin' ||
          phase === 'tease_position' ||
          phase === 'tease_club') &&
          cardStats && (
            <WalkoutTunnel phase={phase} cardStats={cardStats} />
          )}

        {/* ================= STAGE 3: THE WALKOUT 3D CARD SLAM ================= */}
        {phase === 'walkout' && selectedDrink && cardStats && (
          <div className="w-full flex flex-col items-center justify-center animate-in zoom-in-50 duration-700">
            {/* Walkout Trophy Banner */}
            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-400/30 to-amber-500/30 text-yellow-300 border border-yellow-400/60 text-xs font-black uppercase tracking-wider mb-2 shadow-lg animate-pulse">
                <Flame className="w-4 h-4 text-yellow-400" />
                <span>WALKOUT THÀNH CÔNG • CỰC PHẨM EA FC</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">
                {selectedDrink.name}
              </h2>
            </div>

            {/* The 3D FUT Card */}
            <FifaCard drink={selectedDrink} isLarge={true} animateIn={true} />

            {/* Action Shortcuts */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 z-30">
              <button
                onClick={handleOpenPack}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-500 hover:from-yellow-200 hover:to-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Xé Tiếp Gói Mới</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(
                  `${selectedDrink.name} ${selectedDrink.cafes[0] || 'cà phê'} gần đây`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Chỉ Đường (Google Maps)</span>
              </a>

              <a
                href={`https://shopeefood.vn/search?q=${encodeURIComponent(selectedDrink.name)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ShopeeFood</span>
              </a>

              <a
                href={`https://food.grab.com/vn/vi/restaurants?search=${encodeURIComponent(
                  selectedDrink.name
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                <span>GrabFood</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Arena Footer */}
      <div className="relative z-10 mt-6 text-center text-[11px] text-zinc-400 font-medium">
        Di chuột quanh thẻ bài để tương tác hiệu ứng 3D Hologram phản chiếu ánh sáng sân vận động
      </div>
    </div>
  );
};
