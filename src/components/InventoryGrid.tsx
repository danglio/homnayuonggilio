import React, { useState } from 'react';
import { Drink, RarityTier } from '../types/drink';
import { RARITY_CONFIG } from '../data/drinks';
import { Sparkles, MapPin, Eye, X, Trophy } from 'lucide-react';
import { FifaCard } from './FifaCard';

interface InventoryGridProps {
  drinks: Drink[];
  onSelectDrink?: (drink: Drink) => void;
}

const RARITY_ORDER: RarityTier[] = ['common', 'rare', 'mythical', 'legendary', 'exotic'];

export const InventoryGrid: React.FC<InventoryGridProps> = ({
  drinks,
  onSelectDrink,
}) => {
  const [previewDrink, setPreviewDrink] = useState<Drink | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<RarityTier | 'all'>('all');
  const [modalView, setModalView] = useState<'fifa' | 'details'>('fifa');

  // Filter & sort: Exotic/Legendary first, or by selected rarity
  const displayedDrinks = drinks
    .filter((d) => selectedRarity === 'all' || d.rarity === selectedRarity)
    .sort((a, b) => {
      const rarityDiff = RARITY_ORDER.indexOf(b.rarity) - RARITY_ORDER.indexOf(a.rarity);
      if (rarityDiff !== 0) return rarityDiff;
      return b.price - a.price;
    });

  return (
    <section className="w-full max-w-6xl mx-auto my-10 pt-8 border-t border-zinc-800/80">
      {/* Section Heading & Rarity Legend */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Danh Sách Vật Phẩm Trong Hòm</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-3">
            <span>Tất Cả Món Uống</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
              {displayedDrinks.length} món
            </span>
          </h2>
        </div>

        {/* Interactive Rarity Legend Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setSelectedRarity('all')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              selectedRarity === 'all'
                ? 'bg-zinc-100 text-black border-white shadow-md'
                : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            Tất cả
          </button>

          {RARITY_ORDER.map((tier) => {
            const cfg = RARITY_CONFIG[tier];
            const isSelected = selectedRarity === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedRarity(isSelected ? 'all' : tier)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  isSelected
                    ? 'shadow-md scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
                style={{
                  backgroundColor: isSelected ? `${cfg.color}25` : undefined,
                  borderColor: isSelected ? cfg.color : undefined,
                  color: isSelected ? cfg.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cfg.color }}
                />
                <span>{cfg.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Items (CS2 Case Content style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {displayedDrinks.map((drink) => {
          const rarity = RARITY_CONFIG[drink.rarity];
          return (
            <div
              key={drink.id}
              onClick={() => {
                setPreviewDrink(drink);
                if (onSelectDrink) onSelectDrink(drink);
              }}
              className={`group relative rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl select-none`}
              style={{
                borderBottom: `3px solid ${rarity.color}`,
              }}
            >
              {/* Card Image Container */}
              <div className="relative w-full aspect-square bg-zinc-950 overflow-hidden flex items-center justify-center p-2">
                {drink.image ? (
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <span className="text-3xl select-none absolute inset-0 flex items-center justify-center -z-10">
                  {drink.icon}
                </span>

                {/* Top Corner Rarity Tag */}
                <span
                  className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm"
                  style={{
                    backgroundColor: `${rarity.color}35`,
                    color: rarity.color,
                    border: `1px solid ${rarity.color}60`,
                  }}
                >
                  {rarity.tag}
                </span>

                {/* Price pill */}
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/75 text-amber-400 text-[10px] font-bold backdrop-blur-md">
                  {drink.price}k
                </span>
              </div>

              {/* Card Bottom Info */}
              <div className="p-2 bg-zinc-900/80">
                <h3 className="text-xs font-bold text-zinc-200 truncate group-hover:text-amber-400 transition-colors">
                  {drink.name}
                </h3>
                <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                  {drink.cafes[0]}
                </p>
              </div>

              {/* Hover Glow line */}
              <div
                className="absolute inset-x-0 bottom-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: rarity.color, boxShadow: `0 0 10px ${rarity.color}` }}
              />
            </div>
          );
        })}
      </div>

      {/* Quick View Item Dialog */}
      {previewDrink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5 sm:p-6 flex flex-col items-center">
            <button
              onClick={() => setPreviewDrink(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* View Tab Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-zinc-800 mb-4">
              <button
                onClick={() => setModalView('fifa')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modalView === 'fifa'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Thẻ FIFA 3D</span>
              </button>
              <button
                onClick={() => setModalView('details')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  modalView === 'details'
                    ? 'bg-zinc-800 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chi Tiết & Quán</span>
              </button>
            </div>

            {/* Content Tab 1: FIFA 3D Card */}
            {modalView === 'fifa' ? (
              <div className="flex flex-col items-center justify-center my-2">
                <FifaCard drink={previewDrink} isLarge={true} animateIn={true} />
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${previewDrink.name} gần đây`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-colors shadow-lg"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Tìm Quán Trên Google Maps</span>
                  </a>
                </div>
              </div>
            ) : (
              /* Content Tab 2: Standard Details */
              <div className="text-center w-full">
                <div className="relative inline-block w-36 h-36 rounded-3xl overflow-hidden border-2 border-zinc-700 shadow-2xl mb-3 bg-zinc-950">
                  {previewDrink.image && (
                    <img
                      src={previewDrink.image}
                      alt={previewDrink.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-xl bg-black/80 text-2xl">
                    {previewDrink.icon}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"
                    style={{
                      backgroundColor: `${RARITY_CONFIG[previewDrink.rarity].color}25`,
                      color: RARITY_CONFIG[previewDrink.rarity].color,
                    }}
                  >
                    {RARITY_CONFIG[previewDrink.rarity].tag} • {RARITY_CONFIG[previewDrink.rarity].label}
                  </span>
                  <span className="text-base font-black text-amber-400">
                    {previewDrink.price}.000đ
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white">{previewDrink.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{previewDrink.sub}</p>

                {/* Quote */}
                <div className="p-3 my-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs italic text-amber-200">
                  "{previewDrink.quip}"
                </div>

                {/* Cafes */}
                <div className="text-left my-3">
                  <p className="text-xs font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Quán phục vụ:
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {previewDrink.cafes.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 rounded-xl bg-zinc-800/80 text-xs"
                      >
                        <span className="text-zinc-200 font-semibold">{c}</span>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c} gần đây`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-700 hover:bg-amber-400 hover:text-black text-zinc-300 text-[11px] font-bold transition-colors"
                        >
                          <MapPin className="w-3 h-3" />
                          <span>Bản đồ</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setPreviewDrink(null)}
              className="w-full mt-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
