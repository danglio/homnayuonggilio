import React from 'react';
import { CAFE_BRANDS } from '../data/cafes';
import { X, MapPin, Sparkles, Coffee } from 'lucide-react';

interface CafeDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCafe: (cafeName: string) => void;
}

export const CafeDirectoryModal: React.FC<CafeDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectCafe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Danh Bạ Quán Cà Phê</h2>
              <p className="text-xs text-zinc-400">Các thương hiệu cà phê & trà nổi bật tại Việt Nam</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cafe Cards List */}
        <div className="p-5 overflow-y-auto space-y-3.5">
          {CAFE_BRANDS.map((cafe) => (
            <div
              key={cafe.id}
              className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cafe.icon}</span>
                  <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                    {cafe.name}
                  </h3>
                </div>
                <p className="text-xs text-zinc-400">{cafe.tagline}</p>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {cafe.signature.map((sig, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-[11px] text-zinc-300 font-medium"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                <button
                  onClick={() => {
                    onSelectCafe(cafe.name);
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 font-semibold text-xs transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quay quán này</span>
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Tìm vị trí trên Google Maps"
                >
                  <MapPin className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
