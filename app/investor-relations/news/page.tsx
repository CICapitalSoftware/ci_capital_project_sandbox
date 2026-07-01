"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Use the same fetch function from your homepage
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

// Helper to extract Strapi Image URLs
const getStrapiImage = (imageObj: any, fallback: string) => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj;
  if (imageObj.url) return `http://localhost:1337${imageObj.url}`;
  if (Array.isArray(imageObj) && imageObj[0]?.url) return `http://localhost:1337${imageObj[0].url}`;
  return fallback;
};

export default function NewsDisclosuresPage() {
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocale] = useState<'en' | 'ar'>('en'); // Default to English

  // Fetch data when component mounts
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await fetchFromStrapi('press-releases', locale);
      setPressReleases(data);
      setIsLoading(false);
    }
    loadData();
  }, [locale]);

  // If loading, show skeleton
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          News & Disclosures
        </h1>
        <p className="text-neutral-500 text-sm mb-8 tracking-wider uppercase">
          Latest corporate announcements and regulatory filings
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white border border-sky-100 shadow-sm overflow-hidden animate-pulse">
              <div className="h-56 w-full bg-sky-50"></div>
              <div className="p-6">
                <div className="h-4 bg-sky-100 w-1/3 mb-3"></div>
                <div className="h-6 bg-sky-100 w-3/4 mb-2"></div>
                <div className="h-4 bg-sky-100 w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // If no data, show empty state
  if (!pressReleases || pressReleases.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-4">
          News & Disclosures
        </h1>
        <p className="text-neutral-500 text-lg">
          No press releases available at the moment. Please check back later.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          News & Disclosures
        </h1>
        <p className="text-neutral-500 text-sm tracking-wider uppercase">
          Latest corporate announcements and regulatory filings
        </p>
        <div className="w-16 h-0.5 bg-sky-600 mt-4"></div>
      </div>

      {/* Filter/Tabs (optional – you can add category filters here) */}
      <div className="flex gap-4 mb-8 border-b border-sky-100 pb-4">
        <button className="text-sm font-bold uppercase tracking-wider text-sky-600 border-b-2 border-sky-600 pb-2">
          All
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-700 transition-colors pb-2">
          Financial Results
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-700 transition-colors pb-2">
          Regulatory Disclosures
        </button>
        <button className="text-sm font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-700 transition-colors pb-2">
          Press Releases
        </button>
      </div>

      {/* Grid of press releases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pressReleases.map((press: any) => {
          const attrs = press.attributes || press;
          const imageSrc = getStrapiImage(attrs.image, '/CICapitalLogo-Ar.png');
          // Use slug if available, otherwise fallback to id
          const slug = attrs.slug || press.id;

          return (
            <Link
              key={press.id}
              href={`/investor-relations/news/${slug}`}
              className="group bg-white rounded-none border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              {/* Image area */}
              <div className="h-56 w-full bg-white flex items-center justify-center p-6 border-b border-sky-50 select-none">
                <img
                  src={imageSrc}
                  alt={attrs.title || 'Press release'}
                  className="max-w-full max-h-full object-contain opacity-90 group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Category and date */}
                  <div className="flex justify-between items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-sky-50 text-sky-700 px-2 py-0.5 rounded-none">
                      {attrs.category || 'Disclosure'}
                    </span>
                    <span className="text-xs text-neutral-400 font-normal">
                      {attrs.date || ''}
                    </span>
                  </div>
                  {/* Title */}
                  <h3 className="text-lg font-light text-neutral-950 leading-snug uppercase tracking-tight line-clamp-3 group-hover:text-neutral-700 transition-colors">
                    {attrs.title}
                  </h3>
                </div>
                {/* Read More link */}
                <div className="pt-4 border-t border-sky-50 mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Read More →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}