'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const courseKeys = [
  'nitrox',
  'drysuit',
  'deep',
  'navigator',
  'wreck',
  'sidemount',
  'night',
  'buoyancy',
];

export default function DivingCoursesSection() {
  const t = useTranslations('Courses');

  const coursesList = courseKeys.map((key) => ({
    title: t(key),
    href: '#',
  }));

  return (
    <section className="py-20 bg-black overflow-hidden relative border-y border-blue-600/20">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[20vw] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="text-center mb-12 relative z-10 px-6">
        <span className="text-blue-500 font-semibold uppercase tracking-widest text-xs bg-blue-950/50 px-4 py-1.5 rounded-full border border-blue-500/30">
          {t('badge')}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">
          Featured PADI <span className="text-blue-600">Diving Courses</span>
        </h2>
        <p className="text-zinc-400 text-base max-w-xl mx-auto mt-2">
          {t('sectionSubtitle')}
        </p>
      </div>

      <div className="relative w-full flex whitespace-nowrap overflow-hidden group">
        
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max px-3">
          {[...coursesList, ...coursesList].map((course, index) => (
            <Link
              key={index}
              href={course.href}
              className="flex items-center gap-3 bg-zinc-950/80 hover:bg-zinc-900 border border-blue-500/20 hover:border-blue-500 text-white px-6 py-4 rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 group/card cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-950/50 flex items-center justify-center text-blue-500 group-hover/card:bg-blue-600 group/card:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-medium text-sm md:text-base tracking-wide text-zinc-200 group-hover/card:text-white">
                {course.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}