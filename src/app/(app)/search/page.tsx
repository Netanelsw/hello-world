'use client';

import { useState } from 'react';
import { Search as SearchIcon, MapPin } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { demoPlaceDetails, demoPlaceSearchResults, DEMO_MODE } from '@/lib/demo-data';
import UserCard from '@/components/UserCard';
import Link from 'next/link';
import { PlaceSearchResult, Profile } from '@/lib/types';

type Tab = 'places' | 'users';

export default function SearchPage() {
  const { users, isFollowing, toggleFollow, currentUser } = useDemo();
  const [activeTab, setActiveTab] = useState<Tab>('places');
  const [query, setQuery] = useState('');
  const [placeResults, setPlaceResults] = useState<PlaceSearchResult[]>([]);
  const [userResults, setUserResults] = useState<Profile[]>([]);

  function handleSearch(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setPlaceResults([]);
      setUserResults([]);
      return;
    }

    if (activeTab === 'users') {
      const filtered = users.filter(
        (u) =>
          u.id !== currentUser.id &&
          (u.name.toLowerCase().includes(q.toLowerCase()) ||
            u.username.toLowerCase().includes(q.toLowerCase()))
      );
      setUserResults(filtered);
    } else {
      if (DEMO_MODE) {
        const allPlaces = [
          ...Object.entries(demoPlaceDetails).map(([id, p]) => ({
            place_id: id,
            name: p.name,
            address: p.address,
          })),
          ...demoPlaceSearchResults,
        ];
        setPlaceResults(
          allPlaces.filter(
            (p) =>
              p.name.toLowerCase().includes(q.toLowerCase()) ||
              p.address.toLowerCase().includes(q.toLowerCase())
          )
        );
      } else {
        fetch(`/api/places/search?q=${encodeURIComponent(q)}`)
          .then((r) => r.json())
          .then((data) => setPlaceResults(data.results || []))
          .catch(() => setPlaceResults([]));
      }
    }
  }

  function switchTab(tab: Tab) {
    setActiveTab(tab);
    setQuery('');
    setPlaceResults([]);
    setUserResults([]);
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={activeTab === 'places' ? 'Search places...' : 'Search users...'}
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => switchTab('places')}
            className={`flex-1 py-2.5 text-sm font-medium relative ${
              activeTab === 'places' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Places
            {activeTab === 'places' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => switchTab('users')}
            className={`flex-1 py-2.5 text-sm font-medium relative ${
              activeTab === 'users' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Users
            {activeTab === 'users' && (
              <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </header>

      {/* Results */}
      <div>
        {activeTab === 'places' ? (
          <div className="divide-y divide-border">
            {placeResults.map((place) => (
              <Link
                key={place.place_id}
                href={`/place/${place.place_id}`}
                className="flex items-center gap-3 p-4 hover:bg-muted transition-colors"
              >
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{place.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                </div>
              </Link>
            ))}
            {query.length >= 2 && placeResults.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-12">
                No places found for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {userResults.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFollowing={isFollowing(user.id)}
                onToggleFollow={() => toggleFollow(user.id)}
              />
            ))}
            {query.length >= 2 && userResults.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-12">
                No users found for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-16">
            <SearchIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {activeTab === 'places'
                ? 'Search for businesses and places'
                : 'Search for users to follow'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
