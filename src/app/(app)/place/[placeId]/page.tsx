'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Star, ExternalLink } from 'lucide-react';
import { useDemo } from '@/lib/demo-context';
import { demoPlaceDetails } from '@/lib/demo-data';
import RecommendationCard from '@/components/RecommendationCard';

export default function PlacePage() {
  const params = useParams();
  const router = useRouter();
  const { getPlaceRecommendations } = useDemo();

  const placeId = params.placeId as string;
  const recommendations = getPlaceRecommendations(placeId);
  const placeDetails = demoPlaceDetails[placeId];
  const placeName = placeDetails?.name || recommendations[0]?.place_name || 'Unknown Place';

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center gap-3 px-4 h-14">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold truncate">{placeName}</h1>
        </div>
      </header>

      {/* Place Details */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold">{placeName}</h2>
            {placeDetails && (
              <>
                <p className="text-sm text-muted-foreground mt-1">{placeDetails.address}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{placeDetails.rating}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {placeDetails && (
          <a
            href={`https://www.google.com/maps/place/?q=place_id:${placeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 border border-border rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on Google Maps
          </a>
        )}
      </div>

      {/* Recommendations */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-muted-foreground mb-3">
          {recommendations.length} recommendation{recommendations.length !== 1 ? 's' : ''} from your network
        </h3>
        <div className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <RecommendationCard key={rec.id} recommendation={rec} />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No one in your network has recommended this place yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
