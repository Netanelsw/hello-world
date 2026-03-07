export type Category = 'restaurant' | 'cafe' | 'doctor' | 'service' | 'store' | 'other';

export interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
}

export interface Connection {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  comment: string | null;
  category: Category;
  created_at: string;
  // Joined fields
  profiles?: Profile;
}

export interface RecommendationRequest {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
  // Joined fields
  profiles?: Profile;
  responses?: RequestResponse[];
}

export interface RequestResponse {
  id: string;
  request_id: string;
  user_id: string;
  place_id: string;
  place_name: string;
  comment: string | null;
  created_at: string;
  // Joined fields
  profiles?: Profile;
}

export interface PlaceSearchResult {
  place_id: string;
  name: string;
  address: string;
  rating?: number;
  types?: string[];
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  photos?: string[];
  location?: { lat: number; lng: number };
  opening_hours?: string[];
}

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { value: 'cafe', label: 'Cafe', emoji: '☕' },
  { value: 'doctor', label: 'Doctor', emoji: '🏥' },
  { value: 'service', label: 'Service', emoji: '🔧' },
  { value: 'store', label: 'Store', emoji: '🛍️' },
  { value: 'other', label: 'Other', emoji: '📍' },
];
