import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { DRINKS_DATA } from './data/drinks';
import { Drink, SpinFilter } from './types/drink';
import { CaseRoulette } from './components/CaseRoulette';
import { DrinkResultCard } from './components/DrinkResultCard';
import { FilterBar } from './components/FilterBar';
import { CafeDirectoryModal } from './components/CafeDirectoryModal';
import { CustomDrinkModal } from './components/CustomDrinkModal';
import { HistoryModal } from './components/HistoryModal';
import { InventoryGrid } from './components/InventoryGrid';
import { FifaPackOpening } from './components/FifaPackOpening';
import { GithubIcon, FacebookIcon } from './components/SocialIcons';
import { soundFx } from './lib/audio';
import { 
  Coffee, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  PlusCircle, 
  History as HistoryIcon, 
  Store,
  Flame,
  Zap,
  Share2,
  Palette,
  Trophy
} from 'lucide-react';

export function App() {
  // Filters State
  const [filters, setFilters] = useState<SpinFilter>({
    category: 'all',
    priceTier: 'all',
    caffeine: 'all',
    cafe: 'all',
    searchQuery: '',
  });

  // Custom drinks & history persisted in localStorage
  const [customDrinks, setCustomDrinks] = useState<Drink[]>(() => {
    try {
      const saved = localStorage.getItem('hnu_custom_drinks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [history, setHistory] = useState<{ drink: Drink; timestamp: string }[]>(() => {
    try {
      const saved = localStorage.getItem('hnu_spin_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRolling, setIsRolling] = useState(false);
  const [targetDrink, setTargetDrink] = useState<Drink | null>(null);
  const [wonDrink, setWonDrink] = useState<Drink | null>(null);
  const [theme, setTheme] = useState<'warehouse' | 'cafe'>('warehouse');
  const [gameMode, setGameMode] = useState<'cs2' | 'fifa'>('cs2');

  // Modals state
  const [isCafeModalOpen, setIsCafeModalOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Sync soundFx
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Save custom drinks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hnu_custom_drinks', JSON.stringify(customDrinks));
    } catch {
      // Ignore
    }
  }, [customDrinks]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('hnu_spin_history', JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Combined pool of drinks
  const allDrinks = useMemo(() => {
    return [...customDrinks, ...DRINKS_DATA];
  }, [customDrinks]);

  // Filtered pool
  const filteredDrinks = useMemo(() => {
    return allDrinks.filter((d) => {
      if (filters.category !== 'all' && d.category !== filters.category) return false;
      if (filters.priceTier !== 'all' && d.priceTier !== filters.priceTier) return false;
      if (filters.caffeine !== 'all' && d.caffeine !== filters.caffeine) return false;
      if (filters.cafe !== 'all' && !d.cafes.some((c) => c.toLowerCase().includes(filters.cafe.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [allDrinks, filters]);

  // Trigger spin
  const handleStartSpin = () => {
    if (isRolling) return;
    const pool = filteredDrinks.length > 0 ? filteredDrinks : allDrinks;
    if (!pool.length) return;

    soundFx.playClick();
    setWonDrink(null);

    // Weighted random selection: Rarer items have slightly lower probability for authentic CS2 feel
    const selected = pool[Math.floor(Math.random() * pool.length)];
    setTargetDrink(selected);
    setIsRolling(true);
  };

  // Spin ended
  const handleSpinEnd = () => {
    setIsRolling(false);
    if (targetDrink) {
      setWonDrink(targetDrink);

      // Trigger Confetti explosion
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#ec4899'],
      });

      // Add to history
      const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setHistory((prev) => [{ drink: targetDrink, timestamp: nowStr }, ...prev.slice(0, 49)]);
    }
  };

  const handleAddCustomDrink = (drink: Drink) => {
    setCustomDrinks((prev) => [drink, ...prev]);
  };

  const activeBackgroundClass = 
    gameMode === 'fifa' 
      ? 'bg-fifa-theme' 
      : theme === 'warehouse' 
        ? 'bg-warehouse-theme' 
        : 'bg-cafe-theme';

  return (
    <div className={`min-h-screen ${activeBackgroundClass} text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black transition-all duration-700 relative`}>
      {/* Authentic Ambient Glows */}
      <div className="ambient-lighting" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between gap-3 sm:gap-4 pb-6 border-b border-zinc-800/80 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden shadow-lg shadow-amber-500/25 border-2 border-amber-400/40 p-0.5 bg-zinc-900 group shrink-0">
              <img
                src="/logo.png"
                alt="Hôm Nay Uống Gì Logo"
                className="w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>Hôm Nay Uống Gì?</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  {gameMode === 'cs2' ? 'CS2 Roulette' : 'FIFA EA FC'}
                </span>
              </h1>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Vòng quay giải cứu cơn phân vân • Gợi ý quán cà phê & Đặt món tức thì
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Social GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Mã nguồn GitHub"
            >
              <GithubIcon className="w-4 h-4 text-zinc-300" />
              <span className="hidden xl:inline">GitHub</span>
            </a>

            {/* Social Facebook Share */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://homnayuonggi.vn')}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl bg-blue-900/30 hover:bg-blue-900/50 border border-blue-700/50 text-blue-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Chia sẻ lên Facebook"
            >
              <FacebookIcon className="w-4 h-4 text-blue-400" />
              <span className="hidden xl:inline">Chia Sẻ</span>
            </a>

            <button
              onClick={() => {
                soundFx.playClick();
                setTheme(theme === 'warehouse' ? 'cafe' : 'warehouse');
              }}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title={theme === 'warehouse' ? 'Đổi sang nền Quán Cà Phê ấm cúng' : 'Đổi sang nền Kho Hòm CS2'}
            >
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">{theme === 'warehouse' ? 'Kho CS2' : 'Quán Cafe'}</span>
            </button>

            <button
              onClick={() => setIsCafeModalOpen(true)}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Danh bạ quán cà phê"
            >
              <Store className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Quán Cà Phê</span>
            </button>

            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Thêm món riêng của bạn"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Thêm Món</span>
            </button>

            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5 relative"
              title="Lịch sử mở hòm"
            >
              <HistoryIcon className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline">Lịch Sử</span>
              {history.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
              )}
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setSoundEnabled(!soundEnabled);
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-colors"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>
          </div>
        </header>

        {/* Game Mode Switcher: CS2 Case vs FIFA Online Pack */}
        <div className="flex items-center justify-center my-4">
          <div className="inline-flex p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl backdrop-blur-md">
            <button
              onClick={() => {
                soundFx.playClick();
                setGameMode('cs2');
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                gameMode === 'cs2'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25 scale-102'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>🎯 Mở Hòm CS2</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setGameMode('fifa');
              }}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                gameMode === 'fifa'
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 scale-102'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>⚽ Mở Thẻ FIFA Online</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          itemCount={filteredDrinks.length}
        />

        {gameMode === 'cs2' ? (
          <>
            {/* CS2 Case Roulette Track */}
            <CaseRoulette
              items={filteredDrinks.length > 0 ? filteredDrinks : allDrinks}
              targetItem={targetDrink}
              isRolling={isRolling}
              onSpinEnd={handleSpinEnd}
            />

            {/* Big Spin Action Button */}
            <div className="flex flex-col items-center justify-center my-4">
              <button
                onClick={handleStartSpin}
                disabled={isRolling}
                className={`group relative px-8 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl uppercase tracking-wider flex items-center gap-3 transition-all duration-300 ${
                  isRolling
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                    : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95'
                }`}
              >
                {isRolling ? (
                  <>
                    <Zap className="w-6 h-6 animate-pulse text-amber-400" />
                    <span>Đang Mở Hòm...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-6 h-6 text-black group-hover:animate-bounce" />
                    <span>Mở Hòm Nước Hôm Nay</span>
                    <Sparkles className="w-5 h-5 text-black" />
                  </>
                )}
              </button>
              <p className="text-zinc-500 text-xs mt-2.5">
                Phím tắt: Bấm nút để quay ngẫu nhiên theo tiêu chí đã chọn
              </p>
            </div>

            {/* Result Showcase Card */}
            {wonDrink && !isRolling && (
              <DrinkResultCard
                drink={wonDrink}
                onSpinAgain={handleStartSpin}
                onOpenCafeDirectory={(cafe) => {
                  if (cafe) setFilters({ ...filters, cafe });
                  setIsCafeModalOpen(true);
                }}
              />
            )}
          </>
        ) : (
          /* FIFA Pack Opening Arena */
          <FifaPackOpening
            drinks={filteredDrinks.length > 0 ? filteredDrinks : allDrinks}
            onOpenCafeDirectory={(cafe) => {
              if (cafe) setFilters({ ...filters, cafe });
              setIsCafeModalOpen(true);
            }}
          />
        )}

        {/* Cafe Discovery Quick Bar */}
        <div className="mt-8 p-4 rounded-3xl bg-zinc-900/40 border border-zinc-800/80">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold text-zinc-300 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              Thương hiệu nổi bật trong hệ thống:
            </span>
            <button
              onClick={() => setIsCafeModalOpen(true)}
              className="text-amber-400 hover:underline font-semibold"
            >
              Xem chi tiết 10 chuỗi quán →
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {['Highlands', 'Phúc Long', 'Phê La', 'Katinat', 'The Coffee House', 'Cheese Coffee', 'Starbucks', 'Cà Phê Vỉa Hè'].map((brand, i) => (
              <button
                key={i}
                onClick={() => {
                  setFilters({ ...filters, cafe: brand === 'Cà Phê Vỉa Hè' ? 'Cà Phê Vỉa Hè / Bệt / Quán Cóc' : brand });
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white whitespace-nowrap transition-colors"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Grid: Case Contents & All Items */}
        <InventoryGrid
          drinks={allDrinks}
          onSelectDrink={(drink) => {
            soundFx.playClick();
            setWonDrink(drink);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-xs text-zinc-500 border-t border-zinc-850 bg-zinc-950/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <img src="/logo.png" alt="Logo" className="w-7 h-7 rounded-lg border border-amber-400/30" />
            <div>
              <p className="font-bold text-zinc-300">
                Hôm Nay Uống Gì? • CS2 & EA FC Drink Roulette
              </p>
              <p className="text-[11px] text-zinc-500">
                Ứng dụng mở hòm & khám phá quán cà phê độc lập tại Việt Nam
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-zinc-700">•</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://homnayuonggi.vn')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CafeDirectoryModal
        isOpen={isCafeModalOpen}
        onClose={() => setIsCafeModalOpen(false)}
        onSelectCafe={(cafeName) => setFilters({ ...filters, cafe: cafeName })}
      />

      <CustomDrinkModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onAddDrink={handleAddCustomDrink}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
}
