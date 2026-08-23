import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('ServicesSection');

  const imagesMap: Record<string, string> = {
    'diving-courses': '/divingcourses.webp',
    'boat-trips': '/cruises.webp',
    'diving-trips': '/diving.webp',
    'safari': '/safari.webp',
  };

  const currentImage = imagesMap[slug] || '/a.webp';

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto text-white">
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </Link>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden p-6 md:p-12 shadow-2xl">
        <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden mb-8 border border-white/10">
          <img src={currentImage} alt={slug} className="w-full h-full object-cover" />
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-red-500 capitalize">
          {slug.replace('-', ' ')}
        </h1>

        <p className="text-zinc-300 text-lg leading-relaxed mb-8">
          Here you can add the full detailed description for this amazing service, highlighting everything customers will experience, schedules, safety measures, and booking options.
        </p>

        <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]">
          Book This Service Now
        </button>
      </div>
    </main>
  );
}