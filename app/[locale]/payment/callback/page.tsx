'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface VerifyResult {
  success: boolean;
  paid: boolean;
  status?: string;
  orderId?: string;
  amount?: string | number | null;
  currency?: string | null;
  savedToken?: string | null;
  error?: string;
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = typeof params?.locale === 'string' ? params.locale : 'en';
  const orderId = searchParams.get('orderId') || '';

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    if (!orderId) {
      setResult({ success: false, paid: false, error: 'Missing order reference.' });
      setLoading(false);
      return;
    }

    fetch(`/api/pay/verify?orderId=${encodeURIComponent(orderId)}`)
      .then((res) => res.json())
      .then((data: VerifyResult) => {
        if (data?.paid && data?.savedToken) {
          try {
            const raw = localStorage.getItem('lh_qnb_tokens') || '[]';
            const parsed = JSON.parse(raw);
            const existing = Array.isArray(parsed)
              ? parsed.filter((t): t is string => typeof t === 'string' && t.length > 0)
              : [];
            const updated = Array.from(new Set([data.savedToken, ...existing])).slice(0, 5);
            localStorage.setItem('lh_qnb_tokens', JSON.stringify(updated));
          } catch {
            // Ignore storage errors
          }
        }
        setResult(data);
      })
      .catch(() =>
        setResult({ success: false, paid: false, error: 'Could not verify payment status.' })
      )
      .finally(() => setLoading(false));
  }, [orderId]);

  const whatsappText = encodeURIComponent(
    `Hello The Light House! I completed my payment. Order ID: ${orderId}`
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        {loading ? (
          <>
            <h1 className="text-2xl font-bold mb-3">Verifying Payment...</h1>
            <p className="text-zinc-400 text-sm">
              Please wait while we confirm your transaction with QNB.
            </p>
          </>
        ) : result?.paid ? (
          <>
            <div className="text-emerald-400 text-4xl mb-4">✓</div>
            <h1 className="text-2xl font-bold mb-2">Payment Confirmed</h1>
            <p className="text-zinc-300 text-sm mb-6">
              Thank you for booking with The Light House Diving Center.
            </p>
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 text-left text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-zinc-400">Order ID</span>
                <span className="font-mono">{result.orderId}</span>
              </div>
              {result.amount && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Amount</span>
                  <span className="font-mono">
                    {result.amount} {result.currency || 'EGP'}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span className="text-emerald-400 font-semibold">{result.status}</span>
              </div>
              {result.savedToken && (
                <div className="pt-2 border-t border-zinc-800 text-emerald-400 text-xs">
                  ✓ Card saved securely for faster future checkouts.
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/201036930803?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 font-semibold transition"
              >
                Confirm Booking on WhatsApp
              </a>
              <Link
                href={`/${locale}`}
                className="w-full rounded-xl border border-zinc-700 hover:bg-zinc-800 py-3 text-sm transition"
              >
                Back to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="text-amber-400 text-4xl mb-4">!</div>
            <h1 className="text-2xl font-bold mb-2">Payment Not Completed</h1>
            <p className="text-zinc-300 text-sm mb-4">
              {result?.error || `Transaction status: ${result?.status || 'Pending / Declined'}`}
            </p>
            {orderId && (
              <p className="text-zinc-500 text-xs font-mono mb-6">Reference: {orderId}</p>
            )}
            <Link
              href={`/${locale}`}
              className="inline-block w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 font-semibold transition"
            >
              Return to Website
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
          <p className="text-zinc-400">Loading...</p>
        </main>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
