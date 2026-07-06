// app/about/timeline/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { getStrapiImage } from '@/lib/strapi';
import Hero from '@/components/Hero';

async function fetchTimelineItems() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/timeline-items?populate=*&sort=date:asc&pagination[pageSize]=1000&locale=all`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

async function fetchTimelineHero() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/timeline-heroes?populate=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0];
    }
    if (json.data && !Array.isArray(json.data)) {
      return json.data;
    }
    return null;
  } catch {
    return null;
  }
}

export default function TimelinePage() {
  const [items, setItems] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [itemsData, hero] = await Promise.all([
        fetchTimelineItems(),
        fetchTimelineHero(),
      ]);

      setItems(itemsData);

      if (hero) {
        let subtitleText = '';
        if (hero.subtitle && Array.isArray(hero.subtitle)) {
          hero.subtitle.forEach((block: any) => {
            if (block.children) {
              block.children.forEach((child: any) => {
                if (child.text) subtitleText += child.text + ' ';
              });
            }
          });
          subtitleText = subtitleText.trim();
        } else if (typeof hero.subtitle === 'string') {
          subtitleText = hero.subtitle;
        }

        setHeroData({
          titleLine1: hero.titleLine1 || '',
          titleLine2: hero.titleLine2 || '',
          titleLine3: hero.titleLine3 || '',
          titleLine4: hero.titleLine4 || '',
          smallTitle: hero.smallTitle || '', // 👈 new
          subtitle: subtitleText,
          buttontext: hero.buttontext || '',
          buttonlink: hero.buttonlink || '',
          backgroundImage: (hero.backgroundimage && hero.backgroundimage.length > 0)
            ? hero.backgroundimage[0]
            : null,
          logoImage: (hero.logoimage && hero.logoimage.length > 0) ? hero.logoimage[0] : null,
        });
      } else {
        setHeroData({
          titleLine1: 'Our Journey',
          titleLine2: 'Through the Years',
          smallTitle: 'Our History',
          subtitle: 'Explore the key milestones',
          buttontext: 'Learn More',
          buttonlink: '#timeline-content',
          backgroundImage: null,
        });
      }

      setLoading(false);
    };
    loadData();
  }, []);

  const grouped = items.reduce((acc: any, item) => {
    const attrs = item.attributes || item;
    const year = new Date(attrs.date).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  const groupedItems = Object.keys(grouped)
    .map(year => ({
      year: parseInt(year),
      events: grouped[year],
    }))
    .sort((a, b) => a.year - b.year);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    };

    groupedItems.forEach((_, index) => {
      const el = sectionRefs.current[index];
      if (!el) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(index);
          }
        });
      }, options);
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [groupedItems]);

  const scrollToYear = (index: number) => {
    const el = sectionRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <p className="text-neutral-500">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-white to-gray-100 font-['Exo_2',sans-serif] overflow-x-hidden">
      <Hero data={heroData} />

      {/* Right Side Navigation */}
      <div className="fixed right-0 top-0 z-50 h-screen flex items-center group">
        <div className="w-8 h-32 bg-white/90 backdrop-blur-sm border-l border-gray-200 shadow-md rounded-l-lg flex items-center justify-center cursor-pointer group-hover:bg-sky-50 transition-colors">
          <span className="text-neutral-400 text-xs font-medium tracking-wider writing-mode-vertical-rl select-none group-hover:text-sky-600 transition-colors">
            YEARS
          </span>
        </div>
        <nav className="absolute right-0 top-0 h-screen w-24 md:w-32 lg:w-40 bg-white/95 backdrop-blur-sm border-l border-gray-200 shadow-xl flex flex-col justify-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
          <ul className="space-y-3 md:space-y-4">
            {groupedItems.map((group, idx) => (
              <li
                key={group.year}
                onClick={() => scrollToYear(idx)}
                className={`text-xs md:text-sm lg:text-base font-medium tracking-wider cursor-pointer transition-all duration-300 border-b border-dotted border-neutral-300/50 pb-1 ${
                  idx === activeIndex
                    ? 'text-sky-600 font-bold scale-110 border-transparent'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
                style={{ transition: 'all 0.3s ease-out' }}
              >
                {group.year}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
        <div className="flex space-x-6 text-sm">
          {groupedItems.map((group, idx) => (
            <button
              key={group.year}
              onClick={() => scrollToYear(idx)}
              className={`whitespace-nowrap ${
                idx === activeIndex ? 'text-sky-600 font-semibold' : 'text-gray-500'
              }`}
            >
              {group.year}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div id="timeline-content" className="pt-4 md:pt-0 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
          {groupedItems.map((group, idx) => {
            const { year, events } = group;
            return (
              <section
                key={year}
                ref={(el: HTMLDivElement | null) => { sectionRefs.current[idx] = el; }}
                className="scroll-mt-20 mb-20 md:mb-28 last:mb-0"
                style={{ scrollMarginTop: '80px' }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
                  {year}
                </h2>
                <div className="space-y-12">
                  {events.map((event: any, evtIdx: number) => {
                    const e = event.attributes || event;
                    const title = e.title || '';
                    const description = e.description || e.desc || '';
                    const image = e.image ? getStrapiImage(e.image, '') : null;
                    return (
                      <div key={evtIdx} className="flex flex-col md:flex-row gap-6 md:gap-10">
                        {image && (
                          <div className="md:w-2/5 flex-shrink-0">
                            <img
                              src={image}
                              alt={title || `Event in ${year}`}
                              className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
                            />
                          </div>
                        )}
                        <div className={image ? 'md:w-3/5' : 'w-full'}>
                          {title && (
                            <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                              {title}
                            </h3>
                          )}
                          <div className="text-gray-600 text-base md:text-lg leading-relaxed prose prose-gray max-w-none">
                            {description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-16 z-50 p-3 bg-sky-600/90 hover:bg-sky-500 rounded-full shadow-lg text-white transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}