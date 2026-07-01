"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

export default function ResultsCenterPage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      // Fetch from a Strapi collection "financial-reports" or create a new one "quarterly-results"
      const data = await fetchFromStrapi('quarterly-results', locale);
      setResults(data);
      setIsLoading(false);
    }
    loadData();
  }, [locale]);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          Results Center
        </h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-sky-100 w-1/2"></div>
          <div className="h-4 bg-sky-100 w-1/4"></div>
          <div className="h-4 bg-sky-100 w-3/4"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 uppercase tracking-tight mb-2">
          Results Center
        </h1>
        <p className="text-neutral-500 text-sm tracking-wider uppercase">
          Quarterly and annual financial results
        </p>
        <div className="w-16 h-0.5 bg-sky-600 mt-4"></div>
      </div>

      {results.length === 0 ? (
        <div className="bg-white border border-sky-100 shadow-sm p-12 text-center">
          <p className="text-neutral-500 text-lg">No results available at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item: any) => {
            const attrs = item.attributes || item;
            return (
              <div key={item.id} className="bg-white border border-sky-100 shadow-sm p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-light text-neutral-950 uppercase tracking-tight">{attrs.title}</h3>
                <p className="text-sm text-neutral-500 mt-2">{attrs.period || ''}</p>
                <Link
                  href={attrs.file?.url ? `http://localhost:1337${attrs.file.url}` : '#'}
                  className="inline-block mt-4 text-sm font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Download PDF →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}