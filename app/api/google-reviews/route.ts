import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Places API key is missing' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.displayName,places.rating,places.userRatingCount,places.reviews.name,places.reviews.relativePublishTimeDescription,places.reviews.rating,places.reviews.text,places.reviews.originalText,places.reviews.authorAttribution',
      },
      body: JSON.stringify({
        textQuery: 'The Light House Diving Center Hurghada',
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch place details', details: data },
        { status: response.status }
      );
    }

    const place = data.places?.[0];

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    return NextResponse.json({
      name: place.displayName?.text || 'The Light House Diving Center',
      rating: place.rating || 0,
      userRatingCount: place.userRatingCount || 0,
      reviews: place.reviews || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}