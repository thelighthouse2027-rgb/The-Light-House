'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp, FaShieldAlt, FaLock, FaCheckCircle } from 'react-icons/fa';

interface MPGSCheckout {
  configure: (config: { session: { id: string } }) => void;
  showPaymentPage: () => void;
}

declare global {
  interface Window {
    Checkout?: MPGSCheckout;
  }
}

function loadCheckoutScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Checkout) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load QNB Checkout script')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load QNB Checkout script'));
    document.head.appendChild(script);
  });
}

function CheckoutContent() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const searchParams = useSearchParams();

  const service = searchParams.get('service') || 'Diving Tour';
  const date = searchParams.get('date') || 'Not specified';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const total = searchParams.get('total') || '0';
  const name = searchParams.get('name') || 'Not specified';
  const email = searchParams.get('email') || 'Not specified';
  const phone = searchParams.get('phone') || 'Not specified';
  const country = searchParams.get('country') || 'Not specified';

  const [loadingPay, setLoadingPay] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const whatsappMessage = `🌊 *BOOKING SUPPORT / INQUIRY* 🤿
*The Light House Diving Center*
━━━━━━━━━━━━━━━━━━━━

📋 *TRIP DETAILS*
- *Service:* ${service}
- *Date:* ${date}
- *Guests:* ${adults} Adults, ${children} Children

👤 *GUEST INFORMATION*
- *Lead Guest:* ${name}
- *Email:* ${email}
- *Phone:* ${phone}
- *Country:* ${country}

💰 *PAYMENT SUMMARY*
- *Total:* € ${total}

━━━━━━━━━━━━━━━━━━━━
_I need assistance regarding my payment or booking._`;

  const whatsappUrl = `https://wa.me/201036930803?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCardPayment = async () => {
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms & Conditions before proceeding with the payment.');
      return;
    }

    try {
      setLoadingPay(true);
      setErrorMessage('');

      const numericTotal = parseFloat(total) || 20;

      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericTotal,
          description: `${service} (${date})`,
          locale,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.sessionId || !data.checkoutScriptUrl) {
        throw new Error(data.error || 'Failed to initiate payment session');
      }

      await loadCheckoutScript(data.checkoutScriptUrl);

      if (!window.Checkout) {
        throw new Error('QNB Checkout gateway failed to initialize.');
      }

      window.Checkout.configure({
        session: {
          id: data.sessionId,
        },
      });
      window.Checkout.showPaymentPage();
    } catch (err: unknown) {
      console.error('Payment Error:', err);
      const message = err instanceof Error ? err.message : 'Payment initiation failed.';
      setErrorMessage(message);
      setLoadingPay(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-[#06091a] to-black text-white pt-28 pb-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <FaLock className="text-[11px]" />
            256-Bit SSL Encrypted Checkout
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Complete Your Booking
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 bg-[#0d112b] border border-blue-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* ملخص الحجز */}
          <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
            <div>
              <h2 className="text-xl font-bold mb-5 text-white">Booking Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <span className="text-zinc-400 shrink-0">Service</span>
                  <span className="font-semibold text-white text-right">{service}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <span className="text-zinc-400 shrink-0">Date</span>
                  <span className="font-semibold text-white text-right">{date}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <span className="text-zinc-400 shrink-0">Guests</span>
                  <span className="font-semibold text-white text-right">
                    {adults} Adults, {children} Children
                  </span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <span className="text-zinc-400 shrink-0">Lead Guest</span>
                  <span className="font-semibold text-white text-right">{name}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <span className="text-zinc-400 shrink-0">Email</span>
                  <span className="font-semibold text-white text-right break-all">{email}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2.5">
                  <span className="text-zinc-400 shrink-0">Phone</span>
                  <span className="font-semibold text-white text-right">{phone}</span>
                </div>
                <div className="flex justify-between gap-4 pb-1">
                  <span className="text-zinc-400 shrink-0">Country</span>
                  <span className="font-semibold text-white text-right">{country}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-blue-500/30">
              <div className="flex justify-between items-baseline">
                <span className="text-base font-semibold text-zinc-200">Total to Pay</span>
                <span className="text-3xl font-extrabold text-amber-400">€ {total}</span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1.5">
                Final charge is processed in EGP at the live exchange rate on QNB&apos;s gateway.
              </p>
            </div>
          </div>

          {/* لوحة الدفع */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-5 text-white">Secure Payment</h2>

              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-5 mb-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                    <FaShieldAlt className="text-base shrink-0" />
                    <span>Pay with Visa, MasterCard, and Meeza through QNB Network.</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Complete your payment securely on QNB&apos;s encrypted checkout page. You can also
                  choose to save your card for faster future bookings.
                </p>

                {/* اللوجو الرسمي المرفق من QNB */}
                <div className="bg-white rounded-xl p-3 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/qnb-logo.png"
                    alt="Pay with Visa, MasterCard, and Meeza through QNB Network"
                    className="max-h-12 w-auto object-contain"
                  />
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Booking Total:</span>
                  <span className="font-bold text-white text-base">€ {total}</span>
                </div>
              </div>

              {/* مربع الموافقة الإلزامي على الشروط والأحكام */}
              <div
                className={`rounded-2xl p-4 mb-4 border transition-colors ${
                  agreeTerms
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-blue-950/20 border-white/15'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (e.target.checked) setErrorMessage('');
                    }}
                    className="mt-0.5 w-5 h-5 rounded border-zinc-500 text-blue-600 focus:ring-blue-500 bg-[#161b33] cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-zinc-200 leading-relaxed">
                    I have read and agree to the{' '}
                    <Link
                      href={`/${locale}/terms`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline font-semibold"
                    >
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      href={`/${locale}/privacy`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {agreeTerms ? (
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 pl-8">
                    <FaCheckCircle /> Terms accepted — ready to pay.
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-400/90 mt-2 pl-8">
                    * You must accept the Terms &amp; Conditions before proceeding with payment.
                  </p>
                )}
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCardPayment}
                  disabled={!agreeTerms || loadingPay}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-5 font-extrabold rounded-2xl transition-all duration-200 text-base sm:text-lg ${
                    agreeTerms && !loadingPay
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_24px_rgba(37,99,235,0.4)] cursor-pointer'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  {loadingPay ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting to QNB...</span>
                    </>
                  ) : (
                    <>
                      <FaLock className="text-sm" />
                      <span>Pay Now (€ {total})</span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Contact Support on WhatsApp"
                  className="w-14 h-14 flex items-center justify-center shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <FaWhatsapp className="text-2xl" />
                </a>
              </div>

              <div className="text-center pt-1">
                <Link
                  href={`/${locale}`}
                  className="text-xs text-zinc-400 hover:text-zinc-200 hover:underline transition-colors"
                >
                  Cancel and return to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <span className="text-zinc-400 text-sm">Loading Checkout...</span>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
