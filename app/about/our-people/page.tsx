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
    bio?: any;
    image?: any;
    category?: string;
    displayOrder?: number;
  };
  name?: string;
  title?: string;
  slug?: string;
  bio?: any;
  image?: any;
  category?: string;
  displayOrder?: number;
};

const CATEGORIES = {
  'board-of-directors': 'Board of Directors',
  'executive-management': 'Executive Management',
};

function getBioPreview(bio: any[], maxLength: number = 500): string {
  if (!bio) return '';
  let text = '';
  for (const block of bio) {
    if (block.type === 'paragraph') {
      const paragraphText = block.children.map((child: any) => child.text || '').join('');
      if (paragraphText.trim()) {
        text += paragraphText + ' ';
      }
    }
  }
  text = text.trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength) + '...';
  }
  return text;
}

async function fetchPeople() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/people?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    const data = json.data || [];
    return data.sort((a: Person, b: Person) => {
      const getAttrs = (p: Person) => p.attributes || p;
      const aOrder = getAttrs(a).displayOrder ?? 999;
      const bOrder = getAttrs(b).displayOrder ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;
      const aName = getAttrs(a).name || '';
      const bName = getAttrs(b).name || '';
      return aName.localeCompare(bName);
    });
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

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const categoryLabel = activeCategory === 'board-of-directors' ? 'Board of Directors' :
                        activeCategory === 'executive-management' ? 'Executive Management' :
                        'Leadership';

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
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight">
          {categoryLabel}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          As of {currentDate}
        </p>
        <hr className="mt-4 border-t-2 border-neutral-200" />
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 border-b border-neutral-200 pb-4">
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

      {/* People List */}
      {filteredPeople.length === 0 ? (
        <p className="text-neutral-500">No people found in this category.</p>
      ) : (
        <div className="space-y-12">
          {filteredPeople.map((person, index) => {
            const attrs = getAttrs(person);
            const imageUrl = attrs.image ? getStrapiImage(attrs.image, '') : null;
            const name = attrs.name || 'Unnamed';
            const title = attrs.title || '';
            const slug = attrs.slug || '';
            const bio = attrs.bio;

            const previewText = bio ? getBioPreview(bio, 500) : '';

            return (
              <div key={person.id}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-start">
                  <div className="md:col-span-2 space-y-2">
                    <Link href={`/about/our-people/${slug}`} className="group">
                      <h2 className="text-2xl md:text-3xl font-bold text-sky-600 group-hover:text-sky-700 transition-colors">
                        {name}
                      </h2>
                    </Link>
                    {title && (
                      <p className="text-lg md:text-xl font-light text-neutral-600">
                        {title}
                      </p>
                    )}
                    {/* Bio preview + "Read more" on the same line */}
                    <div className="flex flex-wrap items-baseline gap-1 mt-2">
                      {previewText && (
                        <span className="text-neutral-700 text-base leading-relaxed">
                          {previewText}
                        </span>
                      )}
                      <Link
                        href={`/about/our-people/${slug}`}
                        className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors whitespace-nowrap"
                      >
                        Read more →
                      </Link>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-center">
                    {imageUrl ? (
                      <div className="w-48 h-48 md:w-56 md:h-56 overflow-hidden bg-gray-100 shadow-sm flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const placeholder = document.createElement('div');
                              placeholder.className = 'w-full h-full flex items-center justify-center text-gray-400 bg-gray-100';
                              placeholder.innerHTML = `
                                <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              `;
                              parent.appendChild(placeholder);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-48 md:w-56 md:h-56 bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {index < filteredPeople.length - 1 && (
                  <hr className="mt-12 border-t-2 border-neutral-200" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}