'use client';

import Link from 'next/link';
import { MessageCircleQuestion, MessageSquare } from 'lucide-react';
import Avatar from './Avatar';
import { RecommendationRequest } from '@/lib/types';

interface RequestCardProps {
  request: RecommendationRequest;
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
  return new Date(dateStr).toLocaleDateString();
}

export default function RequestCard({ request }: RequestCardProps) {
  const { profiles: user, text, created_at, responses, id } = request;
  const responseCount = responses?.length || 0;

  return (
    <Link href={`/request/${id}`}>
      <div className="bg-white border border-border rounded-xl p-4 space-y-3 hover:border-primary/30 transition-colors">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Avatar name={user?.name || 'User'} url={user?.avatar_url} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate">{user?.name}</span>
              <span className="text-muted-foreground text-xs">is asking</span>
            </div>
            <p className="text-muted-foreground text-xs">{timeAgo(created_at)}</p>
          </div>
          <MessageCircleQuestion className="w-5 h-5 text-primary" />
        </div>

        {/* Question */}
        <p className="text-sm text-foreground leading-relaxed">
          {text}
        </p>

        {/* Response count */}
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>
            {responseCount === 0
              ? 'No responses yet'
              : `${responseCount} response${responseCount > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
