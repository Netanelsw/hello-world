import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,websiteUri,nationalPhoneNumber,location,regularOpeningHours,photos',
      },
    });

    const place = await response.json();

    return NextResponse.json({
      place_id: place.id,
      name: place.displayName?.text || '',
      address: place.formattedAddress || '',
      rating: place.rating || null,
      phone: place.nationalPhoneNumber || null,
      website: place.websiteUri || null,
      location: place.location || null,
      opening_hours: place.regularOpeningHours?.weekdayDescriptions || [],
    });
  } catch {
    return NextResponse.json({ error: 'Failed to get place details' }, { status: 500 });
  }
}
