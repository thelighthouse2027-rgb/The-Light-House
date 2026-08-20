import Header from '../components/Header';
import '../globals.css';

export default async function RootLayout({ children, params }: any) {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body className="bg-black text-white">
        <Header locale={locale} />
        {children}
      </body>
    </html>
  );
}