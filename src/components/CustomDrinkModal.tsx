import React, { useState } from 'react';
import { Drink, DrinkCategory, PriceTier, RarityTier, CaffeineLevel } from '../types/drink';
import { X, Plus, Sparkles } from 'lucide-react';

interface CustomDrinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDrink: (newDrink: Drink) => void;
}

export const CustomDrinkModal: React.FC<CustomDrinkModalProps> = ({
  isOpen,
  onClose,
  onAddDrink,
}) => {
  const [name, setName] = useState('');
  const [sub, setSub] = useState('');
  const [cafe, setCafe] = useState('');
  const [price, setPrice] = useState(35);
  const [category, setCategory] = useState<DrinkCategory>('coffee');
  const [quip, setQuip] = useState('');
  const [icon, setIcon] = useState('🥤');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const priceTier: PriceTier = price < 30 ? 'budget' : price <= 55 ? 'standard' : 'premium';
    const rarity: RarityTier = price > 60 ? 'legendary' : price > 40 ? 'rare' : 'common';
    const caffeine: CaffeineLevel = category === 'coffee' || category === 'modern' ? 'high' : category === 'milktea' ? 'medium' : 'none';

    const newDrink: Drink = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      sub: sub.trim() || 'Món uống sáng tạo của bạn',
      category,
      price: Number(price) || 35,
      priceTier,
      rarity,
      cafes: [cafe.trim() || 'Quán quen của bạn'],
      caffeine,
      mood: 'Món ruột tự thêm',
      quip: quip.trim() || 'Món tự chọn chuẩn gu không đụng hàng!',
      icon: icon || '🥤',
      isCustom: true,
    };

    onAddDrink(newDrink);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Plus className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Thêm Món Uống Của Bạn</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Tên món uống *</label>
            <input
              type="text"
              required
              placeholder="VD: Trà lài hạt sen đác thơm..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Thể loại</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DrinkCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-amber-400 outline-none"
              >
                <option value="coffee">Cà phê</option>
                <option value="milktea">Trà sữa</option>
                <option value="fruittea">Trà trái cây</option>
                <option value="modern">Cold Brew / Ý</option>
                <option value="healthy">Nước ép / Sinh tố</option>
                <option value="iceblended">Đá xay</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Giá dự kiến (k)</label>
              <input
                type="number"
                min="5"
                max="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:border-amber-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Quán bán món này</label>
            <input
              type="text"
              placeholder="VD: Quán cà phê đầu hẻm, Highlands..."
              value={cafe}
              onChange={(e) => setCafe(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Biểu tượng (Emoji)</label>
            <div className="flex gap-2 text-xl">
              {['☕', '🧋', '🍵', '🍑', '🧊', '🥑', '🥤', '🥥', '⭐'].map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  className={`p-2 rounded-xl border ${
                    icon === emoji ? 'bg-amber-500/20 border-amber-400' : 'bg-zinc-950 border-zinc-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-zinc-300 font-semibold mb-1">Câu quote vui / Meme</label>
            <input
              type="text"
              placeholder="VD: Uống một ly là tỉnh táo tới sáng mai..."
              value={quip}
              onChange={(e) => setQuip(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:border-amber-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Thêm Món Vào Hòm Quay</span>
          </button>
        </form>
      </div>
    </div>
  );
};
