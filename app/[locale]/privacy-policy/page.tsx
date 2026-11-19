import Link from 'next/link';

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const contentMap: Record<string, {
    badge: string;
    title: string;
    titleHighlight: string;
    sub: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
    s4Title: string;
    s4Desc: string;
    s5Title: string;
    s5Desc: string;
    backBtn: string;
  }> = {
    en: {
      badge: 'Data Protection & Legal',
      title: 'Privacy',
      titleHighlight: 'Policy',
      sub: 'Official Data Handling & Maritime Security Standards | The Light House',
      s1Title: '1. Information We Collect',
      s1Desc: 'When booking diving trips, private boat charters, or courses, we collect essential guest information: full legal name, passport/ID details, contact details (email/WhatsApp), diving certification history, and mandatory medical declarations required by maritime regulations.',
      s2Title: '2. Official Port Manifests & Authorities',
      s2Desc: 'Under Egyptian maritime law, passenger manifests must be submitted to the Egyptian Coast Guard and CDWS prior to vessel departure. Your personal information is utilized strictly for compliance with port security and safety protocols.',
      s3Title: '3. Payment & Financial Security',
      s3Desc: 'All transactions, deposits, and payments are billed exclusively in Euros (€) through PCI-DSS compliant, encrypted payment gateways. The Light House does not store credit card credentials or CVV numbers on its servers.',
      s4Title: '4. Data Privacy & Zero Spam',
      s4Desc: 'We maintain a strict zero-spam policy. Your personal details will never be sold, leased, or shared with unauthorized commercial entities.',
      s5Title: '5. Direct Inquiries & Contact',
      s5Desc: 'For inquiries regarding data records or updates, contact: The Light House Diving Center, Hurghada, Red Sea, Egypt. Email: info@thelighthousee.com',
      backBtn: '← Back to Homepage'
    },
    de: {
      badge: 'Datenschutz & Rechtliches',
      title: 'Datenschutz-',
      titleHighlight: 'Erklärung',
      sub: 'Offizielle Datensicherheitsstandards | The Light House',
      s1Title: '1. Erhobene Daten',
      s1Desc: 'Bei der Buchung von Tauchgängen oder Kursen erfassen wir: vollständigen Namen, Passdaten, Kontaktdaten (E-Mail/WhatsApp), Zertifizierungen und die vorgeschriebenen medizinischen Erklärungen.',
      s2Title: '2. Offizielle Passagierlisten (Manifeste)',
      s2Desc: 'Gemäß ägyptischem Seerecht müssen Passagierlisten vor Abfahrt bei der Küstenwache und der CDWS eingereicht werden. Die Daten dienen ausschließlich behördlichen Sicherheitsvorschriften.',
      s3Title: '3. Zahlungssicherheit',
      s3Desc: 'Alle Zahlungen werden in Euro (€) über PCI-DSS-zertifizierte, verschlüsselte Gateways abgewickelt. Wir speichern niemals Kreditkartendaten oder CVV-Codes.',
      s4Title: '4. Datenschutz & Kein Spam',
      s4Desc: 'Wir halten eine strikte Anti-Spam-Richtlinie ein. Ihre Daten werden niemals an unbefugte Dritte weitergegeben oder verkauft.',
      s5Title: '5. Kontakt & Anfragen',
      s5Desc: 'Bei Fragen zum Datenschutz: The Light House Diving Center, Hurghada, Ägypten. E-Mail: info@thelighthousee.com',
      backBtn: '← Zurück zur Startseite'
    },
    fr: {
      badge: 'Protection des Données',
      title: 'Politique de',
      titleHighlight: 'Confidentialité',
      sub: 'Normes officielles de sécurité des données | The Light House',
      s1Title: '1. Informations Collectées',
      s1Desc: 'Lors de vos réservations, nous collectons : nom complet, numéro de passeport, coordonnées (e-mail/WhatsApp), niveau de plongée et déclarations médicales obligatoires.',
      s2Title: '2. Manifestes Portuaires et Garde-Côtes',
      s2Desc: 'La loi maritime égyptienne exige l’enregistrement des manifestes passagers auprès des garde-côtes et de la CDWS avant chaque départ pour des raisons légales de sécurité.',
      s3Title: '3. Sécurité des Paiements',
      s3Desc: 'Toutes les transactions sont traitées en Euros (€) via des passerelles sécurisées certifiées PCI-DSS. Nous ne stockons aucun numéro de carte bancaire.',
      s4Title: '4. Confidentialité et Zéro Spam',
      s4Desc: 'Vos données personnelles ne seront jamais vendues, louées ou cédées à des tiers à des fins commerciales.',
      s5Title: '5. Contact & Support',
      s5Desc: 'Pour toute question relative à vos données : The Light House Diving Center, Hurghada, Égypte. E-mail : info@thelighthousee.com',
      backBtn: '← Retour à l’accueil'
    },
    pl: {
      badge: 'Ochrona Danych i Prywatność',
      title: 'Polityka',
      titleHighlight: 'Prywatności',
      sub: 'Oficjalne standardy bezpieczeństwa danych | The Light House',
      s1Title: '1. Zbierane Informacje',
      s1Desc: 'Podczas rezerwacji pobieramy: imię i nazwisko, numer paszportu, dane kontaktowe (e-mail/WhatsApp), uprawnienia nurkowe oraz wymagane deklaracje medyczne.',
      s2Title: '2. Manifesty Pasażerskie i Wymogi Prawne',
      s2Desc: 'Zgodnie z egipskim prawem morskim listy pasażerów muszą zostać zgłoszone do straży wybrzeża i CDWS przed wypłynięciem w celach bezpieczeństwa.',
      s3Title: '3. Bezpieczeństwo Płatności',
      s3Desc: 'Wszystkie płatności rozliczane są wyłącznie w Euro (€) przez bezpieczne bramki zgodne ze standardem PCI-DSS. Nie przechowujemy numerów kart kredytowych.',
      s4Title: '4. Prywatność i Brak Spamu',
      s4Desc: 'Stosujemy ścisłą politykę prywatności. Dane gości nigdy nie są sprzedawane ani udostępniane podmiotom trzecim.',
      s5Title: '5. Kontakt',
      s5Desc: 'W przypadku pytań dotyczących danych prosimy o kontakt: The Light House Diving Center, Hurghada, Egipt. E-mail : info@thelighthousee.com',
      backBtn: '← Wróć do strony głównej'
    }
  };

  const c = contentMap[locale] || contentMap.en;

  return (
    <main className="w-full min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-semibold tracking-widest uppercase inline-block">
            {c.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            {c.title} <span className="text-red-600">{c.titleHighlight}</span>
          </h1>
          <p className="text-zinc-400 text-sm">{c.sub}</p>
        </div>

        <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 md:p-12 space-y-8 text-zinc-300 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s1Title}</h2>
            <p>{c.s1Desc}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s2Title}</h2>
            <p>{c.s2Desc}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s3Title}</h2>
            <p>{c.s3Desc}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s4Title}</h2>
            <p>{c.s4Desc}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s5Title}</h2>
            <p>{c.s5Desc}</p>
          </section>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
          >
            {c.backBtn}
          </Link>
        </div>
      </div>
    </main>
  );
}
