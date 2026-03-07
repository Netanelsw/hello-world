'use client';

import { useState } from 'react';
import { useDemo } from '@/lib/demo-context';
import RecommendationCard from '@/components/RecommendationCard';
import RequestCard from '@/components/RequestCard';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

type Tab = 'recommendations' | 'requests';

export default function HomePage() {
  const { getFeedRecommendations, requests, following } = useDemo();
  const [activeTab, setActiveTab] = useState<Tab>('recommendations');

  const feedRecs = getFeedRecommendations();
  const feedRequests = requests.filter(
    (r) => following.includes(r.user_id) || r.user_id === 'demo-current-user'
  );

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-border z-40 safe-top">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-lg font-bold">TrustMap</h1>
          </div>
          <Link
            href="/ask"
            className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors"
          >
            Ask Friends
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === 'recommendations'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Recommendations
            {activeTab === 'recommendations' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === 'requests'
                ? 'text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Requests
            {activeTab === 'requests' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Feed */}
      <div className="p-4 space-y-3">
        {activeTab === 'recommendations' ? (
          feedRecs.length > 0 ? (
            feedRecs.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))
          ) : (
            <EmptyState
              title="No recommendations yet"
              description="Follow people to see their recommendations here."
            />
          )
        ) : feedRequests.length > 0 ? (
          feedRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))
        ) : (
          <EmptyState
            title="No requests yet"
            description="Ask your friends for a recommendation!"
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center py-12">
      <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
