'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import Avatar from '@/components/Avatar';
import RecommendationCard from '@/components/RecommendationCard';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { users, getUserRecommendations, isFollowing, toggleFollow } = useDemo();

  const username = params.username as string;
  const user = users.find((u) => u.username === username);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">User not found</p>
        <button onClick={() => router.back()} className="text-primary text-sm mt-2 font-semibold">
          Go back
        </button>
      </div>
    );
  }

  const userRecs = getUserRecommendations(user.id);
  const following = isFollowing(user.id);

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold truncate">@{user.username}</h1>
        </div>
      </header>

      {/* Profile Info */}
      <div className="p-6 flex flex-col items-center text-center border-b border-border">
        <Avatar name={user.name} url={user.avatar_url} size="lg" />
        <h2 className="mt-3 text-xl font-bold">{user.name}</h2>
        <p className="text-muted-foreground text-sm">@{user.username}</p>
        {user.bio && <p className="text-sm mt-2 max-w-xs">{user.bio}</p>}

        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="font-bold text-lg">{userRecs.length}</p>
            <p className="text-xs text-muted-foreground">Recommendations</p>
          </div>
        </div>

        <button
          onClick={() => toggleFollow(user.id)}
          className={`mt-4 px-8 py-2 rounded-full text-sm font-semibold transition-colors ${
            following
              ? 'bg-muted text-foreground hover:bg-red-50 hover:text-red-600'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {following ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* User's Recommendations */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
          Recommendations ({userRecs.length})
        </h3>
        <div className="space-y-3">
          {userRecs.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} />
          ))}
          {userRecs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No recommendations yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
