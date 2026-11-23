'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaWhatsapp,
  FaShieldAlt,
  FaLock,
  FaCheckCircle,
  FaCalendarAlt,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaGlobe,
} from 'react-icons/fa';

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
      existing.addEventListener(
        'error',
        () => reject(new Error('Failed to load QNB Checkout script')),
        { once: true }
      );
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
    <main className="relative min-h-screen bg-[#040712] text-white pt-28 pb-32 px-4 sm:px-6 overflow-hidden">
      {/* خلفية إضاءة بحرية خفيفة */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-blue-600/15 blur-3xl"
      />

      <div className="relative max-w-5xl mx-auto">
        {/* رأس الصفحة */}
        <div className="mb-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 text-xs font-semibold tracking-wide mb-4">
            <FaLock className="text-[11px]" />
            256-Bit SSL Encrypted • QNB Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Complete Your Reservation
          </h1>
          <p className="text-zinc-400 text-sm mt-2 max-w-lg mx-auto">
            Review your diving or safari booking details and complete payment securely through QNB
            Network.
          </p>
        </div>

        {/* البطاقة الرئيسية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#0b1026]/90 backdrop-blur-xl border border-blue-500/25 rounded-3xl p-6 sm:p-9 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
          {/* العمود الأيسر: ملخص الحجز */}
          <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-8">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white tracking-wide">Booking Summary</h2>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/25">
                  The Light House
                </span>
              </div>

              {/* اسم الخدمة */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 mb-5">
                <span className="text-[11px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Selected Experience
                </span>
                <p className="text-base font-bold text-white leading-snug">{service}</p>
              </div>

              {/* التفاصيل بالأيقونات */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FaCalendarAlt className="text-blue-400 text-xs" /> Date
                  </span>
                  <span className="font-semibold text-white text-right">{date}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FaUsers className="text-blue-400 text-xs" /> Guests
                  </span>
                  <span className="font-semibold text-white text-right">
                    {adults} Adults, {children} Children
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FaUser className="text-blue-400 text-xs" /> Lead Guest
                  </span>
                  <span className="font-semibold text-white text-right">{name}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FaEnvelope className="text-blue-400 text-xs" /> Email
                  </span>
                  <span className="font-semibold text-white text-right break-all">{email}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FaPhoneAlt className="text-blue-400 text-xs" /> Phone
                  </span>
                  <span className="font-semibold text-white text-right">{phone}</span>
                </div>

                <div className="flex items-center justify-between gap-3 py-1.5">
                  <span className="flex items-center gap-2 text-zinc-400">
                    <FaGlobe className="text-blue-400 text-xs" /> Country
                  </span>
                  <span className="font-semibold text-white text-right">{country}</span>
                </div>
              </div>
            </div>

            {/* الإجمالي */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-950/60 to-indigo-950/40 border border-blue-500/30 p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold text-zinc-300">Total Amount</span>
                <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
                  € {total}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                Settled securely in EGP at the live exchange rate on QNB&apos;s gateway.
              </p>
            </div>
          </div>

          {/* العمود الأيمن: الدفع والشروط */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-wide">Payment Method</h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  <FaShieldAlt className="text-[11px]" /> 3D Secure Verified
                </span>
              </div>

              {/* صندوق خيار الدفع بالنص المطلوب من QNB */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-950/60 via-[#10193d] to-[#0d1433] border border-blue-400/35 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                    <FaShieldAlt className="text-blue-300 text-base" />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-white leading-snug">
                      Pay with Visa, MasterCard, and Meeza through QNB Network.
                    </p>
                    <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                      You will be redirected to QNB&apos;s encrypted hosted checkout page, where you
                      can also save your card securely for future bookings.
                    </p>
                  </div>
                </div>

                {/* شريط الشعارات الأربعة جنب بعض: QNB + Visa + MasterCard + Meeza */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    {/* QNB */}
                    <div className="h-10 px-3.5 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/qnb-logo.png"
                        alt="QNB"
                        className="h-5 w-auto object-contain"
                      />
                    </div>

                    {/* Visa */}
                    <div className="h-10 px-3.5 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <svg
                        className="h-4 w-auto"
                        viewBox="0 0 100 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M39.8 1.5L25.9 30.5H16.8L10.3 7.8C9.9 6.2 9.6 5.6 8.3 4.9C6.2 3.8 2.9 2.8 0 2.2L0.2 1.5H14.7C16.6 1.5 18.2 2.8 18.6 4.9L22.2 21.6L30.9 1.5H39.8ZM75.2 21.1C75.3 13.1 63.8 12.6 63.9 9.1C64 8 65.1 6.8 67.4 6.5C68.6 6.3 71.9 6.2 75.3 7.7L76.7 1.8C74.8 1.1 72.3 0.5 69.1 0.5C60.7 0.5 54.8 4.9 54.7 11.2C54.6 15.9 58.8 18.6 62 20.1C65.2 21.7 66.3 22.7 66.3 24.1C66.2 26.2 63.7 27.2 61.3 27.2C57.4 27.2 55.1 26.6 52.8 25.5L51.3 31.6C53.3 32.5 57 33.2 60.8 33.2C69.7 33.2 75.2 28.8 75.2 21.1ZM97.2 30.5H105L98.2 1.5H91C89.4 1.5 88.1 2.4 87.5 3.8L74.8 30.5H83.9L85.7 25.5H96.9L97.2 30.5ZM88.2 18.8L92.8 6.4L95.5 18.8H88.2ZM53 1.5L45.9 30.5H37.3L44.4 1.5H53Z"
                          fill="#1434CB"
                        />
                      </svg>
                    </div>

                    {/* MasterCard */}
                    <div className="h-10 px-3.5 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <svg
                        className="h-5 w-auto"
                        viewBox="0 0 131 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="40" cy="40" r="40" fill="#EB001B" />
                        <circle cx="91" cy="40" r="40" fill="#F79E1B" />
                        <path
                          d="M65.5 15.2C72.8 21.9 77.4 30.4 77.4 40C77.4 49.6 72.8 58.1 65.5 64.8C58.2 58.1 53.6 49.6 53.6 40C53.6 30.4 58.2 21.9 65.5 15.2Z"
                          fill="#FF5F00"
                        />
                      </svg>
                    </div>

                    {/* Meeza */}
                    <div className="h-10 px-3.5 rounded-xl bg-white flex items-center justify-center shadow-sm border border-zinc-200">
                      <svg
                        className="h-4 w-auto"
                        viewBox="0 0 120 36"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="18" cy="18" r="10" fill="#005B94" />
                        <circle cx="26" cy="18" r="10" fill="#E31B23" fillOpacity="0.9" />
                        <text
                          x="44"
                          y="23"
                          fontFamily="sans-serif"
                          fontSize="15"
                          fontWeight="900"
                          fill="#005B94"
                        >
                          meeza
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* مربع الموافقة الإلزامي على الشروط والأحكام */}
              <div
                className={`rounded-2xl p-4 border transition-all ${
                  agreeTerms
                    ? 'bg-emerald-950/25 border-emerald-500/45'
                    : 'bg-white/[0.03] border-white/15'
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
                  <span className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
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
                  <p className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2.5 pl-8">
                    <FaCheckCircle /> Terms accepted — you can proceed to payment.
                  </p>
                ) : (
                  <p className="text-xs text-amber-400/90 mt-2.5 pl-8">
                    * Please confirm the Terms &amp; Conditions to unlock the Pay Now button.
                  </p>
                )}
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}
            </div>

            {/* أزرار الدفع والدعم */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCardPayment}
                  disabled={!agreeTerms || loadingPay}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 font-extrabold rounded-2xl transition-all duration-200 text-base sm:text-lg ${
                    agreeTerms && !loadingPay
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_10px_30px_rgba(37,99,235,0.45)] cursor-pointer'
                      : 'bg-zinc-800/90 text-zinc-500 cursor-not-allowed border border-white/10'
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
                  className="w-14 h-14 flex items-center justify-center shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all duration-200 shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
                >
                  <FaWhatsapp className="text-2xl" />
                </a>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/10">
                <span>Card details are never stored on our servers.</span>
                <Link
                  href={`/${locale}`}
                  className="text-zinc-400 hover:text-white hover:underline transition-colors"
                >
                  Cancel &amp; return
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
        <div className="min-h-screen bg-[#040712] text-white flex items-center justify-center">
          <span className="text-zinc-400 text-sm">Loading Checkout...</span>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
