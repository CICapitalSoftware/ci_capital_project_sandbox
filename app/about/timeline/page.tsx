// app/about/timeline/page.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getStrapiImage } from '@/lib/strapi';
import Hero from '@/components/Hero';
import { motion } from 'framer-motion';

// ─── Fetch helpers ──────────────────────────────────────────────────
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

// ─── New: fetch eras from Strapi ──────────────────────────────────
async function fetchTimelineEras() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/timeline-eras?populate=*&sort=startYear:asc`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const LIGHTER_BLUE = '#0ea5e9';

// ─── Main Page ──────────────────────────────────────────────────
export default function TimelinePage() {
  const [items, setItems] = useState<any[]>([]);
  const [eras, setEras] = useState<any[]>([]);
  const [heroData, setHeroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeEraIndex, setActiveEraIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const heroRef = useRef<HTMLElement | null>(null);
  const eraRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const [itemsData, hero, erasData] = await Promise.all([
        fetchTimelineItems(),
        fetchTimelineHero(),
        fetchTimelineEras(),
      ]);

      setItems(itemsData);
      setEras(erasData);

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
          smallTitle: hero.smallTitle || '',
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

  // ─── Build era items from fetched eras and events ──────────────
  const eraItems = eras.map((era) => {
    const attrs = era.attributes || era;
    const startYear = attrs.startYear;
    const endYear = attrs.endYear;
    const events = items.filter((item) => {
      const itemAttrs = item.attributes || item;
      const year = new Date(itemAttrs.date).getFullYear();
      return year >= startYear && year <= endYear;
    });
    // Use the first event's image as the era image
    const firstEvent = events[0];
    const eraImage = firstEvent ? (firstEvent.attributes || firstEvent).image : null;
    return {
      id: era.id,
      label: attrs.label || 'Untitled Era',
      years: `${startYear}–${endYear}`,
      startYear,
      endYear,
      events,
      eraImage,
    };
  }).filter(era => era.events.length > 0);

  // ─── Hero visibility ──────────────────────────────────────────────
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [heroData]);

  // ─── Active era via Intersection Observer ──────────────────────
  useEffect(() => {
    if (eraItems.length === 0) return;

    const options = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find(entry => entry.isIntersecting);
      if (visible) {
        const index = eraRefs.current.indexOf(visible.target as HTMLDivElement);
        if (index !== -1 && index !== activeEraIndex) {
          setActiveEraIndex(index);
        }
      }
    }, options);

    eraRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [eraItems, activeEraIndex]);

  const scrollToEra = useCallback((index: number) => {
    const el = eraRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-blue-600 text-lg font-light animate-pulse">Loading...</div>
      </div>
    );
  }

  if (eraItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-gray-500 text-lg font-light">
          No timeline eras found. Add some in Strapi.
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-white overflow-x-hidden">
      <div ref={heroRef as any}>
        <Hero data={heroData as any} compact={true} />
      </div>

      {/* ─── Left Navigation ────────────────────────────────────────── */}
      <div className="fixed left-0 top-0 z-50 h-screen w-24 md:w-32 lg:w-40 flex items-center pointer-events-none">
        <div className="w-full px-3 md:px-6 pointer-events-auto">
          <ul className="space-y-3 md:space-y-4">
            {eraItems.map((era, idx) => {
              const isActive = idx === activeEraIndex;
              return (
                <motion.li
                  key={era.id}
                  onClick={() => scrollToEra(idx)}
                  className={`text-xs md:text-sm lg:text-base font-medium tracking-wider cursor-pointer transition-all duration-300 border-b border-dotted pb-1 ${
                    isActive
                      ? 'font-bold scale-110 border-transparent'
                      : 'hover:text-gray-800'
                  } ${
                    isHeroVisible
                      ? 'text-white border-white/30 hover:text-white'
                      : 'text-gray-500 border-gray-200'
                  }`}
                  style={{ color: isActive && !isHeroVisible ? LIGHTER_BLUE : undefined }}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    {isActive && (
                      <span
                        className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                        style={{ background: isHeroVisible ? 'white' : LIGHTER_BLUE }}
                      />
                    )}
                    {era.label}
                  </div>
                  <div className="text-[8px] md:text-[10px] font-normal opacity-70">
                    {era.years}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ─── Full‑page scroll sections ────────────────────────────── */}
      <div
        ref={containerRef}
        className="ml-24 md:ml-32 lg:ml-40 snap-y snap-mandatory h-screen overflow-y-scroll"
        style={{ scrollSnapType: 'y mandatory' }}
        id="timeline-content"
      >
        {eraItems.map((era, idx) => {
          const { events, eraImage } = era;
          const imageUrl = eraImage ? getStrapiImage(eraImage, '') : null;
          const isEven = idx % 2 === 0;

          return (
            <section
              key={era.id}
              ref={(el: HTMLDivElement | null) => { eraRefs.current[idx] = el; }}
              className="h-screen w-full snap-start flex items-center justify-center px-6 md:px-12 py-8 bg-gradient-to-b from-white via-gray-50 to-white"
            >
              <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div className={`order-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="flex flex-col space-y-6">
                    <div>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 tracking-tight leading-tight">
                        {era.label}
                      </h2>
                      <p className="text-base md:text-lg text-gray-400 font-light tracking-widest uppercase mt-3">
                        {era.years}
                      </p>
                    </div>
                    <div className="w-16 h-0.5" style={{ background: LIGHTER_BLUE }} />
                    <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4">
                      {events.map((event: any, evtIdx: number) => {
                        const e = event.attributes || event;
                        const title = e.title || '';
                        const description = e.description || e.desc || '';
                        const year = new Date(e.date).getFullYear();
                        return (
                          <div key={evtIdx} className="group border-l-4 border-gray-200 pl-5 hover:border-sky-400 transition-colors">
                            <span className="text-xl font-bold" style={{ color: LIGHTER_BLUE }}>{year}</span>
                            {title && <h3 className="text-xl md:text-2xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors mt-1">{title}</h3>}
                            {description && <div className="text-gray-600 text-base leading-relaxed prose prose-sm max-w-none mt-1">{description}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className={`order-2 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="relative overflow-hidden shadow-xl aspect-square">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={era.label}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Add image to first event</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-lg text-white transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        style={{ background: LIGHTER_BLUE }}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}