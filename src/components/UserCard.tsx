'use client';

import Link from 'next/link';
import Avatar from './Avatar';
import { Profile } from '@/lib/types';

interface UserCardProps {
  user: Profile;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  showFollowButton?: boolean;
}

export default function UserCard({ user, isFollowing, onToggleFollow, showFollowButton = true }: UserCardProps) {
  return (
    <div className="flex items-center gap-3 p-3">
      <Link href={`/profile/${user.username}`}>
        <Avatar name={user.name} url={user.avatar_url} size="md" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/profile/${user.username}`} className="font-semibold text-sm hover:underline truncate block">
          {user.name}
        </Link>
        <p className="text-muted-foreground text-xs truncate">@{user.username}</p>
      </div>
      {showFollowButton && onToggleFollow && (
        <button
          onClick={onToggleFollow}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            isFollowing
              ? 'bg-muted text-foreground hover:bg-red-50 hover:text-red-600'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}
