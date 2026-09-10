import React from 'react';
import { DrinkCategory, PriceTier, CaffeineLevel, SpinFilter } from '../types/drink';
import { CAFE_BRANDS } from '../data/cafes';
import { Filter, DollarSign, Zap, Store } from 'lucide-react';

interface FilterBarProps {
  filters: SpinFilter;
  onChange: (newFilters: SpinFilter) => void;
  itemCount: number;
}

const CATEGORIES: { id: DrinkCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'Tất Cả Món', icon: '✨' },
  { id: 'coffee', label: 'Cà Phê Truyền Thống', icon: '☕' },
  { id: 'milktea', label: 'Trà Sữa & Topping', icon: '🧋' },
  { id: 'fruittea', label: 'Trà Trái Cây', icon: '🍑' },
  { id: 'modern', label: 'Cà Phê Ý & Cold Brew', icon: '🧊' },
  { id: 'healthy', label: 'Nước Ép & Sinh Tố', icon: '🥑' },
  { id: 'iceblended', label: 'Đá Xay & Socola', icon: '🍧' },
];

const PRICE_TIERS: { id: PriceTier | 'all'; label: string }[] = [
  { id: 'all', label: 'Mọi giá' },
  { id: 'budget', label: 'Dưới 30k' },
  { id: 'standard', label: '30k - 55k' },
  { id: 'premium', label: 'Trên 55k' },
];

const CAFFEINE_LEVELS: { id: CaffeineLevel | 'all'; label: string }[] = [
  { id: 'all', label: 'Caffeine bất kỳ' },
  { id: 'high', label: '⚡ Đô mạnh (Tỉnh ngủ)' },
  { id: 'medium', label: '☕ Vừa phải' },
  { id: 'low', label: '🍃 Nhẹ nhàng' },
  { id: 'none', label: '🚫 Không Caffeine' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  itemCount,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto my-4 space-y-3">
      {/* Category Horizontal Scroll Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: cat.id })}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Row (Budget, Caffeine, Cafe Brand) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Price Selector */}
          <div className="flex items-center gap-1 bg-zinc-950/60 px-2.5 py-1.5 rounded-xl border border-zinc-800">
            <DollarSign className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={filters.priceTier}
              onChange={(e) => onChange({ ...filters, priceTier: e.target.value as PriceTier | 'all' })}
              className="bg-transparent text-zinc-200 outline-none cursor-pointer"
            >
              {PRICE_TIERS.map((p) => (
                <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Caffeine Level */}
          <div className="flex items-center gap-1 bg-zinc-950/60 px-2.5 py-1.5 rounded-xl border border-zinc-800">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={filters.caffeine}
              onChange={(e) => onChange({ ...filters, caffeine: e.target.value as CaffeineLevel | 'all' })}
              className="bg-transparent text-zinc-200 outline-none cursor-pointer"
            >
              {CAFFEINE_LEVELS.map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cafe Brand Filter */}
          <div className="flex items-center gap-1 bg-zinc-950/60 px-2.5 py-1.5 rounded-xl border border-zinc-800">
            <Store className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={filters.cafe}
              onChange={(e) => onChange({ ...filters, cafe: e.target.value })}
              className="bg-transparent text-zinc-200 outline-none cursor-pointer"
            >
              <option value="all" className="bg-zinc-900 text-white">Tất cả thương hiệu</option>
              {CAFE_BRANDS.map((cafe) => (
                <option key={cafe.id} value={cafe.name} className="bg-zinc-900 text-white">
                  {cafe.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Count Badge */}
        <div className="text-zinc-400 text-xs flex items-center gap-1 ml-auto">
          <Filter className="w-3.5 h-3.5" />
          <span>{itemCount} món trong hòm</span>
        </div>
      </div>
    </div>
  );
};
