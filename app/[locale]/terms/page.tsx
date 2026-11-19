import Link from 'next/link';

export default async function TermsPage({
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
    s2Intro: string;
    s2B1Title: string;
    s2B1Desc: string;
    s2B2Title: string;
    s2B2Desc: string;
    s2B3Title: string;
    s2B3Desc: string;
    s3Title: string;
    s3Desc: string;
    s4Title: string;
    s4Desc: string;
    s4BoxTitle: string;
    s4BoxDesc: string;
    s5Title: string;
    s5Desc: string;
    backBtn: string;
  }> = {
    en: {
      badge: 'Terms & Bookings',
      title: 'Terms &',
      titleHighlight: 'Refund Policy',
      sub: 'Official Booking, Rescheduling & Safety Regulations | The Light House',
      s1Title: '1. Bookings & Payment Confirmation',
      s1Desc: 'To confirm any daily diving package, private boat charter, or course, an advance deposit or full settlement is required. All invoices and electronic transactions are billed and processed exclusively in Euros (€) through authorized channels.',
      s2Title: '2. Cancellation, Refund & Flexible Rescheduling',
      s2Intro: 'To provide maximum flexibility while managing official maritime logistics, our policy is structured as follows:',
      s2B1Title: 'Flexible Rescheduling (Preferred Option):',
      s2B1Desc: 'Guests can reschedule their dive trip or course to any other available future date free of charge, provided notice is given at least 48 hours prior to departure.',
      s2B2Title: 'Notice 48 to 72 Hours (or more) Prior to Departure:',
      s2B2Desc: 'Eligible for a 50% refund of the paid deposit/amount (excluding third-party payment gateway transaction fees).',
      s2B3Title: 'Notice Less than 48 Hours or No-Show:',
      s2B3Desc: 'Strictly non-refundable (0%), as boat manifests, crew assignments, and harbor permits are officially locked with maritime authorities.',
      s3Title: '3. Weather & Force Majeure (100% Refund Guarantee)',
      s3Desc: 'If maritime authorities, the Egyptian Coast Guard, or CDWS cancel boat departures due to adverse weather or high winds, guests have the full choice between rescheduling or an immediate 100% refund in Euros (€).',
      s4Title: '4. Medical Fitness & Diving Safety',
      s4Desc: 'Every participant must be medically fit and complete the mandatory RSTC / CDWS Medical Statement before water activities.',
      s4BoxTitle: 'Crucial Medical Notice',
      s4BoxDesc: 'If a guest arrives on the day of the activity with a medical condition or physical limitation not disclosed in writing prior to the 48-hour deadline and is deemed unfit to dive, no refund will be granted under any circumstances.',
      s5Title: '5. Rental Gear & Environmental Guidelines',
      s5Desc: 'All rental diving gear is inspected under ISO standards. Guests must respect marine reserves (no touching coral). Lost or intentionally damaged equipment will be charged at standard replacement cost.',
      backBtn: '← Back to Homepage'
    },
    de: {
      badge: 'Bedingungen & Buchung',
      title: 'Geschäftsbedingungen &',
      titleHighlight: 'Rückerstattung',
      sub: 'Offizielle Buchungs-, Umbuchungs- und Sicherheitsbestimmungen | The Light House',
      s1Title: '1. Buchung & Zahlungsbestätigung',
      s1Desc: 'Zur Bestätigung von Tauchpaketen oder Kursen ist eine Anzahlung erforderlich. Alle Rechnungen und Transaktionen werden ausschließlich in Euro (€) abgerechnet.',
      s2Title: '2. Stornierung, Rückerstattung & Flexible Umbuchung',
      s2Intro: 'Um maximale Flexibilität zu gewährleisten, gelten folgende Bedingungen:',
      s2B1Title: 'Kostenlose Umbuchung (Empfohlene Option):',
      s2B1Desc: 'Gäste können ihren Tauchausflug bis zu 48 Stunden vor Abfahrt kostenlos auf ein anderes Datum verschieben.',
      s2B2Title: '48 bis 72 Stunden vor Abfahrt:',
      s2B2Desc: 'Anspruch auf 50% Rückerstattung der Anzahlung (abzüglich Zahlungsgebühren).',
      s2B3Title: 'Weniger als 48 Stunden oder Nichterscheinen:',
      s2B3Desc: 'Keine Rückerstattung (0%), da Schiffsberechtigungen und Crew bereits gebucht sind.',
      s3Title: '3. Wetter & Höhere Gewalt (100% Garantie)',
      s3Desc: 'Wenn Behörden oder die Küstenwache Fahrten wegen schlechten Wetters absagen, erhalten Sie eine 100%ige Rückerstattung in Euro (€) oder eine Umbuchung.',
      s4Title: '4. Medizinische Fitness & Sicherheit',
      s4Desc: 'Jeder Taucher muss medizinisch fit sein und den medizinischen Fragebogen vor Beginn ausfüllen.',
      s4BoxTitle: 'Wichtiger Medizinischer Hinweis',
      s4BoxDesc: 'Wird eine Vorerkrankung nicht mindestens 48 Stunden vorher schriftlich gemeldet und führt zum Tauchverbot, erfolgt keine Rückerstattung.',
      s5Title: '5. Mietausrüstung & Umweltschutz',
      s5Desc: 'Ausrüstung wird nach ISO-Standards gewartet. Bei Verlust oder mutwilliger Beschädigung haftet der Gast für den Ersatz.',
      backBtn: '← Zurück zur Startseite'
    },
    fr: {
      badge: 'Conditions & Réservations',
      title: 'Conditions Générales &',
      titleHighlight: 'Remboursement',
      sub: 'Règlements officiels de réservation et de sécurité | The Light House',
      s1Title: '1. Réservations & Paiements',
      s1Desc: 'Un acompte est requis pour confirmer toute réservation. Toutes les factures et transactions sont exclusivement traitées en Euros (€).',
      s2Title: '2. Annulation, Remboursement & Report Flexible',
      s2Intro: 'Pour vous offrir un maximum de flexibilité, notre politique s’établit comme suit :',
      s2B1Title: 'Report Flexible (Option Recommandée) :',
      s2B1Desc: 'Vous pouvez reporter gratuitement votre plongée jusqu’à 48 heures avant le départ.',
      s2B2Title: 'Préavis de 48 à 72 heures :',
      s2B2Desc: 'Éligible à un remboursement de 50% de l’acompte (hors frais bancaires).',
      s2B3Title: 'Moins de 48 heures ou Non-présentation :',
      s2B3Desc: 'Strictement non remboursable (0%), les autorisations portuaires étant verrouillées.',
      s3Title: '3. Météo & Force Majeure (100% Remboursé)',
      s3Desc: 'En cas d’annulation par les garde-côtes pour cause de météo, un remboursement à 100% en Euros (€) ou un report immédiat est garanti.',
      s4Title: '4. Aptitude Médicale & Sécurité',
      s4Desc: 'Tout plongeur doit remplir le questionnaire médical officiel avant l’activité aquatique.',
      s4BoxTitle: 'Avis Médical Important',
      s4BoxDesc: 'Tout problème médical non signalé par écrit au moins 48 heures à l’avance entraînant une inaptitude ne donnera lieu à aucun remboursement.',
      s5Title: '5. Équipement & Respect Marin',
      s5Desc: 'Matériel certifié ISO. La perte ou la détérioration volontaire du matériel de location sera facturée à sa valeur de remplacement.',
      backBtn: '← Retour à l’accueil'
    },
    pl: {
      badge: 'Regulamin i Rezerwacje',
      title: 'Regulamin &',
      titleHighlight: 'Zasady Zwrotów',
      sub: 'Oficjalne zasady rezerwacji i bezpieczeństwa | The Light House',
      s1Title: '1. Rezerwacja i Płatności',
      s1Desc: 'Zaliczka jest wymagana w celu potwierdzenia rezerwacji wypraw lub kursów. Wszystkie płatności rozliczane są wyłącznie w Euro (€).',
      s2Title: '2. Anulowanie, Zwroty i Zmiana Terminu',
      s2Intro: 'W celu zapewnienia elastyczności obowiązują następujące zasady:',
      s2B1Title: 'Elastyczna Zmiana Terminu (Zalecane):',
      s2B1Desc: 'Możliwość bezpłatnego przełożenia terminu wycieczki na inny dzień przy zgłoszeniu minimum 48 godzin wcześniej.',
      s2B2Title: 'Powiadomienie 48 do 72 godzin przed wyprawą:',
      s2B2Desc: 'Prawo do zwrotu 50% wpłaconej kwoty (z wyłączeniem opłat transakcyjnych).',
      s2B3Title: 'Mniej niż 48 godzin lub niestawiennictwo:',
      s2B3Desc: 'Brak zwrotu (0%), ze względu na zarezerwowane zezwolenia portowe i załogę.',
      s3Title: '3. Pogoda i Siła Wyższa (100% Zwrotu)',
      s3Desc: 'W przypadku odwołania wyprawy przez straż wybrzeża z powodu pogody przysługuje pełny 100% zwrot w Euro (€) lub zmiana daty.',
      s4Title: '4. Zdolność Medyczna i Bezpieczeństwo',
      s4Desc: 'Każdy nurek musi wypełnić formularz medyczny RSTC / CDWS przed wejściem do wody.',
      s4BoxTitle: 'Ważna Informacja Medyczna',
      s4BoxDesc: 'W przypadku zatajenia przeciwwskazań zdrowotnych i braku zgłoszenia przed upływem 48 godzin, zwrot kosztów nie przysługuje.',
      s5Title: '5. Sprzęt i Ochrona Środowiska',
      s5Desc: 'Sprzęt spełnia normy ISO. Za zgubienie lub celowe uszkodzenie wypożyczonego sprzętu pobierana jest standardowa opłata.',
      backBtn: '← Wróć do strony głównej'
    }
  };

  const c = contentMap[locale] || contentMap.en;

  return (
    <main className="w-full min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-semibold tracking-widest uppercase inline-block">
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
            <p>{c.s2Intro}</p>
            <ul className="list-disc list-inside space-y-3 ps-2">
              <li>
                <strong className="text-emerald-400 font-semibold">{c.s2B1Title} </strong>
                {c.s2B1Desc}
              </li>
              <li>
                <strong className="text-white font-medium">{c.s2B2Title} </strong>
                <span className="text-amber-400 font-semibold">{c.s2B2Desc}</span>
              </li>
              <li>
                <strong className="text-white font-medium">{c.s2B3Title} </strong>
                <span className="text-red-500 font-semibold">{c.s2B3Desc}</span>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s3Title}</h2>
            <p>{c.s3Desc}</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">{c.s4Title}</h2>
            <p>{c.s4Desc}</p>
            <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-5 space-y-2 mt-2">
              <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider">{c.s4BoxTitle}</h3>
              <p className="text-sm text-zinc-300">{c.s4BoxDesc}</p>
            </div>
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
