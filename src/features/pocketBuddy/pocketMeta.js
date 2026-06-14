import {
  Utensils,
  Coffee,
  UtensilsCrossed,
  ShoppingCart,
  Pencil,
  Bus,
  Clapperboard,
  Smartphone,
  Receipt,
  HelpCircle,
} from 'lucide-react';

/**
 * Crowdsourced spend categories -> icon + colour tokens used across the
 * transaction feed, the category breakdown bars, and the tagging prompt.
 */
export const CATEGORY_META = {
  food: { label: 'Food', Icon: Utensils, chip: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400', dot: 'bg-amber-400' },
  cafe: { label: 'Cafe', Icon: Coffee, chip: 'bg-orange-100 text-orange-700', bar: 'bg-orange-400', dot: 'bg-orange-400' },
  restaurant: { label: 'Restaurant', Icon: UtensilsCrossed, chip: 'bg-rose-100 text-rose-700', bar: 'bg-rose-400', dot: 'bg-rose-400' },
  grocery: { label: 'Grocery', Icon: ShoppingCart, chip: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-400', dot: 'bg-emerald-400' },
  stationery: { label: 'Stationery', Icon: Pencil, chip: 'bg-sky-100 text-sky-700', bar: 'bg-sky-400', dot: 'bg-sky-400' },
  transport: { label: 'Transport', Icon: Bus, chip: 'bg-indigo-100 text-indigo-700', bar: 'bg-indigo-400', dot: 'bg-indigo-400' },
  entertainment: { label: 'Entertainment', Icon: Clapperboard, chip: 'bg-fuchsia-100 text-fuchsia-700', bar: 'bg-fuchsia-400', dot: 'bg-fuchsia-400' },
  recharge: { label: 'Recharge & Bills', Icon: Smartphone, chip: 'bg-teal-100 text-teal-700', bar: 'bg-teal-400', dot: 'bg-teal-400' },
  general: { label: 'General', Icon: Receipt, chip: 'bg-gray-100 text-gray-700', bar: 'bg-gray-400', dot: 'bg-gray-400' },
  unknown: { label: 'Untagged', Icon: HelpCircle, chip: 'bg-gray-100 text-gray-500', bar: 'bg-gray-300', dot: 'bg-gray-300' },
};

/** Categories a user can pick when tagging a merchant (excludes 'unknown'). */
export const TAGGABLE_CATEGORIES = [
  'food',
  'cafe',
  'restaurant',
  'grocery',
  'stationery',
  'transport',
  'entertainment',
  'recharge',
  'general',
];

export function categoryOf(category) {
  return CATEGORY_META[category] || CATEGORY_META.unknown;
}

/** Format a number as INR (no paise). */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount ?? 0);
}
