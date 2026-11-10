import { Suspense } from 'react';
import ContactForm from './ContactForm';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ContactForm />
    </Suspense>
  );
}