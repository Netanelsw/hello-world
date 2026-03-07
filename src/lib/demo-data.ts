import { Profile, Recommendation, RecommendationRequest, RequestResponse } from './types';

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export const demoUsers: Profile[] = [
  {
    id: 'demo-user-1',
    name: 'Shira Cohen',
    username: 'shira',
    avatar_url: null,
    bio: 'Food lover & cafe hopper in Tel Aviv',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'demo-user-2',
    name: 'Dan Levy',
    username: 'dan',
    avatar_url: null,
    bio: 'Always looking for the best spots',
    created_at: '2024-01-20T10:00:00Z',
  },
  {
    id: 'demo-user-3',
    name: 'Maya Bar',
    username: 'maya',
    avatar_url: null,
    bio: 'Exploring one neighborhood at a time',
    created_at: '2024-02-01T10:00:00Z',
  },
  {
    id: 'demo-user-4',
    name: 'Avi Stern',
    username: 'avi',
    avatar_url: null,
    bio: 'Tech & coffee enthusiast',
    created_at: '2024-02-10T10:00:00Z',
  },
  {
    id: 'demo-current-user',
    name: 'Demo User',
    username: 'demo',
    avatar_url: null,
    bio: 'Just trying out TrustMap!',
    created_at: '2024-03-01T10:00:00Z',
  },
];

export const demoRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    user_id: 'demo-user-1',
    place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    place_name: 'Cafe Romano',
    comment: 'Best brunch in Tel Aviv! The shakshuka is amazing.',
    category: 'cafe',
    created_at: '2024-03-01T12:00:00Z',
    profiles: demoUsers[0],
  },
  {
    id: 'rec-2',
    user_id: 'demo-user-2',
    place_id: 'ChIJrTLr-GyuEmsRBfy61i59si0',
    place_name: 'Dr. Sarah Cohen - Family Medicine',
    comment: 'Been going here for years. Really listens and takes her time.',
    category: 'doctor',
    created_at: '2024-03-02T09:00:00Z',
    profiles: demoUsers[1],
  },
  {
    id: 'rec-3',
    user_id: 'demo-user-3',
    place_id: 'ChIJbWWHSCGuEmsRc2g_bVCEJOA',
    place_name: 'The Corner Falafel',
    comment: 'No-frills falafel, hands down the best in the city.',
    category: 'restaurant',
    created_at: '2024-03-03T14:00:00Z',
    profiles: demoUsers[2],
  },
  {
    id: 'rec-4',
    user_id: 'demo-user-1',
    place_id: 'ChIJ2eUgeAK6j4ARbn5u_wAGqWA',
    place_name: 'Fix It Electronics',
    comment: 'Fixed my laptop screen in 2 hours. Fair price.',
    category: 'service',
    created_at: '2024-03-04T11:00:00Z',
    profiles: demoUsers[0],
  },
  {
    id: 'rec-5',
    user_id: 'demo-user-4',
    place_id: 'ChIJIQBpAG2ahYAR_6128GcTUEo',
    place_name: 'Nahat Coffee Roasters',
    comment: 'The best specialty coffee. Try their Ethiopian pour-over.',
    category: 'cafe',
    created_at: '2024-03-05T08:00:00Z',
    profiles: demoUsers[3],
  },
  {
    id: 'rec-6',
    user_id: 'demo-user-2',
    place_id: 'ChIJdd4hrwug2EcRmSrV3Vo6llI',
    place_name: 'Dizengoff Market',
    comment: 'Great for fresh produce and street food on Fridays.',
    category: 'store',
    created_at: '2024-03-06T16:00:00Z',
    profiles: demoUsers[1],
  },
  {
    id: 'rec-7',
    user_id: 'demo-user-3',
    place_id: 'ChIJP3Sa8ziYEmsRUKgyFmh9AQM',
    place_name: 'Sushi Mania',
    comment: 'Surprisingly good sushi for the price. The salmon roll is a must.',
    category: 'restaurant',
    created_at: '2024-03-07T19:00:00Z',
    profiles: demoUsers[2],
  },
  {
    id: 'rec-8',
    user_id: 'demo-user-4',
    place_id: 'ChIJDwJAHeGhEmsR0Mk6RegCreE',
    place_name: 'Yoga with Noa',
    comment: 'Best yoga classes in town. Small groups, great instructor.',
    category: 'service',
    created_at: '2024-03-08T07:00:00Z',
    profiles: demoUsers[3],
  },
];

