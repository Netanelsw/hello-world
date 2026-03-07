'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, X } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { demoPlaceDetails, DEMO_MODE } from '@/lib/demo-data';
import CategoryBadge from '@/components/CategoryBadge';
import Avatar from '@/components/Avatar';
import { Recommendation } from '@/lib/types';

export default function MapPage() {
  const router = useRouter();
  const { getFeedRecommendations } = useDemo();
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const feedRecs = getFeedRecommendations();

  // Group recommendations by place
  const placeMap = new Map<string, { recs: Recommendation[]; details: typeof demoPlaceDetails[string] | null }>();
  feedRecs.forEach((rec) => {
    if (!placeMap.has(rec.place_id)) {
      placeMap.set(rec.place_id, {
        recs: [],
        details: demoPlaceDetails[rec.place_id] || null,
      });
    }
    placeMap.get(rec.place_id)!.recs.push(rec);
  });

  const places = Array.from(placeMap.entries());
  const selectedPlaceData = selectedPlace ? placeMap.get(selectedPlace) : null;

  const hasGoogleMapsKey = !DEMO_MODE && !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-border z-40">
        <div className="flex items-center px-4 h-14">
          <MapPin className="w-5 h-5 text-primary mr-2" />
          <h1 className="text-lg font-bold">Map</h1>
          <span className="ml-auto text-xs text-muted-foreground">
            {places.length} places
          </span>
        </div>
      </header>

      {/* Map placeholder (demo mode) */}
      {!hasGoogleMapsKey ? (
        <div className="h-full bg-blue-50 flex flex-col items-center justify-center pt-14">
          {/* Simple visual map representation */}
          <div className="relative w-full h-full bg-gradient-to-b from-blue-50 to-green-50 overflow-hidden">
            {/* Grid lines to simulate a map */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
              ))}
            </div>

            {/* Place pins */}
            {places.map(([placeId, data], index) => {
              const details = data.details;
              // Distribute pins across the map area
              const positions = [
                { top: '25%', left: '30%' },
                { top: '35%', left: '55%' },
                { top: '45%', left: '25%' },
                { top: '30%', left: '70%' },
                { top: '55%', left: '45%' },
                { top: '40%', left: '60%' },
                { top: '50%', left: '35%' },
                { top: '35%', left: '40%' },
                { top: '60%', left: '55%' },
              ];
              const pos = positions[index % positions.length];

              return (
                <button
                  key={placeId}
                  onClick={() => setSelectedPlace(placeId)}
                  className={`absolute transform -translate-x-1/2 -translate-y-full transition-all ${
                    selectedPlace === placeId ? 'scale-125 z-30' : 'z-20 hover:scale-110'
                  }`}
                  style={pos}
                >
                  <div className="flex flex-col items-center">
                    <div className={`bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg ${
                      selectedPlace === placeId ? 'ring-2 ring-primary/30 ring-offset-2' : ''
                    }`}>
                      {data.recs.length}
                    </div>
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-primary -mt-0.5" />
                    <span className="text-[10px] font-medium bg-white/90 px-1.5 py-0.5 rounded mt-0.5 shadow-sm max-w-[80px] truncate">
                      {details?.name || data.recs[0]?.place_name}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Tel Aviv label */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-sm font-medium text-gray-400">
              Tel Aviv Area
            </div>

            {places.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Follow people to see their recommended places on the map.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center pt-14">
          <p className="text-sm text-muted-foreground">Google Maps would render here</p>
        </div>
      )}

      {/* Selected place card */}
      {selectedPlaceData && selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg border border-border p-4 z-30">
          <button
            onClick={() => setSelectedPlace(null)}
            className="absolute top-3 right-3"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={() => router.push(`/place/${selectedPlace}`)}
            className="text-left w-full"
          >
            <h3 className="font-bold text-sm pr-6">
              {selectedPlaceData.details?.name || selectedPlaceData.recs[0]?.place_name}
            </h3>
            {selectedPlaceData.details && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedPlaceData.details.address}
              </p>
            )}

            <div className="mt-3 space-y-2">
              {selectedPlaceData.recs.slice(0, 2).map((rec) => (
                <div key={rec.id} className="flex items-start gap-2">
                  <Avatar name={rec.profiles?.name || 'User'} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold">{rec.profiles?.name}</span>
                      <CategoryBadge category={rec.category} />
                    </div>
                    {rec.comment && (
                      <p className="text-xs text-muted-foreground truncate">{rec.comment}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-primary font-semibold mt-2">
              View all {selectedPlaceData.recs.length} recommendation{selectedPlaceData.recs.length !== 1 ? 's' : ''} →
            </p>
          </button>
        </div>
      )}
    </div>
  );
}
