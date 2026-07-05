"use client";

import React from 'react';
import Link from 'next/link';

export default function SolutionPage() {
  const title = "Securities Brokerage";
  const description = "CI Capital offers full-service securities brokerage with execution, clearing, and custody services for institutional and retail clients. Our advanced trading platforms provide access to regional and international markets with competitive pricing and expert market intelligence.";
  const stat1 = "EGP 10B+";
  const stat1Label = "Annual Trading Volume";
  const stat2 = "22,900+";
  const stat2Label = "Active Clients";

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
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