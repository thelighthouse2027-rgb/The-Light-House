'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { FaWhatsapp, FaCreditCard, FaShieldAlt } from 'react-icons/fa';

declare global {
  interface Window {
    Checkout?: any;
  }
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
    try {
      setLoadingPay(true);
      setErrorMessage('');

      // 1. طلب session ID من السيرفر
      const res = await fetch('/api/pay', {
        method: 'POST'
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.sessionId) {
        throw new Error(data.error || 'Failed to initiate payment session');
      }

      const numericTotal = parseFloat(total) || 250;
      const formattedAmount = numericTotal.toFixed(2);
      const orderId = `LH-${Date.now()}`;

      // 2. إعداد بوابة الدفع بجميع الحقول المطلوبة لـ QNB MPGS
      if (typeof window !== 'undefined' && window.Checkout) {
        window.Checkout.configure({
          session: {
            id: data.sessionId
          },
          order: {
            amount: formattedAmount,
            currency: 'EGP',
            description: service.slice(0, 100),
            id: orderId
          },
          interaction: {
            operation: 'PURCHASE',
            merchant: {
              name: 'The Light House Diving Center'
            },
            displayControl: {
              billingAddress: 'HIDE',
              customerEmail: 'HIDE'
            }
          },
          error: function(err: any) {
            console.error('Checkout error:', err);
            setLoadingPay(false);
            setErrorMessage('Payment process interrupted. Please retry.');
          },
          cancel: function() {
            setLoadingPay(false);
          }
        });

        // 3. عرض شاشة إدخال البطاقة
        window.Checkout.showPaymentPage();
      } else {
        window.location.href = `https://qnbalahli.test.gateway.mastercard.com/checkout/pay/${data.sessionId}`;
      }
    } catch (err: any) {
      console.error('Payment Error:', err);
      setErrorMessage(err.message || 'Payment initiation failed.');
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <>
      <Script
        src="https://qnbalahli.test.gateway.mastercard.com/static/checkout/checkout.min.js"
        strategy="afterInteractive"
      />

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

          {/* لوحة الدفع والتأكيد */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-extrabold mb-6 text-white tracking-wide">Checkout</h2>
              
              <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-6 mb-6 text-sm text-zinc-300 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-blue-400 font-semibold text-base">
                  <FaShieldAlt className="text-lg" />
                  <span>QNB AlAhli Secure Gateway</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Click the button below to complete your payment securely with Visa or Mastercard via the bank&apos;s encrypted portal.
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span>Amount to be charged:</span>
                  <span className="font-bold text-white text-base">€ {total}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-500/50 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* صف الأزرار */}
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={handleCardPayment}
                  disabled={loadingPay}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-extrabold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.55)] text-center cursor-pointer text-lg"
                >
                  <FaCreditCard className="text-xl" />
                  <span>{loadingPay ? 'Connecting to Bank...' : `Pay Now (€ ${total})`}</span>
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
    </>
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
