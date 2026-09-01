'use client';
import { useState, use } from 'react';

export default function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = use(params);
  const locale = resolvedParams.locale;
  
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/travel-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });

      const data = await res.json();
      setResults(data.links || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-black text-white pt-36 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Explore & <span className="text-red-600">Book</span>
          </h1>
          <p className="text-zinc-400">Search for the best offers and adventures directly.</p>
        </div>

        <form onSubmit={handleSearch} className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl mb-12 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Type destination, tour, or service..."
            className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-red-600 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search Now'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.length > 0 ? (
            results.map((item, index) => (
              <div key={index} className="bg-zinc-900/40 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-red-600/50 transition-all duration-300">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.advertiserName || 'Travel Offer'}</h3>
                  <p className="text-zinc-400 text-sm mb-6 line-clamp-2">{item.linkName || item.description || 'Explore this exclusive offer.'}</p>
                </div>
                <a
                  href={item.clickUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-3 bg-red-600/20 hover:bg-red-600 border border-red-600/40 text-red-400 hover:text-white font-semibold rounded-xl transition-all"
                >
                  Book Now (Affiliate)
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-zinc-500">
              {loading ? 'Searching for best results...' : 'No results found. Try searching for a destination.'}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}