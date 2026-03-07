'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Check, MapPin } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { Category, CATEGORIES, PlaceSearchResult } from '@/lib/types';
import { demoPlaceSearchResults, demoPlaceDetails, DEMO_MODE } from '@/lib/demo-data';
import CategoryBadge from '@/components/CategoryBadge';

type Step = 'search' | 'comment' | 'category' | 'done';

export default function AddRecommendationPage() {
  const router = useRouter();
  const { addRecommendation } = useDemo();
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  async function handleSearch(query: string) {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    if (DEMO_MODE) {
      // Filter demo data + add some dynamic results
      const allPlaces = [
        ...Object.entries(demoPlaceDetails).map(([id, p]) => ({
          place_id: id,
          name: p.name,
          address: p.address,
        })),
        ...demoPlaceSearchResults,
      ];
      const filtered = allPlaces.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.address.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered.length > 0 ? filtered : [
        { place_id: `custom-${Date.now()}`, name: query, address: 'Custom place' },
      ]);
      setIsSearching(false);
      return;
    }

    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectPlace(place: PlaceSearchResult) {
    setSelectedPlace(place);
    setStep('comment');
  }

  function handleSubmitComment() {
    if (!comment.trim()) return;
    setStep('category');
  }

  function handleSelectCategory(cat: Category) {
    setCategory(cat);
    if (!selectedPlace) return;

    addRecommendation({
      user_id: 'demo-current-user',
      place_id: selectedPlace.place_id,
      place_name: selectedPlace.name,
      comment: comment.trim(),
      category: cat,
    });

    setStep('done');
  }

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Recommendation Added!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Your friends can now see your recommendation for {selectedPlace?.name}.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          Back to Feed
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center gap-3 px-4 h-14">
          <button
            onClick={() => {
              if (step === 'search') router.back();
              else if (step === 'comment') setStep('search');
              else if (step === 'category') setStep('comment');
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">
            {step === 'search' && 'Search Place'}
            {step === 'comment' && 'Add Comment'}
            {step === 'category' && 'Choose Category'}
          </h1>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: step === 'search' ? '33%' : step === 'comment' ? '66%' : '100%',
            }}
          />
        </div>
      </header>

      {/* Step 1: Search */}
      {step === 'search' && (
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for a business or place..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              autoFocus
            />
          </div>

          {isSearching && (
            <p className="text-center text-muted-foreground text-sm py-4">Searching...</p>
          )}

          <div className="space-y-1">
            {searchResults.map((place) => (
              <button
                key={place.place_id}
                onClick={() => handleSelectPlace(place)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{place.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{place.address}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Comment */}
      {step === 'comment' && selectedPlace && (
        <div className="p-4">
          <div className="bg-muted rounded-xl p-3 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div>
              <p className="font-medium text-sm">{selectedPlace.name}</p>
              <p className="text-xs text-muted-foreground">{selectedPlace.address}</p>
            </div>
          </div>

          <textarea
            placeholder="Why do you recommend this place?"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-32"
            autoFocus
          />

          <button
            onClick={handleSubmitComment}
            disabled={!comment.trim()}
            className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 3: Category */}
      {step === 'category' && (
        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-4">
            What category best describes this place?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleSelectCategory(cat.value)}
                className="flex items-center gap-3 p-4 border border-border rounded-xl hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="font-medium text-sm">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
