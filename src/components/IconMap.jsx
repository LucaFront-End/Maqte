import {
  Settings, Building2, Wrench, Hammer, Cog, Leaf, Flame,
  Package, Search, Shield, Truck, Headphones, TrendingUp,
  Zap, Star, ShoppingCart, Scissors, CircleDot, Droplets,
  Wallet, Gem, Trophy, Wheat, Home
} from 'lucide-react';

const ICON_MAP = {
  settings: Settings,
  building: Building2,
  wrench: Wrench,
  hammer: Hammer,
  cog: Cog,
  leaf: Leaf,
  flame: Flame,
  package: Package,
  search: Search,
  shield: Shield,
  truck: Truck,
  headphones: Headphones,
  'trending-up': TrendingUp,
  zap: Zap,
  star: Star,
  'shopping-cart': ShoppingCart,
  scissors: Scissors,
  'circle-dot': CircleDot,
  droplets: Droplets,
  wallet: Wallet,
  gem: Gem,
  trophy: Trophy,
  wheat: Wheat,
  home: Home,
};

/**
 * Render a lucide icon by string name.
 * Falls back to null if icon name is not found.
 * @param {string} name - The icon key
 * @param {number} size - Icon size in px (default 18)
 * @param {object} props - Any additional SVG props
 */
export function CategoryIcon({ name, size = 18, ...props }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} {...props} />;
}

export default ICON_MAP;
