import { Drink, RarityTier } from '../types/drink';

export interface FifaCardStats {
  ovr: number;
  position: 'CF' | 'TS' | 'TC' | 'DX' | 'JU';
  positionLabel: string;
  cardType: 'toty' | 'icon' | 'tots' | 'inform' | 'gold';
  cardTypeLabel: string;
  originFlag: string;
  originCountry: string;
  clubBrand: string;
  stats: {
    ngo: number; // Độ ngọt (Sweetness)
    caf: number; // Caffeine
    mat: number; // Mát lạnh (Cooling)
    hot: number; // Hot trend
    gia: number; // Kinh tế / Giá hời
    nlu: number; // Năng lượng tỉnh táo
  };
}

export function getFifaCardData(drink: Drink): FifaCardStats {
  // Determine Card Type & OVR
  let cardType: FifaCardStats['cardType'] = 'gold';
  let cardTypeLabel = 'Vàng Tiêu Chuẩn';
  let baseOvr = 83;

  switch (drink.rarity) {
    case 'exotic':
      cardType = 'toty';
      cardTypeLabel = 'TOTY • Cực Phẩm Đỉnh Cao';
      baseOvr = 97;
      break;
    case 'legendary':
      cardType = 'icon';
      cardTypeLabel = 'ICON • Huyền Thoại Bất Tử';
      baseOvr = 94;
      break;
    case 'mythical':
      cardType = 'tots';
      cardTypeLabel = 'TOTS • Siêu Phẩm Mùa Giải';
      baseOvr = 91;
      break;
    case 'rare':
      cardType = 'inform';
      cardTypeLabel = 'In-Form • Món Tuyển Chọn';
      baseOvr = 88;
      break;
    case 'common':
    default:
      cardType = 'gold';
      cardTypeLabel = 'Thẻ Vàng Phổ Thông';
      baseOvr = 84;
      break;
  }

  // Slight deterministic variance based on name length
  const hash = drink.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const ovr = Math.min(99, Math.max(80, baseOvr + (hash % 3)));

  // Position
  let position: FifaCardStats['position'] = 'CF';
  let positionLabel = 'Cà Phê';

  switch (drink.category) {
    case 'coffee':
    case 'modern':
      position = 'CF';
      positionLabel = 'Cà Phê (Tiền Đạo)';
      break;
    case 'milktea':
      position = 'TS';
      positionLabel = 'Trà Sữa (Nhạc Trưởng)';
      break;
    case 'fruittea':
      position = 'TC';
      positionLabel = 'Trà Trái Cây (Tiền Vệ)';
      break;
    case 'iceblended':
      position = 'DX';
      positionLabel = 'Đá Xay (Hộ Công)';
      break;
    case 'healthy':
    default:
      position = 'JU';
      positionLabel = 'Nước Ép / Healthy';
      break;
  }

  // Origin (Country)
  let originFlag = '🇻🇳';
  let originCountry = 'Việt Nam';

  const lowerName = drink.name.toLowerCase();
  if (lowerName.includes('thái')) {
    originFlag = '🇹🇭';
    originCountry = 'Thái Lan';
  } else if (lowerName.includes('matcha') || lowerName.includes('genmaicha')) {
    originFlag = '🇯🇵';
    originCountry = 'Nhật Bản';
  } else if (lowerName.includes('espresso') || lowerName.includes('latte') || lowerName.includes('cold brew') || lowerName.includes('cappuccino') || lowerName.includes('mocha')) {
    originFlag = '🇮🇹';
    originCountry = 'Ý (Italia)';
  } else if (lowerName.includes('ô long') || lowerName.includes('đường đen') || lowerName.includes('gong cha') || lowerName.includes('trân châu')) {
    originFlag = '🇹🇼';
    originCountry = 'Đài Loan';
  } else if (lowerName.includes('quảng châu')) {
    originFlag = '🇨🇳';
    originCountry = 'Trung Hoa';
  }

  // Brand / Club
  const clubBrand = drink.cafes[0] || 'Quán Cà Phê Ruột';

  // 6 FIFA Attributes
  // NGO (Sweetness): based on recommendedSugar
  let ngo = 85;
  const sugar = drink.recommendedSugar || '';
  if (sugar.includes('30%') || sugar.includes('Không đường')) ngo = 68;
  else if (sugar.includes('50%')) ngo = 78;
  else if (sugar.includes('70%') || sugar.includes('100%')) ngo = 95;

  // CAF (Caffeine):
  let caf = 50;
  if (drink.caffeine === 'high') caf = 98;
  else if (drink.caffeine === 'medium') caf = 82;
  else if (drink.caffeine === 'low') caf = 65;
  else caf = 30;

  // MAT (Lạnh mát):
  let mat = 88;
  if (drink.category === 'fruittea' || drink.category === 'iceblended' || drink.category === 'healthy') mat = 96;
  if (lowerName.includes('nóng')) mat = 25;

  // HOT (Độ Hot Trend / Viral):
  let hot = 80;
  if (drink.rarity === 'exotic') hot = 99;
  else if (drink.rarity === 'legendary') hot = 96;
  else if (drink.rarity === 'mythical') hot = 91;
  else if (drink.rarity === 'rare') hot = 86;

  // GIA (Kinh tế / Giá tốt - price in k):
  let gia = 85;
  if (drink.price < 30) gia = 96;
  else if (drink.price <= 50) gia = 88;
  else gia = 75;

  // NLU (Năng lượng tỉnh táo):
  const nlu = Math.min(99, Math.round((caf * 0.6 + ngo * 0.4)));

  return {
    ovr,
    position,
    positionLabel,
    cardType,
    cardTypeLabel,
    originFlag,
    originCountry,
    clubBrand,
    stats: {
      ngo,
      caf,
      mat,
      hot,
      gia,
      nlu,
    },
  };
}
