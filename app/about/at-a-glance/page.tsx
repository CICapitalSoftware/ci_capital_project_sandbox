"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Reuse the fetch functions from the homepage
async function fetchFromStrapi(path: string, locale: string = 'en') {
  try {
    const res = await fetch(`http://localhost:1337/api/${path}?populate=*&locale=${locale}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

const getStrapiImage = (imageObj: any, fallback: string) => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj; 
  if (imageObj.url) return `http://localhost:1337${imageObj.url}`;
  if (Array.isArray(imageObj) && imageObj[0]?.url) return `http://localhost:1337${imageObj[0].url}`;
  return fallback;
};

export default function AtAGlancePage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchFromStrapi('who-we-ares', locale);
      setAboutData(data?.[0] || null);
      setIsLoading(false);
    }
    loadData();
  }, [locale]);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-sky-100 w-1/4"></div>
          <div className="h-12 bg-sky-100 w-3/4"></div>
          <div className="h-6 bg-sky-100 w-full"></div>
          <div className="h-6 bg-sky-100 w-full"></div>
        </div>
      </section>
    );
  }

  const attrs = aboutData?.attributes || aboutData || {};

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          At a Glance
        </h1>
        <p className="text-neutral-500 text-sm tracking-wider uppercase">
          {attrs.tag || "ABOUT CI CAPITAL"}
        </p>
        <div className="w-16 h-0.5 bg-sky-600 mt-4"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-neutral-950 uppercase tracking-tight mb-4">
            {attrs.title || "Who We Are"}
          </h2>
          <p className="text-neutral-700 text-lg leading-relaxed font-light">
            {attrs.description || "CI Capital is Egypt's premier diversified financial services group, delivering institutional-grade investment banking, asset management, securities brokerage, and non-banking credit solutions."}
          </p>
          
          {attrs.values && attrs.values.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-6">
              {attrs.values.map((value: any, idx: number) => (
                <span key={idx} className="inline-block bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium px-4 py-2 rounded-none tracking-wide">
                  {typeof value === 'string' ? value : value.label ?? "Value"}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="relative h-64 md:h-80 lg:h-96 bg-sky-50 overflow-hidden shadow-inner rounded-none">
          <img 
            src={getStrapiImage(attrs.image, "/about-placeholder.jpg")} 
            alt="About CI Capital" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 text-xl font-light';
                fallback.innerHTML = 'CI CAPITAL<br/><span class="text-sm">Est. 2006</span>';
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
      </div>

      {/* Key Stats */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-sky-100 shadow-sm p-6 text-center">
          <div className="text-4xl font-light text-sky-600">186B+</div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Assets Under Management</div>
        </div>
        <div className="bg-white border border-sky-100 shadow-sm p-6 text-center">
          <div className="text-4xl font-light text-sky-600">30+</div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Transactions (2025)</div>
        </div>
        <div className="bg-white border border-sky-100 shadow-sm p-6 text-center">
          <div className="text-4xl font-light text-sky-600">22,900+</div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Clients</div>
        </div>
        <div className="bg-white border border-sky-100 shadow-sm p-6 text-center">
          <div className="text-4xl font-light text-sky-600">3</div>
          <div className="text-sm text-neutral-500 uppercase tracking-wider mt-2">Global Offices</div>
        </div>
      </div>
    </section>
  );
}