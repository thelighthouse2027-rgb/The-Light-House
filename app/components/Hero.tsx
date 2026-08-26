import { getTranslations } from 'next-intl/server';

export default async function Hero() {
  const t = await getTranslations('HomePage');

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center text-center overflow-hidden rounded-3xl border border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-black">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 scale-105 filter brightness-90"
      >
        <source src="/videos/q.mp4" type="video/mp4" />
        <source src="/videos/q.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-10"></div>

      <div className="relative z-20 flex flex-col items-center gap-6 px-4 max-w-4xl mx-auto mt-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-red-600/40 text-red-500 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          The Light House Experience
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          {t('title')}
        </h1>

        <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl font-light leading-relaxed drop-shadow-md">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="w-full sm:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:-translate-y-1 active:translate-y-0 border border-red-500">
            Explore Tours
          </button>
          
          <button className="w-full sm:w-auto px-10 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all duration-300 border border-zinc-700 hover:border-zinc-500 backdrop-blur-md">
            Contact Us
          </button>
        </div>

      </div>

    </section>
  );
}