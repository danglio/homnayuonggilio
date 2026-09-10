export type DrinkCategory = 
  | 'coffee'      // Cà phê truyền thống & Việt Nam
  | 'milktea'     // Trà sữa & Topping
  | 'fruittea'    // Trà trái cây & Trà thanh mát
  | 'modern'      // Cà phê Ý, Espresso & Cold Brew
  | 'healthy'     // Nước ép, Sinh tố & Không đường
  | 'iceblended'; // Đá xay & Chocolate

export type PriceTier = 'budget' | 'standard' | 'premium'; // <30k | 30k-55k | >55k

export type CaffeineLevel = 'none' | 'low' | 'medium' | 'high';

export type RarityTier = 'common' | 'rare' | 'mythical' | 'legendary' | 'exotic';

export interface Drink {
  id: string;
  name: string;
  sub: string;
  category: DrinkCategory;
  price: number; // in thousands VND (ví dụ 35 = 35.000đ)
  priceTier: PriceTier;
  rarity: RarityTier;
  cafes: string[];
  caffeine: CaffeineLevel;
  mood: string;
  quip: string;
  icon: string;
  image?: string;
  recommendedSugar?: string;
  recommendedIce?: string;
  badgeColor?: string;
  isCustom?: boolean;
}

export interface CafeBrand {
  id: string;
  name: string;
  tagline: string;
  brandColor: string;
  icon: string;
  signature: string[];
  mapsQuery: string;
}

export interface SpinFilter {
  category: DrinkCategory | 'all';
  priceTier: PriceTier | 'all';
  caffeine: CaffeineLevel | 'all';
  cafe: string | 'all';
  searchQuery: string;
}
