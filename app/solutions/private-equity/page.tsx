"use client";

import React from 'react';
import Link from 'next/link';

export default function SolutionPage() {
  const title = "Private Equity";
  const description = "CI Capital's Private Equity division provides strategic capital and operational expertise to high-growth companies across the Middle East and North Africa. We partner with management teams to drive sustainable value creation through active ownership and industry insights.";
  const stat1 = "$500M+";
  const stat1Label = "Capital Deployed";
  const stat2 = "15+";
  const stat2Label = "Portfolio Companies";

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
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