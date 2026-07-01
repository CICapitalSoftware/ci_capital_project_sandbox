"use client";

import React from 'react';

export default function ShareInformationPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          Share Information
        </h1>
        <p className="text-neutral-500 text-sm tracking-wider uppercase">
          Stock data, shareholder services, and dividend information
        </p>
        <div className="w-16 h-0.5 bg-sky-600 mt-4"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stock data */}
        <div className="bg-white border border-sky-100 shadow-sm p-6">
          <h2 className="text-xl font-light text-neutral-950 uppercase tracking-tight mb-4">Stock Data</h2>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-sky-50 pb-2">
              <span className="text-sm text-neutral-500">Ticker Symbol</span>
              <span className="text-sm font-medium text-neutral-900">CICH (EGX)</span>
            </div>
            <div className="flex justify-between border-b border-sky-50 pb-2">
              <span className="text-sm text-neutral-500">Current Price</span>
              <span className="text-sm font-medium text-neutral-900">EGP 42.50</span>
            </div>
            <div className="flex justify-between border-b border-sky-50 pb-2">
              <span className="text-sm text-neutral-500">Market Cap</span>
              <span className="text-sm font-medium text-neutral-900">EGP 25.8B</span>
            </div>
            <div className="flex justify-between border-b border-sky-50 pb-2">
              <span className="text-sm text-neutral-500">52‑Week Range</span>
              <span className="text-sm font-medium text-neutral-900">EGP 28.00 – 45.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-neutral-500">Dividend Yield</span>
              <span className="text-sm font-medium text-neutral-900">3.2%</span>
            </div>
          </div>
        </div>

        {/* Shareholder services */}
        <div className="bg-white border border-sky-100 shadow-sm p-6">
          <h2 className="text-xl font-light text-neutral-950 uppercase tracking-tight mb-4">Shareholder Services</h2>
          <ul className="space-y-3 text-sm text-neutral-700">
            <li className="flex items-start gap-3">
              <span className="text-sky-600 mt-0.5">▸</span>
              <span>Transfer of shares and registration</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-600 mt-0.5">▸</span>
              <span>Dividend payment and reinvestment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-600 mt-0.5">▸</span>
              <span>Shareholder meetings and proxy voting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-600 mt-0.5">▸</span>
              <span>Annual and quarterly reports delivery</span>
            </li>
          </ul>
          <div className="mt-6 pt-6 border-t border-sky-50">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">For assistance, contact our investor relations team:</p>
            <p className="text-sm text-neutral-700 mt-1">investors@cicapital.com</p>
            <p className="text-sm text-neutral-700">+20 (2) 2345 6789</p>
          </div>
        </div>
      </div>
    </section>
  );
}