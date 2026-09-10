import React, { useState } from 'react';
import { Drink } from '../types/drink';
import { getFifaCardData } from '../lib/fifaStats';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface FifaCardProps {
  drink: Drink;
  isLarge?: boolean;
  animateIn?: boolean;
}

export const FifaCard: React.FC<FifaCardProps> = ({
  drink,
  isLarge = false,
  animateIn = false,
}) => {
  const data = getFifaCardData(drink);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  // 3D perspective tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / rect.height) * 15,
      y: (x / rect.width) * 15,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Card themes
  const themeStyles = {
    toty: {
      bg: 'from-blue-950 via-slate-900 to-amber-950',
      border: 'border-amber-400/90',
      glow: 'shadow-[0_0_50px_rgba(245,158,11,0.5)]',
      textPrimary: 'text-amber-300',
      textSecondary: 'text-blue-200',
      accent: '#f59e0b',
      foil: 'linear-gradient(135deg, rgba(245,158,11,0.3) 0%, rgba(59,130,246,0.2) 50%, rgba(245,158,11,0.4) 100%)',
    },
    icon: {
      bg: 'from-amber-200 via-amber-100 to-amber-400',
      border: 'border-white',
      glow: 'shadow-[0_0_50px_rgba(251,191,36,0.6)]',
      textPrimary: 'text-amber-950',
      textSecondary: 'text-amber-900',
      accent: '#78350f',
      foil: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(245,158,11,0.3) 50%, rgba(255,255,255,0.7) 100%)',
    },
    tots: {
      bg: 'from-indigo-950 via-purple-950 to-blue-950',
      border: 'border-cyan-400',
      glow: 'shadow-[0_0_45px_rgba(34,211,238,0.4)]',
      textPrimary: 'text-cyan-300',
      textSecondary: 'text-purple-200',
      accent: '#22d3ee',
      foil: 'linear-gradient(135deg, rgba(34,211,238,0.3) 0%, rgba(168,85,247,0.3) 50%, rgba(34,211,238,0.3) 100%)',
    },
    inform: {
      bg: 'from-black via-zinc-900 to-zinc-950',
      border: 'border-amber-500',
      glow: 'shadow-[0_0_35px_rgba(245,158,11,0.35)]',
      textPrimary: 'text-amber-400',
      textSecondary: 'text-zinc-300',
      accent: '#eab308',
      foil: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(245,158,11,0.3) 100%)',
    },
    gold: {
      bg: 'from-amber-700 via-yellow-600 to-amber-800',
      border: 'border-yellow-300/80',
      glow: 'shadow-[0_0_35px_rgba(234,179,8,0.3)]',
      textPrimary: 'text-yellow-100',
      textSecondary: 'text-amber-200',
      accent: '#fef08a',
      foil: 'linear-gradient(135deg, rgba(254,240,138,0.3) 0%, rgba(202,138,4,0.3) 50%, rgba(254,240,138,0.4) 100%)',
    },
  }[data.cardType];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: rotate.x === 0 && rotate.y === 0 ? 'transform 0.4s ease-out' : 'none',
      }}
      className={`relative select-none cursor-pointer group ${
        isLarge ? 'w-72 sm:w-80' : 'w-56 sm:w-64'
      } ${animateIn ? 'animate-in zoom-in-75 duration-700' : ''}`}
    >
      {/* Outer Glow Halo */}
      <div
        className={`absolute -inset-1 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 ${themeStyles.glow}`}
      />

      {/* Main Card Shield Container */}
      <div
        style={{
          clipPath: 'polygon(6% 0%, 94% 0%, 100% 6%, 100% 88%, 50% 100%, 0% 88%, 0% 6%)',
          background: themeStyles.foil,
        }}
        className={`relative p-1 rounded-2xl shadow-2xl transition-all duration-300`}
      >
        <div
          style={{
            clipPath: 'polygon(6% 0%, 94% 0%, 100% 6%, 100% 88%, 50% 100%, 0% 88%, 0% 6%)',
          }}
          className={`bg-gradient-to-b ${themeStyles.bg} p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden border-2 ${themeStyles.border}`}
        >
          {/* Holographic light sweep sheen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

          {/* Top Section: OVR, Position, Nation Flag, Club & HD Drink Image */}
          <div className="flex items-start justify-between gap-2 pt-1">
            {/* Left Column: Stats & Badges */}
            <div className="flex flex-col items-center leading-none">
              <span
                className={`text-3xl sm:text-4xl font-black tracking-tighter ${themeStyles.textPrimary} drop-shadow-md`}
              >
                {data.ovr}
              </span>
              <span
                className={`text-sm sm:text-base font-black tracking-wider uppercase mt-1 ${themeStyles.textPrimary}`}
              >
                {data.position}
              </span>
              <div className="w-6 h-0.5 bg-current opacity-30 my-1.5" />
              <span className="text-xl sm:text-2xl" title={data.originCountry}>
                {data.originFlag}
              </span>
              <span
                className={`text-[9px] font-extrabold uppercase mt-1.5 max-w-[60px] truncate text-center opacity-85 ${themeStyles.textSecondary}`}
                title={data.clubBrand}
              >
                {data.clubBrand.split(' ')[0]}
              </span>
            </div>

            {/* Right Column: High-Res Drink Portrait with Glow Circle */}
            <div className="relative flex-1 flex justify-center items-center">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-white/20 shadow-inner bg-black/30 p-1 relative">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to placeholder if missing
                    (e.target as HTMLImageElement).src = '/warehouse.png';
                  }}
                />
              </div>
              <div className="absolute -top-1 -right-1 text-amber-300 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Player/Drink Name Banner */}
          <div className="my-3 text-center border-t border-b border-white/15 py-1.5 backdrop-blur-xs">
            <h3
              className={`text-sm sm:text-base font-black tracking-tight uppercase truncate px-1 ${themeStyles.textPrimary} drop-shadow-sm`}
            >
              {drink.name}
            </h3>
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold mt-0.5">
              <span className={themeStyles.textSecondary}>
                {(drink.price * 1000).toLocaleString('vi-VN')} đ
              </span>
              <span className="opacity-40">•</span>
              <span className={`text-[10px] uppercase font-mono ${themeStyles.textPrimary}`}>
                {drink.cafes[0] || 'Việt Nam'}
              </span>
            </div>
          </div>

          {/* 6 FIFA Attributes Radar Grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs px-1 sm:px-2 py-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
              <span className={`font-black ${themeStyles.textPrimary}`}>{data.stats.ngo}</span>
              <span className={`text-[10px] font-bold ${themeStyles.textSecondary}`}>NGO (Ngọt)</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
              <span className={`font-black ${themeStyles.textPrimary}`}>{data.stats.caf}</span>
              <span className={`text-[10px] font-bold ${themeStyles.textSecondary}`}>CAF (Tỉnh)</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
              <span className={`font-black ${themeStyles.textPrimary}`}>{data.stats.mat}</span>
              <span className={`text-[10px] font-bold ${themeStyles.textSecondary}`}>MAT (Mát)</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-0.5">
              <span className={`font-black ${themeStyles.textPrimary}`}>{data.stats.hot}</span>
              <span className={`text-[10px] font-bold ${themeStyles.textSecondary}`}>HOT (Trend)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`font-black ${themeStyles.textPrimary}`}>{data.stats.gia}</span>
              <span className={`text-[10px] font-bold ${themeStyles.textSecondary}`}>GIA (Giá)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`font-black ${themeStyles.textPrimary}`}>{data.stats.nlu}</span>
              <span className={`text-[10px] font-bold ${themeStyles.textSecondary}`}>NLU (Sức)</span>
            </div>
          </div>

          {/* Card Footnote: Class Badge */}
          <div className="mt-2 text-center pb-2">
            <div
              className={`inline-flex items-center gap-1 text-[9px] uppercase font-black px-2.5 py-0.5 rounded-full border border-white/20 bg-black/40 ${themeStyles.textPrimary}`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{data.cardTypeLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
