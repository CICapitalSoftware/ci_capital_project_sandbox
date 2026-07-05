"use client";

import React from 'react';
import Link from 'next/link';

export default function SolutionPage() {
  const title = "Research";
  const description = "CI Capital's Research division delivers in-depth market analysis, economic insights, and sector-specific research to institutional investors and corporate clients. Our team of analysts provides actionable intelligence across equities, fixed income, and macroeconomics to guide investment decisions.";
  const stat1 = "100+";
  const stat1Label = "Research Reports / Year";
  const stat2 = "15+";
  const stat2Label = "Sectors Covered";

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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
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