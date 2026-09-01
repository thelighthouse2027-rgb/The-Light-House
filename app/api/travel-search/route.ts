import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { keyword } = body;

    // دالة مسؤولة عن توليد رابط الأفيلييت الآلي الخاص بـ CJ
    const generateAffiliateLink = (targetUrl: string) => {
      const websiteId = '101873708';
      const encodedUrl = encodeURIComponent(targetUrl);
      return `https://www.anrdoezrs.net/click-${websiteId}-TURBO?url=${encodedUrl}`;
    };

    // بيانات تجريبية (Fallback) للفنادق والرحلات
    const mockTravelOffers = [
      {
        advertiserName: "Red Sea Diving Adventures",
        linkName: "Hurghada Coral Reef Excursion & Snorkeling",
        description: "Experience the ultimate underwater photography and diving tour in the crystal-clear waters of the Red Sea.",
        originalUrl: "https://www.booking.com/attractions/eg/hurghada-diving.html"
      },
      {
        advertiserName: "Luxury Desert Safari Egypt",
        linkName: "Hurghada Quad Bike & Bedouin Dinner",
        description: "Explore the breathtaking desert landscapes, ride quad bikes, and enjoy a traditional night under the stars.",
        originalUrl: "https://www.getyourguide.com/hurghada-desert-safari"
      },
      {
        advertiserName: "Blue Planet Hotel & Resort",
        linkName: "5-Star Beachfront Stay in Hurghada",
        description: "Book your luxury stay right by the diving spots with exclusive discount rates for sea-view suites.",
        originalUrl: "https://www.booking.com/hotel/eg/blue-planet-hurghada.html"
      },
      {
        advertiserName: "Pharaohs & Nile Cruises",
        linkName: "Luxor & Aswan Historical Day Tours",
        description: "Combine your Red Sea diving trip with an unforgettable historical journey to the temples of Luxor.",
        originalUrl: "https://www.viator.com/tours/Luxor-Day-Trip"
      }
    ];

    const links = mockTravelOffers.map(item => ({
      advertiserName: item.advertiserName,
      linkName: item.linkName,
      description: item.description,
      clickUrl: generateAffiliateLink(item.originalUrl)
    }));

    return NextResponse.json({ links });

  } catch (error) {
    console.error('Server Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}