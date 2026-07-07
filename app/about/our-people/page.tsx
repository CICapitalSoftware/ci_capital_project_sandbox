// app/about/our-people/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';

type Person = {
  id: number;
  attributes?: {
    name?: string;
    title?: string;
    slug?: string;
    bio?: string;
    image?: any;
    category?: string;
  };
  name?: string;
  title?: string;
  slug?: string;
  bio?: string;
  image?: any;
  category?: string;
};

const CATEGORIES = {
  'board-of-directors': 'Board of Directors',
  'executive-management': 'Executive Management',
};

async function fetchPeople() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/people?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default function OurPeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('board-of-directors');

  useEffect(() => {
    fetchPeople()
      .then((data) => {
        if (data.length === 0) setError('No people found.');
        setPeople(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load people.');
        setLoading(false);
      });
  }, []);

  const getAttrs = (person: Person) => person.attributes || person;

  const filteredPeople = activeCategory
    ? people.filter((p) => getAttrs(p).category === activeCategory)
    : people;

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-neutral-500">Loading...</p>
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
          Our People
        </h1>
        <p className="text-neutral-500 mt-2">
          Meet the leaders shaping our firm.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-200 pb-4">
        {Object.entries(CATEGORIES).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
              activeCategory === value
                ? 'text-sky-600 border-b-2 border-sky-600'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {filteredPeople.length === 0 ? (
        <p className="text-neutral-500">No people found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredPeople.map((person) => {
            const attrs = getAttrs(person);
            const imageUrl = attrs.image ? getStrapiImage(attrs.image, '') : null;
            const name = attrs.name || 'Unnamed';
            const title = attrs.title || '';

            return (
              <Link
                key={person.id}
                href={`/about/our-people/${attrs.slug}`}
                className="group flex flex-col items-center text-center hover:opacity-80 transition-opacity"
              >
                {imageUrl ? (
                  <div className="w-48 h-48 md:w-56 md:h-56 overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 md:w-56 md:h-56 bg-gray-200 flex items-center justify-center text-gray-400 mb-4">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 group-hover:text-sky-600 transition-colors">
                  {name}
                </h3>
                {title && <p className="text-base md:text-lg text-neutral-500">{title}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}