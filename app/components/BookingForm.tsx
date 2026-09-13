'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingForm({ adultPrice = 150, childPrice = 150, locale, serviceName }: any) {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [notes, setNotes] = useState('');

  // حساب التكلفة الإجمالية تلقائياً ولحظياً
  const totalCost = (adults * Number(adultPrice)) + (children * Number(childPrice));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // تجميع كافة البيانات لتنتقل وتتثبت تلقائياً في صفحة الدفع
    const queryParams = new URLSearchParams({
      service: serviceName || 'Diving Tour',
      date: date || 'Not specified',
      adults: adults.toString(),
      children: children.toString(),
      total: totalCost.toString(),
      name: fullName,
      email: email,
      phone: phone,
      country: country || 'Not specified',
      notes: notes || ''
    });

    // الانتقال التلقائي لصفحة الدفع مع تثبيت البيانات
    router.push(`/${locale}/checkout?${queryParams.toString()}`);
  };

  return (
    <div className="max-w-md mx-auto bg-[#101033] border border-blue-600/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white">
      <h3 className="text-2xl font-extrabold mb-6">Send an Inquiry</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-amber-400 mb-1 font-semibold">
            <span>Date</span>
            <span>1 day</span>
          </div>
          <input 
            type="date" 
            required 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs text-amber-400 mb-1 font-semibold">
              <span>Adults</span>
              <span>€ {adultPrice}</span>
            </div>
            <input 
              type="number" 
              min="1" 
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value) || 0)}
              className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none font-bold" 
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-amber-400 mb-1 font-semibold">
              <span>Children</span>
              <span>€ {childPrice}</span>
            </div>
            <input 
              type="number" 
              min="0" 
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
              className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none font-bold" 
            />
          </div>
        </div>

        <div>
          <input 
            type="text" 
            placeholder="Full Name" 
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-zinc-500" 
          />
        </div>

        <div>
          <input 
            type="email" 
            placeholder="Email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-zinc-500" 
          />
        </div>

        <div>
          <input 
            type="tel" 
            placeholder="Phone" 
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-zinc-500" 
          />
        </div>

        <div>
          <input 
            type="text" 
            placeholder="Country (e.g. United Kingdom, Italy...)" 
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-zinc-500" 
          />
        </div>

        <div>
          <textarea 
            placeholder="Notes" 
            rows={3} 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white text-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none placeholder:text-zinc-500 resize-none" 
          />
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-blue-600/30">
          <span className="text-lg font-bold">Total cost</span>
          <span className="text-2xl font-extrabold text-amber-400">€ {totalCost}</span>
        </div>

        <button 
          type="submit"
          title="Book Now"
          aria-label="Book Now"
          className="w-full py-4 bg-white hover:bg-zinc-200 text-zinc-900 font-bold rounded-2xl transition-all shadow-lg text-center mt-4 cursor-pointer"
        >
          Book Now
        </button>
      </form>
    </div>
  );
}