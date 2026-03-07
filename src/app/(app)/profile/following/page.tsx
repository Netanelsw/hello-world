'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import UserCard from '@/components/UserCard';

export default function FollowingPage() {
  const router = useRouter();
  const { users, following, isFollowing, toggleFollow, currentUser } = useDemo();

  const followingUsers = users.filter(
    (u) => following.includes(u.id) && u.id !== currentUser.id
  );

  return (
    <div>
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Following</h1>
        </div>
      </header>

      <div className="divide-y divide-border">
        {followingUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            isFollowing={isFollowing(user.id)}
            onToggleFollow={() => toggleFollow(user.id)}
          />
        ))}
        {followingUsers.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">
            You&apos;re not following anyone yet.
          </p>
        )}
      </div>
    </div>
  );
}
