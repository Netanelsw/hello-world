'use client';

import { useDemo } from '@/lib/demo-context';
import { MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import Avatar from '@/components/Avatar';
import RecommendationCard from '@/components/RecommendationCard';

export default function ProfilePage() {
  const { currentUser, getUserRecommendations, following, users } = useDemo();
  const myRecs = getUserRecommendations(currentUser.id);
  const followingUsers = users.filter((u) => following.includes(u.id));

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-lg font-bold">Profile</h1>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            Demo Mode
          </span>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-6 flex flex-col items-center text-center border-b border-border">
        <Avatar name={currentUser.name} url={currentUser.avatar_url} size="lg" />
        <h2 className="mt-3 text-xl font-bold">{currentUser.name}</h2>
        <p className="text-muted-foreground text-sm">@{currentUser.username}</p>
        {currentUser.bio && (
          <p className="text-sm mt-2 max-w-xs">{currentUser.bio}</p>
        )}

        <div className="flex gap-8 mt-4">
          <div className="text-center">
            <p className="font-bold text-lg">{myRecs.length}</p>
            <p className="text-xs text-muted-foreground">Recommendations</p>
          </div>
          <Link href="/profile/following" className="text-center hover:opacity-70">
            <p className="font-bold text-lg">{followingUsers.length}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </Link>
        </div>
      </div>

      {/* My Recommendations */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          My Recommendations
        </h3>
        <div className="space-y-3">
          {myRecs.length > 0 ? (
            myRecs.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t made any recommendations yet.
              </p>
              <Link
                href="/add"
                className="inline-block mt-3 text-primary text-sm font-semibold"
              >
                Add your first recommendation
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
