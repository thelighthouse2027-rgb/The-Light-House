'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

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

  const whatsappMessage = 
`🌊 *NEW BOOKING INQUIRY* 🤿
*The Light House Diving Center*
━━━━━━━━━━━━━━━━━━━━

📋 *TRIP DETAILS*
• *Service:* ${service}
• *Date:* ${date}
• *Guests:* ${adults} Adults, ${children} Children

👤 *GUEST INFORMATION*
• *Lead Guest:* ${name}
• *Email:* ${email}
• *Phone:* ${phone}
• *Country:* ${country}

💰 *PAYMENT SUMMARY*
• *Total Payable:* € ${total}
• *Currency:* EUR (€)

━━━━━━━━━━━━━━━━━━━━
_Please confirm boat manifest availability and finalize the reservation._`;

  const whatsappUrl = `https://wa.me/201036930803?text=${encodeURIComponent(whatsappMessage)}`;

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

        {/* تأكيد الحجز وإرسال التفاصيل عبر واتساب */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-extrabold mb-6 text-white tracking-wide">Booking Confirmation</h2>
            
            <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-5 mb-6 text-sm text-zinc-300 space-y-3 shadow-inner">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-base">
                <span>Instant Operations Desk Confirmation</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Click below to send your complete reservation details directly to our dive operations team via WhatsApp. We will immediately verify boat manifests, reserve your equipment, and arrange payment options.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                <span>Official Currency:</span>
                <span className="font-bold text-white">Euros (€)</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] text-center cursor-pointer text-lg"
            >
              <FaWhatsapp className="text-2xl" />
              <span>Confirm via WhatsApp (€ {total})</span>
            </a>

            <div className="text-center">
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
