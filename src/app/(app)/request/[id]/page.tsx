'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Send } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { demoPlaceDetails, demoPlaceSearchResults, DEMO_MODE } from '@/lib/demo-data';
import Avatar from '@/components/Avatar';
import { PlaceSearchResult } from '@/lib/types';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { requests, addResponse } = useDemo();
  const [showRespond, setShowRespond] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceSearchResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceSearchResult | null>(null);
  const [comment, setComment] = useState('');

  const request = requests.find((r) => r.id === params.id);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Request not found</p>
        <button onClick={() => router.back()} className="text-primary text-sm mt-2 font-semibold">
          Go back
        </button>
      </div>
    );
  }

  function handleSearch(q: string) {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    if (DEMO_MODE) {
      const allPlaces = [
        ...Object.entries(demoPlaceDetails).map(([id, p]) => ({
          place_id: id,
          name: p.name,
          address: p.address,
        })),
        ...demoPlaceSearchResults,
      ];
      setSearchResults(
        allPlaces.filter(
          (p) =>
            p.name.toLowerCase().includes(q.toLowerCase()) ||
            p.address.toLowerCase().includes(q.toLowerCase())
        )
      );
    }
  }

  function handleSubmitResponse() {
    if (!selectedPlace || !comment.trim() || !request) return;
    addResponse(request.id, selectedPlace.place_id, selectedPlace.name, comment.trim());
    setShowRespond(false);
    setSelectedPlace(null);
    setComment('');
    setSearchQuery('');
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Request</h1>
        </div>
      </header>

      {/* Original Request */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <Avatar name={request.profiles?.name || 'User'} url={request.profiles?.avatar_url} />
          <div>
            <p className="font-semibold text-sm">{request.profiles?.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <p className="text-sm">{request.text}</p>
      </div>

      {/* Responses */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Responses ({request.responses?.length || 0})
        </h3>

        <div className="space-y-3">
          {request.responses?.map((resp) => (
            <div key={resp.id} className="border border-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={resp.profiles?.name || 'User'} url={resp.profiles?.avatar_url} size="sm" />
                <span className="font-semibold text-xs">{resp.profiles?.name}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-sm font-medium">{resp.place_name}</span>
              </div>
              {resp.comment && (
                <p className="text-xs text-muted-foreground pl-5.5">{resp.comment}</p>
              )}
            </div>
          ))}
        </div>

        {/* Respond Button */}
        {!showRespond && (
          <button
            onClick={() => setShowRespond(true)}
            className="w-full mt-4 bg-primary text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Send className="w-4 h-4" />
            Recommend a Place
          </button>
        )}

        {/* Respond Form */}
        {showRespond && (
          <div className="mt-4 border border-border rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm">Recommend a place</h4>

            {!selectedPlace ? (
              <>
                <input
                  type="text"
                  placeholder="Search for a place..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {searchResults.map((place) => (
                    <button
                      key={place.place_id}
                      onClick={() => setSelectedPlace(place)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{place.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{place.address}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="bg-muted rounded-lg p-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">{selectedPlace.name}</span>
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="text-xs text-muted-foreground ml-auto shrink-0"
                  >
                    Change
                  </button>
                </div>

                <textarea
                  placeholder="Why do you recommend this place?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20"
                />

                <button
                  onClick={handleSubmitResponse}
                  disabled={!comment.trim()}
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
                >
                  Submit Response
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