export const demoRequests: RecommendationRequest[] = [
  {
    id: 'req-1',
    user_id: 'demo-user-1',
    text: 'Looking for a good dentist in Tel Aviv. Any recommendations?',
    created_at: '2024-03-05T10:00:00Z',
    profiles: demoUsers[0],
    responses: [
      {
        id: 'resp-1',
        request_id: 'req-1',
        user_id: 'demo-user-2',
        place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY5',
        place_name: 'Dr. Amit Dental Clinic',
        comment: 'Great dentist, very gentle. Been going for 3 years.',
        created_at: '2024-03-05T11:00:00Z',
        profiles: demoUsers[1],
      },
    ],
  },
  {
    id: 'req-2',
    user_id: 'demo-user-3',
    text: 'Need a reliable plumber in Ramat Gan. Help!',
    created_at: '2024-03-06T15:00:00Z',
    profiles: demoUsers[2],
    responses: [],
  },
];

export const demoFollowing = ['demo-user-1', 'demo-user-2', 'demo-user-3', 'demo-user-4'];

export const demoPlaceDetails: Record<string, { name: string; address: string; lat: number; lng: number; rating: number }> = {
  'ChIJN1t_tDeuEmsRUsoyG83frY4': { name: 'Cafe Romano', address: '45 Rothschild Blvd, Tel Aviv', lat: 32.0636, lng: 34.7745, rating: 4.5 },
  'ChIJrTLr-GyuEmsRBfy61i59si0': { name: 'Dr. Sarah Cohen - Family Medicine', address: '12 Ben Yehuda St, Tel Aviv', lat: 32.0780, lng: 34.7700, rating: 4.8 },
  'ChIJbWWHSCGuEmsRc2g_bVCEJOA': { name: 'The Corner Falafel', address: '8 Florentin St, Tel Aviv', lat: 32.0560, lng: 34.7680, rating: 4.6 },
  'ChIJ2eUgeAK6j4ARbn5u_wAGqWA': { name: 'Fix It Electronics', address: '23 Allenby St, Tel Aviv', lat: 32.0700, lng: 34.7720, rating: 4.2 },
  'ChIJIQBpAG2ahYAR_6128GcTUEo': { name: 'Nahat Coffee Roasters', address: '15 Dizengoff St, Tel Aviv', lat: 32.0750, lng: 34.7740, rating: 4.7 },
  'ChIJdd4hrwug2EcRmSrV3Vo6llI': { name: 'Dizengoff Market', address: 'Dizengoff Square, Tel Aviv', lat: 32.0773, lng: 34.7748, rating: 4.4 },
  'ChIJP3Sa8ziYEmsRUKgyFmh9AQM': { name: 'Sushi Mania', address: '33 Ibn Gvirol St, Tel Aviv', lat: 32.0800, lng: 34.7810, rating: 4.3 },
  'ChIJDwJAHeGhEmsR0Mk6RegCreE': { name: 'Yoga with Noa', address: '5 Gordon St, Tel Aviv', lat: 32.0820, lng: 34.7690, rating: 4.9 },
  'ChIJN1t_tDeuEmsRUsoyG83frY5': { name: 'Dr. Amit Dental Clinic', address: '18 King George St, Tel Aviv', lat: 32.0730, lng: 34.7720, rating: 4.6 },
};

export const demoPlaceSearchResults = [
  { place_id: 'search-1', name: 'Cafe Xoho', address: '10 Rothschild Blvd, Tel Aviv' },
  { place_id: 'search-2', name: 'Cafe Puaa', address: '8 Rabbi Nachman St, Tel Aviv' },
  { place_id: 'search-3', name: 'Cafe Levinsky 41', address: '41 Levinsky St, Tel Aviv' },
];
