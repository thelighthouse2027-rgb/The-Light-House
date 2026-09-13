'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = React.use(params);
  const locale = resolvedParams.locale;
  
  const searchParams = useSearchParams();

  const service = searchParams.get('service') || 'Diving Tour';
  const date = searchParams.get('date') || 'Not specified';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const total = searchParams.get('total') || '150';
  const name = searchParams.get('name') || 'Not specified';
  const email = searchParams.get('email') || 'Not specified';
  const phone = searchParams.get('phone') || 'Not specified';
  const country = searchParams.get('country') || 'Not specified';

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Payment integration is coming soon! Your booking inquiry has been successfully recorded.');
  };

  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#101033] border border-blue-600/30 rounded-3xl p-8 shadow-2xl">
        
        {/* ملخص الحجز المثبت تلقائياً من بيانات العميل */}
        <div className="flex flex-col justify-between border-b md:border-b-0 md:border-r border-blue-600/30 pb-8 md:pb-0 md:pr-8">
          <div>
            <h2 className="text-2xl font-extrabold mb-6 text-white">Booking Summary</h2>
            <div className="space-y-3 text-zinc-300 text-sm">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-zinc-400">Service:</span>
                <span className="font-bold text-white text-right">{service}</span>
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

        {/* نموذج تفاصيل الدفع */}
        <div>
          <h2 className="text-2xl font-extrabold mb-6 text-white">Payment Details</h2>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-amber-400 mb-1 font-semibold">Cardholder Name</label>
              <input 
                type="text" 
                placeholder="Name on card" 
                required
                className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-amber-400 mb-1 font-semibold">Card Number</label>
              <input 
                type="text" 
                placeholder="1234 5678 9012 3456" 
                required
                className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-amber-400 mb-1 font-semibold">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  required
                  className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-amber-400 mb-1 font-semibold">CVV</label>
                <input 
                  type="password" 
                  placeholder="123" 
                  required
                  className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                title={`Pay Now (€ ${total})`}
                aria-label={`Pay Now (€ ${total})`}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg text-center cursor-pointer"
              >
                Pay Now (€ {total})
              </button>
            </div>

            <div className="text-center mt-4">
              <Link 
                href={`/${locale}`} 
                title="Cancel and return to home"
                aria-label="Cancel and return to home"
                className="text-xs text-zinc-400 hover:underline"
              >
                Cancel and return to home
              </Link>
            </div>
          </form>
        </div>

      </div>
    </main>
  );
}