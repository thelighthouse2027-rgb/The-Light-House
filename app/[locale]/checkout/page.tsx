'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp, FaCreditCard, FaShieldAlt, FaLock } from 'react-icons/fa';

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
  
  // شرط البنك: حالة الموافقة على الشروط وسياسة الاسترجاع
  const [agreeTerms, setAgreeTerms] = useState(false);

  const whatsappMessage = 
`🌊 *BOOKING SUPPORT / INQUIRY* 🤿
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
      setErrorMessage('Please accept the Terms & Refund Policy to proceed with payment.');
      return;
    }

    try {
      setLoadingPay(true);
      setErrorMessage('');

      const numericTotal = parseFloat(total) || 20;

      // 1. طلب الرابط المباشر من السيرفر
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: numericTotal,
          currency: 'EGP'
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.redirectUrl) {
        throw new Error(data.error || 'Failed to initiate payment session');
      }

      // 2. التحويل المباشر لصفحة الدفع الرسمية الخاصة بـ QNB
      window.location.href = data.redirectUrl;

    } catch (err: any) {
      console.error('Payment Error:', err);
      setErrorMessage(err.message || 'Payment initiation failed.');
      setLoadingPay(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#101033] border border-blue-600/30 rounded-3xl p-8 shadow-2xl">
        
        {/* ملخص الحجز */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-blue-600/30 pb-8 md:pb-0 md:pr-8">
          <div>
            <h2 className="text-2xl font-extrabold mb-6 text-white tracking-wide">Booking Summary</h2>
            <div className="space-y-3 text-zinc-300 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Service:</span>
                <span className="font-bold text-white text-right max-w-[60%]">{service}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Date:</span>
                <span className="font-bold text-white">{date}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Adults / Kids:</span>
                <span className="font-bold text-white">{adults} Adults, {children} Children</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Name:</span>
                <span className="font-bold text-white">{name}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Email:</span>
                <span className="font-bold text-white">{email}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Phone:</span>
                <span className="font-bold text-white">{phone}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Country:</span>
                <span className="font-bold text-white">{country}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-blue-600/30 flex justify-between items-center">
            <span className="text-lg font-bold">Total to Pay</span>
            <span className="text-3xl font-extrabold text-amber-400">€ {total}</span>
          </div>
        </div>

        {/* لوحة الدفع */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-extrabold mb-6 text-white tracking-wide">Checkout</h2>
            
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-6 mb-4 text-sm text-zinc-300 space-y-4 shadow-inner">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-base">
                <FaShieldAlt className="text-lg" />
                <span>QNB AlAhli Secure Gateway</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Click the button below to complete your payment securely with Visa, Mastercard, or Meeza via the bank&apos;s encrypted portal.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>Amount to be charged:</span>
                <span className="font-bold text-white text-base">€ {total}</span>
              </div>
            </div>

            {/* شرط البنك الإجباري: المربع والروابط */}
            <div className="bg-blue-950/20 border border-white/10 rounded-2xl p-4 mb-4 select-none">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-zinc-600 text-blue-600 focus:ring-blue-500 bg-[#161b33] cursor-pointer shrink-0"
                  required
                />
                <span className="text-xs text-zinc-300 leading-relaxed">
                  I have read and agree to the{' '}
                  <Link 
                    href={`/${locale}/terms-refund-policy`} 
                    target="_blank" 
                    className="text-blue-400 hover:text-blue-300 underline font-semibold"
                  >
                    Terms &amp; Refund Policy
                  </Link>{' '}
                  and{' '}
                  <Link 
                    href={`/${locale}/privacy-policy`} 
                    target="_blank" 
                    className="text-blue-400 hover:text-blue-300 underline font-semibold"
                  >
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {!agreeTerms && (
                <p className="text-[11px] text-amber-400/90 mt-2 pl-7">
                  * You must agree to proceed to the secure payment portal.
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
                className={`flex-1 flex items-center justify-center gap-3 py-4 text-white font-extrabold rounded-2xl transition-all duration-300 text-center text-lg ${
                  agreeTerms && !loadingPay
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)] cursor-pointer'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5 shadow-none'
                }`}
              >
                {loadingPay ? (
                  <span>Connecting to Bank...</span>
                ) : (
                  <>
                    <FaLock className="text-base" />
                    <span>Pay Now (€ {total})</span>
                  </>
                )}
              </button>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Contact Support on WhatsApp"
                className="w-14 h-14 flex items-center justify-center shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer"
              >
                <FaWhatsapp className="text-2xl" />
              </a>
            </div>

            {/* شعارات الدفع المعتمدة من البنك (Visa, Mastercard, Meeza) */}
            <div className="pt-2 text-center space-y-2 border-t border-white/10">
              <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">
                Accepted Payment Cards &amp; Wallets
              </span>

              <div className="flex items-center justify-center gap-3">
                {/* Visa */}
                <div className="h-8 px-3 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg className="h-4 w-auto" viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.8 1.5L25.9 30.5H16.8L10.3 7.8C9.9 6.2 9.6 5.6 8.3 4.9C6.2 3.8 2.9 2.8 0 2.2L0.2 1.5H14.7C16.6 1.5 18.2 2.8 18.6 4.9L22.2 21.6L30.9 1.5H39.8ZM75.2 21.1C75.3 13.1 63.8 12.6 63.9 9.1C64 8 65.1 6.8 67.4 6.5C68.6 6.3 71.9 6.2 75.3 7.7L76.7 1.8C74.8 1.1 72.3 0.5 69.1 0.5C60.7 0.5 54.8 4.9 54.7 11.2C54.6 15.9 58.8 18.6 62 20.1C65.2 21.7 66.3 22.7 66.3 24.1C66.2 26.2 63.7 27.2 61.3 27.2C57.4 27.2 55.1 26.6 52.8 25.5L51.3 31.6C53.3 32.5 57 33.2 60.8 33.2C69.7 33.2 75.2 28.8 75.2 21.1ZM97.2 30.5H105L98.2 1.5H91C89.4 1.5 88.1 2.4 87.5 3.8L74.8 30.5H83.9L85.7 25.5H96.9L97.2 30.5ZM88.2 18.8L92.8 6.4L95.5 18.8H88.2ZM53 1.5L45.9 30.5H37.3L44.4 1.5H53Z" fill="#1434CB"/>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="h-8 px-3 rounded-lg bg-white flex items-center justify-center shadow-sm">
                  <svg className="h-5 w-auto" viewBox="0 0 131 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="40" cy="40" r="40" fill="#EB001B"/>
                    <circle cx="91" cy="40" r="40" fill="#F79E1B"/>
                    <path d="M65.5 15.2C72.8 21.9 77.4 30.4 77.4 40C77.4 49.6 72.8 58.1 65.5 64.8C58.2 58.1 53.6 49.6 53.6 40C53.6 30.4 58.2 21.9 65.5 15.2Z" fill="#FF5F00"/>
                  </svg>
                </div>

                {/* Meeza */}
                <div className="h-8 px-3 rounded-lg bg-white flex items-center justify-center shadow-sm border border-zinc-200">
                  <svg className="h-4 w-auto" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="10" fill="#005B94"/>
                    <circle cx="26" cy="18" r="10" fill="#E31B23" fillOpacity="0.9"/>
                    <text x="44" y="23" fontFamily="sans-serif" fontSize="15" fontWeight="900" fill="#005B94">
                      meeza
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
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
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <span className="text-zinc-400 text-sm">Loading Checkout...</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
