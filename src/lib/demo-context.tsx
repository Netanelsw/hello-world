'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  DEMO_MODE,
  demoUsers,
  demoRecommendations,
  demoRequests,
  demoFollowing,
} from './demo-data';
import { Profile, Recommendation, RecommendationRequest } from './types';

interface DemoContextType {
  isDemo: boolean;
  currentUser: Profile;
  users: Profile[];
  recommendations: Recommendation[];
  requests: RecommendationRequest[];
  following: string[];
  addRecommendation: (rec: Omit<Recommendation, 'id' | 'created_at' | 'profiles'>) => void;
  addRequest: (text: string) => void;
  addResponse: (requestId: string, placeId: string, placeName: string, comment: string) => void;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  getFeedRecommendations: () => Recommendation[];
  getPlaceRecommendations: (placeId: string) => Recommendation[];
  getUserRecommendations: (userId: string) => Recommendation[];
}

const DemoContext = createContext<DemoContextType | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(demoRecommendations);
  const [requests, setRequests] = useState<RecommendationRequest[]>(demoRequests);
  const [following, setFollowing] = useState<string[]>(demoFollowing);

  const currentUser = demoUsers[4]; // "Demo User"

  const addRecommendation = useCallback(
    (rec: Omit<Recommendation, 'id' | 'created_at' | 'profiles'>) => {
      const newRec: Recommendation = {
        ...rec,
        id: `rec-${Date.now()}`,
        created_at: new Date().toISOString(),
        profiles: currentUser,
      };
      setRecommendations((prev) => [newRec, ...prev]);
    },
    [currentUser]
  );

  const addRequest = useCallback(
    (text: string) => {
      const newReq: RecommendationRequest = {
        id: `req-${Date.now()}`,
        user_id: currentUser.id,
        text,
        created_at: new Date().toISOString(),
        profiles: currentUser,
        responses: [],
      };
      setRequests((prev) => [newReq, ...prev]);
    },
    [currentUser]
  );

  const addResponse = useCallback(
    (requestId: string, placeId: string, placeName: string, comment: string) => {
      setRequests((prev) =>
        prev.map((req) => {
          if (req.id !== requestId) return req;
          return {
            ...req,
            responses: [
              ...(req.responses || []),
              {
                id: `resp-${Date.now()}`,
                request_id: requestId,
                user_id: currentUser.id,
                place_id: placeId,
                place_name: placeName,
                comment,
                created_at: new Date().toISOString(),
                profiles: currentUser,
              },
            ],
          };
        })
      );
    },
    [currentUser]
  );

  const toggleFollow = useCallback((userId: string) => {
    setFollowing((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const isFollowing = useCallback(
    (userId: string) => following.includes(userId),
    [following]
  );

  const getFeedRecommendations = useCallback(
    () => recommendations.filter((r) => following.includes(r.user_id)),
    [recommendations, following]
  );

  const getPlaceRecommendations = useCallback(
    (placeId: string) => recommendations.filter((r) => r.place_id === placeId),
    [recommendations]
  );

  const getUserRecommendations = useCallback(
    (userId: string) => recommendations.filter((r) => r.user_id === userId),
    [recommendations]
  );

  if (!DEMO_MODE) {
    return <>{children}</>;
  }

  return (
    <DemoContext.Provider
      value={{
        isDemo: true,
        currentUser,
        users: demoUsers,
        recommendations,
        requests,
        following,
        addRecommendation,
        addRequest,
        addResponse,
        toggleFollow,
        isFollowing,
        getFeedRecommendations,
        getPlaceRecommendations,
        getUserRecommendations,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider (or DEMO_MODE must be true)');
  }
  return context;
}

export function useMaybeDemo() {
  return useContext(DemoContext);
}
