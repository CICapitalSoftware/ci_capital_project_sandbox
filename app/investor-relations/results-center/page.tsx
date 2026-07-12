// app/investor-relations/results-center/page.tsx
"use client";

import { useState, useEffect } from 'react';

type ResultItem = {
  id: number;
  attributes?: {
    title?: string;
    category?: 'analyst-packs' | 'earnings-release' | 'financial-statements';
    year?: number;
    language?: string;
    date?: string;
    file?: any;
  };
  title?: string;
  category?: string;
  year?: number;
  language?: string;
  date?: string;
  file?: any;
};

const CATEGORY_LABELS: Record<string, string> = {
  'analyst-packs': 'Analyst Packs',
  'earnings-release': 'Earnings Release',
  'financial-statements': 'Financial Statements',
};

async function fetchResultItems() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/result-items?populate=*`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default function ResultsCenterPage() {
  const [items, setItems] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchResultItems()
      .then((data) => {
        if (data.length === 0) setError('No results found.');
        setItems(data);

        // 🔥 Only expand the newest year
        const years = new Set<number>();
        let maxYear = -Infinity;
        data.forEach((item) => {
          const attrs = item.attributes || item;
          if (attrs.year && attrs.year > maxYear) maxYear = attrs.year;
        });
        if (maxYear !== -Infinity) years.add(maxYear);
        setExpandedYears(years);

        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load results.');
        setLoading(false);
      });
  }, []);

  const getAttrs = (item: ResultItem) => item.attributes || item;

  const categories = Array.from(
    new Set(
      items
        .map((item) => getAttrs(item).category)
        .filter((cat): cat is string => !!cat)
    )
  );

  const filteredItems = activeCategory
    ? items.filter((item) => getAttrs(item).category === activeCategory)
    : items;

  const groupedByYear = filteredItems.reduce((acc, item) => {
    const attrs = getAttrs(item);
    const year = attrs.year || 0;
    if (!year) return acc;
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {} as Record<number, ResultItem[]>);

  const sortedYears = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const toggleYear = (year: number) => {
    const newSet = new Set(expandedYears);
    if (newSet.has(year)) {
      newSet.delete(year);
    } else {
      newSet.add(year);
    }
    setExpandedYears(newSet);
  };

  const getFileUrl = (file: any) => {
    if (!file) return '';
    const fileData = file.data?.attributes || file;
    return fileData.url ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${fileData.url}` : '';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-neutral-500">Loading results...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight">
          Results Center
        </h1>
        <p className="text-neutral-500 mt-2">
          Access our latest financial results and reports.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-200 pb-4">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
            activeCategory === null
              ? 'text-sky-600 border-b-2 border-sky-600'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
              activeCategory === cat
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {CATEGORY_LABELS[cat] || cat}
          </button>
        ))}
      </div>

      {/* Results grouped by year */}
      {filteredItems.length === 0 ? (
        <p className="text-neutral-500">No results available for this category.</p>
      ) : (
        <div className="space-y-8">
          {sortedYears.map((year) => {
            const isExpanded = expandedYears.has(year);
            const yearItems = groupedByYear[year];

            return (
              <div key={year} className="border border-sky-200 rounded-lg overflow-hidden shadow-sm">
                {/* Year Header with Toggle */}
                <button
                  onClick={() => toggleYear(year)}
                  className="w-full flex items-center gap-4 px-6 py-4 bg-sky-50/30 hover:bg-sky-50 transition-colors text-left"
                >
                  <h2 className="text-2xl md:text-3xl font-light text-neutral-800">
                    {year}
                  </h2>
                  <span className="text-2xl font-light text-sky-600">
                    {isExpanded ? '−' : '+'}
                  </span>
                </button>

                {/* Items – visible only when expanded */}
                {isExpanded && (
                  <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {yearItems.map((item) => {
                        const attrs = getAttrs(item);
                        const fileUrl = getFileUrl(attrs.file);
                        const language = attrs.language || 'English';
                        const date = attrs.date ? formatDate(attrs.date) : '';

                        return (
                          <a
                            key={item.id}
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-white border border-sky-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 hover:border-sky-300"
                          >
                            <h3 className="text-lg font-light text-neutral-950 tracking-tight group-hover:text-sky-600 transition-colors">
                              {attrs.title || 'Untitled'}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                              <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider">
                                {language}
                              </span>
                              {date && (
                                <span className="text-neutral-400 font-normal">{date}</span>
                              )}
                            </div>
                            <span className="inline-block mt-3 text-xs font-bold uppercase tracking-wider text-sky-600 group-hover:text-sky-700">
                              Download PDF →
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}