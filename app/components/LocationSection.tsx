import { useTranslations } from 'next-intl';
import { FaWhatsapp, FaFacebookF, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaDirections } from 'react-icons/fa';

export default function LocationSection({ locale }: { locale?: string }) {
  const t = useTranslations('Location');

  const lat = 27.0830688;
  const lng = 33.8601041;

  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=The+Light+House+Hurghada&destination_place_id=ChIJI144d7f7d184c0fd3X4f4a049c22c241ee`;

  const isRtl = locale === 'ar';

  return (
    <section className="w-full bg-black text-white py-28 px-6 relative overflow-hidden border-t border-white/10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            {t('titlePart1')} <span className="text-blue-500">{t('titlePart2')}</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center [perspective:1200px]">

          <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/15 p-8 md:p-10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] transform lg:-rotate-y-2 hover:rotate-y-0 transition-transform duration-700 flex flex-col justify-between space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">
                {t('centerName')}
              </h3>

              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <div className="p-3 bg-blue-600/20 border border-blue-600/40 text-blue-400 rounded-2xl shrink-0">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('officialAddress')}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {t('addressText')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 space-x-reverse mb-6">
                <div className="p-3 bg-blue-600/20 border border-blue-600/40 text-blue-400 rounded-2xl shrink-0">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('phoneTitle')}</h4>
                  <a 
                    href="https://wa.me/201273327311" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="+20 127 332 7311"
                    aria-label="Phone and WhatsApp contact"
                    className="text-blue-400 hover:text-blue-300 font-mono text-lg transition-colors block"
                  >
                    +20 127 332 7311
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-zinc-400">
                {t('connect')}
              </h4>
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/201273327311"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="WhatsApp"
                  aria-label="WhatsApp"
                  className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-green-600 hover:border-green-500 transition-all duration-300 shadow-lg"
                >
                  <FaWhatsapp className="text-xl" />
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook"
                  aria-label="Facebook"
                  className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 shadow-lg"
                >
                  <FaFacebookF className="text-lg" />
                </a>

                <a
                  href="https://www.youtube.com/@TheLightHouse-v8b"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube"
                  aria-label="YouTube"
                  className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 shadow-lg"
                >
                  <FaYoutube className="text-xl" />
                </a>
              </div>
            </div>

          </div>

          <div className="relative w-full h-[420px] lg:h-[470px] rounded-3xl overflow-hidden border-2 border-blue-600/40 shadow-[0_30px_70px_rgba(37,99,235,0.35)] bg-zinc-900 group">

            <div className="absolute inset-0 border border-white/20 rounded-3xl pointer-events-none z-10 shadow-[inset_0_0_30px_rgba(37,99,235,0.25)]" />

            <iframe
              title="The Light House Map Location"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625.337775949574!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x144d7f7d184c0fd3%3A0x4f4a049c22c241ee!2sThe+Light+House!5e0!3m2!1s!2s!4v1700000000000!5m2!1s!2s`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.15) saturate(1.2)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full transition-transform duration-700 group-hover:scale-105"
            />

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={t('directions')}
              aria-label={t('directions')}
              className="absolute bottom-4 right-4 z-20 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              <FaDirections className="text-lg" />
              <span>{t('directions')}</span>
            </a>

          </div>

        </div>
      </div>
    </section>
  );
}