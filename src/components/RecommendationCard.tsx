'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import Avatar from './Avatar';
import CategoryBadge from './CategoryBadge';
import { Recommendation } from '@/lib/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { profiles: user, place_name, place_id, comment, category, created_at } = recommendation;

  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-3">
      {/* Header: User info */}
      <div className="flex items-center gap-3">
        <Link href={user ? `/profile/${user.username}` : '#'}>
          <Avatar name={user?.name || 'User'} url={user?.avatar_url} size="md" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={user ? `/profile/${user.username}` : '#'}
              className="font-semibold text-sm truncate hover:underline"
            >
              {user?.name || 'Unknown'}
            </Link>
            <span className="text-muted-foreground text-xs">recommended</span>
          </div>
          <p className="text-muted-foreground text-xs">{timeAgo(created_at)}</p>
        </div>
        <CategoryBadge category={category} />
      </div>

      {/* Place name */}
      <Link
        href={`/place/${place_id}`}
        className="flex items-center gap-2 group"
      >
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <span className="font-medium text-sm group-hover:text-primary transition-colors">
          {place_name}
        </span>
      </Link>

      {/* Comment */}
      {comment && (
        <p className="text-sm text-foreground leading-relaxed pl-6">
          &ldquo;{comment}&rdquo;
        </p>
      )}
    </div>
  );
}
