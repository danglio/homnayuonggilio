import React from 'react';
import { Drink } from '../types/drink';
import { RARITY_CONFIG } from '../data/drinks';
import { X, History, Trash2, MapPin } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: { drink: Drink; timestamp: string }[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Lịch Sử Mở Hòm ({history.length})</h2>
              <p className="text-xs text-zinc-400">Các món đồ uống bạn đã quay trúng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-2.5 flex-1">
          {history.length === 0 ? (
            <div className="text-center py-10 text-zinc-500 text-xs">
              Chưa có lịch sử quay nào. Hãy bấm "Mở Hòm Nước" ngay!
            </div>
          ) : (
            history.map((item, idx) => {
              const rarity = RARITY_CONFIG[item.drink.rarity];
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0 flex items-center justify-center">
                      {item.drink.image ? (
                        <img
                          src={item.drink.image}
                          alt={item.drink.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : null}
                      <span className="text-xl select-none absolute inset-0 flex items-center justify-center -z-10">
                        {item.drink.icon}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{item.drink.name}</span>
                        <span
                          className="px-1.5 py-0.2 rounded text-[10px] font-bold"
                          style={{ color: rarity.color, backgroundColor: `${rarity.color}20` }}
                        >
                          {rarity.tag}
                        </span>
                      </div>
                      <div className="text-zinc-400 text-[11px] mt-0.5">
                        {item.drink.cafes[0]} • {item.drink.price}k • {item.timestamp}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.drink.cafes[0]} gần đây`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-amber-500 hover:text-black text-zinc-300 transition-all shrink-0"
                    title="Tìm quán"
                  >
                    <MapPin className="w-4 h-4" />
                  </a>
                </div>
              );
            })
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 shrink-0">
            <button
              onClick={onClearHistory}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-400 text-zinc-400 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Xóa Lịch Sử</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
