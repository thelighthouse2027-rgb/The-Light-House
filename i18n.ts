import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

const locales = ['en', 'de', 'pl', 'fr'];

export default getRequestConfig(async (config: any) => {
  const locale = config.requestLocale ? await config.requestLocale : config.locale;

  if (!locales.includes(locale)) notFound();

  return {
    locale, 
    messages: (await import(`./messages/${locale}.json`)).default
  };
});