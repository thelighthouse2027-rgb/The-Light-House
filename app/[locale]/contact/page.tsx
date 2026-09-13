'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    formData.append("access_key", "fa1cb842-131e-4cff-8891-a9eddc67babc");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(t('successMessage'));
        form.reset();
      } else {
        setErrorMessage("Error: " + (data.message || t('errorMessage')));
      }
    } catch (error) {
      setErrorMessage(t('errorMessage'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonText = t('submitBtn');

  return (
    <main className="w-full min-h-[85vh] py-24 px-4 md:px-8 flex flex-col items-center justify-center relative">
      
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          {t('title').split(' ')[0]} <span className="text-red-600">{t('title').split(' ').slice(1).join(' ')}</span>
        </h1>
        <p className="text-zinc-400 text-base md:text-lg">
          {t('subtitle')}
        </p>
      </div>

      <div className="w-full max-w-2xl p-8 rounded-[2rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative overflow-hidden group">
        
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-red-600/20"></div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">{t('name')}</label>
              <input 
                type="text" 
                name="name" 
                id="name" 
                required
                className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">{t('email')}</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                required
                className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder={t('emailPlaceholder')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-2">{t('phone')}</label>
              <input 
                type="tel" 
                name="phone" 
                id="phone" 
                required
                className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder={t('phonePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-zinc-400 mb-2">{t('country')}</label>
              <input 
                type="text" 
                name="country" 
                id="country" 
                required
                className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                placeholder={t('countryPlaceholder')}
              />
            </div>
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium text-zinc-400 mb-2">{t('service')}</label>
            <select 
              name="service" 
              id="service"
              required
              defaultValue=""
              className="w-full px-5 py-3.5 bg-black border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all cursor-pointer"
            >
              <option value="" disabled>{t('selectService')}</option>
              <option value="Desert Safari">{t('safari')}</option>
              <option value="Boat Trip">{t('boat')}</option>
              <option value="City Tour">{t('city')}</option>
              <option value="Other Service">{t('other')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-2">{t('message')}</label>
            <textarea 
              name="message" 
              id="message" 
              rows={4} 
              className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
              placeholder={t('messagePlaceholder')}
            ></textarea>
          </div>

          {successMessage && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              {errorMessage}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            title={String(submitButtonText)}
            aria-label={String(submitButtonText)}
            className="w-full mt-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {t('sending')}
              </>
            ) : (
              submitButtonText
            )}
          </button>

        </form>
      </div>

    </main>
  );
}