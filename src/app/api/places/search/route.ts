import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.types',
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10,
      }),
    });

    const data = await response.json();

    const results = (data.places || []).map((place: Record<string, unknown>) => ({
      place_id: place.id,
      name: (place.displayName as Record<string, string>)?.text || '',
      address: place.formattedAddress || '',
      rating: place.rating || null,
      types: place.types || [],
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'Failed to search places' }, { status: 500 });
  }
}
