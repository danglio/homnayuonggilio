import React, { useState } from 'react';
import { Drink } from '../types/drink';
import { RARITY_CONFIG } from '../data/drinks';
import { MapPin, Navigation, ShoppingBag, RotateCcw, Heart, Share2, Sparkles, Coffee } from 'lucide-react';

interface DrinkResultCardProps {
  drink: Drink;
  onSpinAgain: () => void;
  onOpenCafeDirectory: (cafeName?: string) => void;
}

export const DrinkResultCard: React.FC<DrinkResultCardProps> = ({
  drink,
  onSpinAgain,
  onOpenCafeDirectory,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const rarity = RARITY_CONFIG[drink.rarity];

  const handleShare = () => {
    const text = `Hôm nay kèo nước của tôi là: ${drink.name} (${drink.price}k) tại ${drink.cafes.join(', ')}! Bạn uống gì?`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const getGoogleMapsUrl = (cafeName: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cafeName} gần đây`)}`;
  };

  const getGrabFoodUrl = () => {
    return `https://food.grab.com/vn/vi/restaurants?search=${encodeURIComponent(drink.name)}`;
  };

  const getShopeeFoodUrl = () => {
    return `https://shopeefood.vn/search?q=${encodeURIComponent(drink.name)}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto my-6 animate-in fade-in zoom-in-95 duration-500">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 ${rarity.border} p-6 sm:p-8 shadow-2xl ${rarity.glow}`}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: rarity.color }}
        />
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: rarity.color }}
        />

        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span
            className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            style={{ backgroundColor: `${rarity.color}25`, color: rarity.color, borderColor: rarity.color }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {rarity.tag} • {rarity.label}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              ~{drink.price}.000đ
            </span>
          </div>
        </div>

        {/* Center Main Image & Title */}
        <div className="text-center my-4">
          <div className="relative inline-block w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden border-2 border-zinc-700/80 shadow-2xl mb-3 transform hover:scale-105 transition-transform duration-300 bg-zinc-900">
            {drink.image ? (
              <img
                src={drink.image}
                alt={drink.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            ) : null}
            <div className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-black/75 backdrop-blur-md text-xl sm:text-2xl shadow-md border border-white/10">
              {drink.icon}
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {drink.name}
          </h2>
          <p className="text-zinc-400 text-sm mt-1 max-w-md mx-auto">
            {drink.sub}
          </p>
        </div>

        {/* Meme Quote Box */}
        <div className="my-4 p-3.5 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-center">
          <p className="text-amber-200 text-sm italic font-medium">
            "{drink.quip}"
          </p>
          <p className="text-zinc-400 text-xs mt-1">
            ⚡ Vibe: <span className="text-zinc-200 font-semibold">{drink.mood}</span>
          </p>
        </div>

        {/* Recommended Sugar & Ice Tuning */}
        <div className="grid grid-cols-2 gap-2.5 my-4 text-xs">
          <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex flex-col items-center text-center">
            <span className="text-zinc-400">Độ ngọt khuyên dùng</span>
            <span className="font-bold text-zinc-100 mt-0.5">{drink.recommendedSugar || '50% đường'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/50 flex flex-col items-center text-center">
            <span className="text-zinc-400">Đá & Nhiệt độ</span>
            <span className="font-bold text-zinc-100 mt-0.5">{drink.recommendedIce || '70% đá lạnh'}</span>
          </div>
        </div>

        {/* Suggested Cafes (Quán Cà Phê Gợi Ý) */}
        <div className="my-5 pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-400" />
              Quán cà phê phục vụ món này ngon nhất:
            </h3>
            <button
              onClick={() => onOpenCafeDirectory()}
              className="text-xs text-amber-400 hover:underline font-medium"
            >
              Xem tất cả quán →
            </button>
          </div>

          <div className="space-y-2">
            {drink.cafes.map((cafe, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-800 border border-zinc-700/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <span className="text-sm font-semibold text-zinc-100 truncate">
                    {cafe}
                  </span>
                </div>
                <a
                  href={getGoogleMapsUrl(cafe)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-700/80 hover:bg-amber-500 hover:text-black text-xs font-semibold text-zinc-200 transition-all shrink-0"
                  title="Tìm quán trên Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Chỉ đường</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Order Delivery Shortcuts (GrabFood / ShopeeFood) */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <a
            href={getGrabFoodUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
          >
            <Navigation className="w-4 h-4" />
            <span>Tìm trên GrabFood</span>
          </a>
          <a
            href={getShopeeFoodUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-orange-600/90 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Tìm ShopeeFood</span>
          </a>
        </div>

        {/* Action Buttons: Spin Again & Share */}
        <div className="flex items-center gap-2.5 pt-4 border-t border-zinc-800">
          <button
            onClick={onSpinAgain}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Quay Món Khác</span>
          </button>

          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`p-3 rounded-xl border transition-all ${
              isFavorited
                ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
            }`}
            title="Lưu món yêu thích"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 transition-all relative"
            title="Chia sẻ kèo nước"
          >
            <Share2 className="w-5 h-5" />
            {isCopied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-amber-400 text-black text-[10px] font-bold shadow-md whitespace-nowrap">
                Đã sao chép!
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
