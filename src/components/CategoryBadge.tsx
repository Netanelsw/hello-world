'use client';

import { cn } from '@/lib/cn';
import { Category, CATEGORIES } from '@/lib/types';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

const categoryColors: Record<Category, string> = {
  restaurant: 'bg-orange-100 text-orange-700',
  cafe: 'bg-amber-100 text-amber-700',
  doctor: 'bg-blue-100 text-blue-700',
  service: 'bg-green-100 text-green-700',
  store: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const cat = CATEGORIES.find((c) => c.value === category);
  if (!cat) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        categoryColors[category],
        className
      )}
    >
      <span>{cat.emoji}</span>
      <span>{cat.label}</span>
    </span>
  );
}
