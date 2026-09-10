import React from 'react';
import { FifaCardStats } from '../lib/fifaStats';
import { Sparkles, Shield, Compass } from 'lucide-react';

interface WalkoutTunnelProps {
  phase: 'tease_origin' | 'tease_position' | 'tease_club';
  cardStats: FifaCardStats;
}

export const WalkoutTunnel: React.FC<WalkoutTunnelProps> = ({
  phase,
  cardStats,
}) => {
  return (
    <div className="relative w-full max-w-4xl h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(6,182,212,0.5)] flex flex-col items-center justify-center select-none animate-in zoom-in-95 duration-500">
      {/* First-Person EA FC 25 Walkout Tunnel Background */}
      <div
        style={{
          backgroundImage: `url('https://cdn.jsdelivr.net/gh/danglio/homnayuonggilio@gh-pages/fifa-tunnel-run.jpg')`,
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover',
        }}
        className={`absolute inset-0 transition-transform duration-1000 ${
          phase === 'tease_origin'
            ? 'scale-105 animate-[pulse_2s_ease-in-out_infinite]'
            : 'scale-125 duration-700'
        }`}
      />

      {/* Rushing Tunnel Perspective Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_45%,transparent_20%,rgba(0,0,0,0.85)_100%)]" />

      {/* Warp Speed Lines (Sprinting forward effect) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-cyan-400/40 rounded-full animate-ping" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-white/30 rounded-full animate-ping delay-200" />
      </div>

      {/* Billowing Ground Fog Along the Wet Reflective Floor */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black via-cyan-950/50 to-transparent pointer-events-none" />

      {/* Top HUD Tunnel Navigation Header */}
      <div className="absolute top-6 z-20 flex items-center gap-2 px-5 py-1.5 rounded-full bg-black/85 border border-cyan-400/70 backdrop-blur-md shadow-2xl text-cyan-300 text-xs font-black uppercase tracking-widest">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        <span>EA FC 25 • ĐANG LAO TRONG ĐƯỜNG HẦM</span>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
      </div>

      {/* ================= STAGE 1: LẦN LƯỢT 1 - CHỈ HIỆN QUỐC KỲ ================= */}
      {phase === 'tease_origin' && (
        <div className="relative z-20 flex flex-col items-center justify-center animate-in zoom-in-75 duration-300 max-w-sm w-full px-4">
          <div className="w-full flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-black/85 border-2 border-amber-400 shadow-[0_0_60px_rgba(251,191,36,0.7)] backdrop-blur-md relative overflow-hidden">
            {/* Shimmer Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/50 text-[10px] font-black uppercase tracking-widest mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>1. QUỐC KỲ / XUẤT XỨ</span>
            </div>

            {/* Giant 3D Flag */}
            <div className="text-8xl sm:text-9xl filter drop-shadow-[0_0_40px_rgba(255,255,255,0.8)] my-2 animate-bounce">
              {cardStats.originFlag}
            </div>

            <div className="text-2xl sm:text-3xl font-black text-white tracking-wider uppercase mt-1 drop-shadow-md">
              {cardStats.originCountry}
            </div>

            <div className="text-[11px] font-mono text-amber-400/90 mt-2 tracking-widest uppercase">
              ★ TIẾP TỤC LAO VỀ PHÍA TRƯỚC ★
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: LẦN LƯỢT 2 - CHỈ HIỆN KÍ HIỆU VỊ TRÍ & CLB ================= */}
      {(phase === 'tease_position' || phase === 'tease_club') && (
        <div className="relative z-20 flex flex-col items-center justify-center animate-in zoom-in-75 duration-300 max-w-sm w-full px-4">
          <div className="w-full flex flex-col items-center p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-cyan-950/95 via-blue-950/95 to-black/95 border-2 border-cyan-400 shadow-[0_0_60px_rgba(34,211,238,0.7)] backdrop-blur-md relative overflow-hidden">
            {/* Glowing Accent */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 text-[10px] font-black uppercase tracking-widest mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>2. KÍ HIỆU VỊ TRÍ & THƯƠNG HIỆU</span>
            </div>

            {/* Giant Glowing Position Symbol */}
            <div className="text-6xl sm:text-7xl font-black text-cyan-300 tracking-wider filter drop-shadow-[0_0_30px_rgba(34,211,238,0.9)] my-1">
              {cardStats.position}
            </div>

            <div className="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
              {cardStats.positionLabel}
            </div>

            <div className="w-16 h-0.5 bg-cyan-400/40 my-3" />

            {/* Club Brand Emblem */}
            <div className="text-xl sm:text-2xl font-black text-yellow-300 tracking-tight uppercase px-3 py-1 rounded-xl bg-black/60 border border-yellow-400/40 shadow-inner">
              {cardStats.clubBrand}
            </div>

            <div className="text-[11px] font-mono text-cyan-300/90 mt-3 tracking-widest uppercase animate-pulse">
              ⚡ CHUẨN BỊ XUẤT HIỆN THẺ BÀI...
            </div>
          </div>
        </div>
      )}

      {/* Running Speed Indicator Bar at Bottom */}
      <div className="absolute bottom-4 z-20 flex items-center gap-2 text-xs font-mono font-black text-cyan-300 tracking-widest uppercase animate-pulse">
        <span>CỬA SÂN VẬN ĐỘNG Ở PHÍA TRƯỚC</span>
        <span className="text-white animate-bounce">⚡⚡⚡</span>
      </div>
    </div>
  );
};
