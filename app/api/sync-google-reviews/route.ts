import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'q348evxi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return NextResponse.json({ error: 'مفاتيح Google API غير معرفة في البيئة' }, { status: 400 });
    }

    // 1. طلب بيانات المكان والتقييمات من جوجل مباشرة
    const googleRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}&language=ar`,
      { cache: 'no-store' }
    );

    const googleData = await googleRes.json();

    if (googleData.status !== 'OK' && googleData.status !== 'ZERO_RESULTS') {
      console.error('Google API Error:', googleData);
      return NextResponse.json({ 
        error: `خطأ في Google API: ${googleData.status}`,
        details: googleData.error_message || ''
      }, { status: 400 });
    }

    const reviews = googleData.result?.reviews || [];

    if (reviews.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'لم تُرجع جوجل أي تقييمات لهذا الـ Place ID. يرجى التأكد من الـ Place ID في ملف .env.local' 
      });
    }

    let addedCount = 0;

    // 2. إدخال وتحديث كل تقييم في Sanity
    for (const rev of reviews) {
      const reviewId = `google-review-${rev.time}`;

      await sanityClient.createOrReplace({
        _id: reviewId,
        _type: 'review',
        authorName: rev.author_name,
        rating: rev.rating,
        dateDescription: rev.relative_time_description,
        reviewText: rev.text,
        googleUrl: rev.author_url || 'https://maps.google.com',
      });

      addedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `تم جلب ومزامنة ${addedCount} تقييم من Google إلى Sanity بنجاح!`,
    });

  } catch (error: any) {
    console.error('Error syncing reviews:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}