"use client";

import React from 'react';
import Link from 'next/link';

export default function SolutionPage() {
  const title = "Custody";
  const description = "CI Capital's Custody services provide secure asset safekeeping, settlement, and reporting for institutional investors. Our robust infrastructure ensures regulatory compliance and operational efficiency across regional and international markets.";
  const stat1 = "EGP 50B+";
  const stat1Label = "Assets Under Custody";
  const stat2 = "99.99%";
  const stat2Label = "Settlement Accuracy";

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-6">
        <Link href="/solutions" className="text-sky-600 hover:text-sky-700 text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2">
          ← Back to Solutions
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative h-64 md:h-96 bg-sky-50 overflow-hidden shadow-inner rounded-none flex items-center justify-center">
          <div className="text-sky-300 text-6xl font-light">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659a1 1 0 002.242 0l.879-.659m.879.659a1 1 0 002.242 0l.879-.659m.879.659a1 1 0 002.242 0l.879-.659M12 6L9 9m3-3l3 3m-6 0l-3 3m3-3l3-3m-3 9l3-3m-9 6l3-3m6 3l3-3" />
            </svg>
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-4">{title}</h1>
          <div className="h-1 w-16 bg-sky-600 mb-6"></div>
          <p className="text-neutral-700 text-lg md:text-xl leading-relaxed font-light">{description}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-sky-50 border border-sky-100 p-4 text-center">
              <div className="text-2xl font-light text-sky-600">{stat1}</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">{stat1Label}</div>
            </div>
            <div className="bg-sky-50 border border-sky-100 p-4 text-center">
              <div className="text-2xl font-light text-sky-600">{stat2}</div>
              <div className="text-xs text-neutral-500 uppercase tracking-wider">{stat2Label}</div>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/contact" className="inline-block bg-sky-600 text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-sky-700 transition-colors">Learn More</Link>
          </div>
        </div>
      </div>
    </section>
  );
}