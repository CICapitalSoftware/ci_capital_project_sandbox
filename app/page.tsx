"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';

// ===== TRANSLATIONS =====
const TRANSLATIONS = {
  en: {
    dir: "ltr",
    langBtn: "العربية",
    navOurFirm: "Our Firm",
    navBizLines: "Solutions",
    navInvestorRel: "Investor Relations",
    navMediaRel: "Media Relations",
    navCareers: "Careers",
    navContact: "Contact Us",
    searchPlaceholder: "Search client gateway, indices, disclosures...",
    
    globalScaleHeading: "Global scale, scope and strength",
    globalScaleSub: "Data as of Q1 2026",
    emptyGlobalScaleHeading: "Global Presence",
    emptyGlobalScaleSub: "Statistical data is currently being audited and updated.",
    
    pause: "Pause",
    play: "Play",
    bizTag: "CORE SEGMENTS",
    bizHeading: "Solutions",
    mediaTag: "CORPORATE DISCLOSURES",
    mediaHeading: "Stay Informed",
    viewAll: "View All Disclosures \u2192",
    readMore: "Read Report \u2192",
    exploreMore: "Explore More \u2192",
    
    emptyNewsHeading: "No News Available",
    emptyNewsSub: "Check back later for the latest corporate disclosures and updates.",
    emptySolutionsHeading: "No Solutions Available",
    emptySolutionsSub: "Check back later for our latest business lines and offerings.",
    
    footerAbout: "CI Capital is a premier diversified financial services group in Egypt, offering institutional investment banking, asset management, and non-banking credit solutions.",
    footerLegal: "© 2026 CI Capital. All rights reserved.",
    footerPrivacy: "Privacy Policy",
    footerTerms: "Terms of Use",
    footerNewsletter: "Subscribe to our newsletter",
    footerEmailPlaceholder: "Enter your email",
    footerSubscribe: "Subscribe",
    backToTop: "Back to top",
  },
  ar: {
    dir: "rtl",
    langBtn: "English",
    navOurFirm: "مؤسستنا",
    navBizLines: "حلولنا",
    navInvestorRel: "علاقات المستثمرين",
    navMediaRel: "العلاقات الإعلامية",
    navCareers: "الوظائف",
    navContact: "اتصل بنا",
    searchPlaceholder: "البحث في الإفصاحات والبوابات...",
    
    globalScaleHeading: "النطاق العالمي والنطاق والقوة",
    globalScaleSub: "البيانات حتى الربع الأول ٢٠٢٦",
    emptyGlobalScaleHeading: "التواجد العالمي",
    emptyGlobalScaleSub: "يتم حالياً مراجعة وتحديث البيانات الإحصائية.",
    
    pause: "إيقاف مؤقت",
    play: "تشغيل",
    bizTag: "القطاعات الأساسية",
    bizHeading: "حلولنا",
    mediaTag: "الإفصاحات والمركز الإعلامي",
    mediaHeading: "ابق على اطلاع",
    viewAll: "عرض جميع الإفصاحات \u2190",
    readMore: "اقرأ التقرير \u2190",
    exploreMore: "اكتشف المزيد \u2190",
    
    emptyNewsHeading: "لا توجد أخبار متاحة",
    emptyNewsSub: "يرجى التحقق لاحقاً للحصول على أحدث الإفصاحات والتحديثات.",
    emptySolutionsHeading: "لا توجد حلول متاحة",
    emptySolutionsSub: "يرجى التحقق لاحقاً لمعرفة أحدث قطاعات الأعمال والخدمات.",
    
    footerAbout: "سي آي كابيتال هي مجموعة خدمات مالية متنوعة رائدة في مصر، تقدم الخدمات المصرفية الاستثمارية المؤسسية وإدارة الأصول وحلول الائتمان غير المصرفية.",
    footerLegal: "© ٢٠٢٦ سي آي كابيتال. جميع الحقوق محفوظة.",
    footerPrivacy: "سياسة الخصوصية",
    footerTerms: "شروط الاستخدام",
    footerNewsletter: "اشترك في نشرتنا الإخبارية",
    footerEmailPlaceholder: "أدخل بريدك الإلكتروني",
    footerSubscribe: "اشترك",
    backToTop: "عد إلى الأعلى",
  }
};

// ===== STRAPI HELPERS =====
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

// ✅ Updated: handles array response and returns first item (or null)
async function fetchHomeHero(locale: string = 'en') {
  try {
    const url = `http://localhost:1337/api/home-heroes?populate=*`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Hero fetch failed with status:', res.status);
      return null;
    }
    const json = await res.json();
    // If it's an array, take the first item
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0];
    }
    // If it's a single type (object with attributes)
    if (json.data?.attributes) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error('Hero fetch error:', error);
    return null;
  }
}

const getStrapiImage = (imageObj: any, fallback: string) => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj; 
  if (imageObj.url) return `http://localhost:1337${imageObj.url}`;
  if (Array.isArray(imageObj) && imageObj[0]?.url) return `http://localhost:1337${imageObj[0].url}`;
  return fallback;
};

// ===== SPINNING METRIC CARD =====
interface SpinningCardProps {
  label: string;
  value: string;
  subText: string;
  trend: string;
  index: number;
}

function SpinningMetricCard({ label, value, subText, trend, index }: SpinningCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div 
      className="group w-full h-[150px] relative select-none cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      aria-label={`${label} - click to flip`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
    >
      <div 
        className="w-full h-full relative transition-transform duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-white border border-sky-200 p-6 flex flex-col justify-between shadow-sm"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider text-sky-700 font-bold uppercase leading-none">{label}</span>
            <span className="text-[9px] border border-sky-300 text-sky-700 px-1 rounded-none leading-none">0{index + 1}</span>
          </div>
          <span className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight leading-none">{value}</span>
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium tracking-wide leading-none">
            <span>TOUCH CARD TO DISCLOSE</span>
            <span className="animate-pulse text-sky-600">✦</span>
          </div>
        </div>
        <div 
          className="absolute inset-0 w-full h-full bg-sky-50 border border-sky-200 p-6 flex flex-col justify-between shadow-sm"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider text-sky-700 font-bold uppercase leading-none">SECURE LEDGER</span>
            <span className="text-[9px] bg-sky-600 text-white px-1 leading-none">AUDITED</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xl font-normal text-neutral-950 leading-tight">{subText}</span>
            <span className="text-xs font-semibold text-sky-700 tracking-wide">{trend}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium leading-none">
            <span>TOUCH CARD TO FLIP BACK</span>
            <span>↺</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN PAGE =====
export default function HomePage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const playerRef = useRef<any>(null);
  
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  const [metrics, setMetrics] = useState<any[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [globalScaleContent, setGlobalScaleContent] = useState<any>(null);
  
  const [heroData, setHeroData] = useState<any>(null);

  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('services');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const t = TRANSLATIONS[locale];

  const loadData = async (currentLocale: string) => {
    try {
      setIsLoading(true);
      setFetchError(false);
      
      // 👇 Hero fetch – no hardcoded fallback
      const hero = await fetchHomeHero(currentLocale);
      setHeroData(hero);

      const [
        fetchedMetrics, 
        fetchedPress, 
        fetchedBizLines, 
        fetchedGlobalScale,
      ] = await Promise.all([
        fetchFromStrapi("metrics", currentLocale),
        fetchFromStrapi("press-releases", currentLocale),
        fetchFromStrapi("business-lines", currentLocale),
        fetchFromStrapi("global-scales", currentLocale),
      ]);
      
      setMetrics(fetchedMetrics);
      setPressReleases(fetchedPress);
      setBusinessLines(fetchedBizLines);
      setGlobalScaleContent(Array.isArray(fetchedGlobalScale) ? fetchedGlobalScale[0] : fetchedGlobalScale);
      
    } catch (error) {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(locale);
  }, []);

  const globalScaleData = globalScaleContent?.attributes || globalScaleContent || {};
  const activeStats = globalScaleData.stats || [];

  useEffect(() => {
    if (isPaused || activeStats.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % activeStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, activeStats.length]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      playerRef.current = new (window as any).YT.Player('cairo-youtube-iframe', {
        videoId: 'bTKF7LAFSD4',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
            setIsVideoPlaying(true);
          },
          onStateChange: (event: any) => {
            if (event.data === 0) event.target.playVideo();
            if (event.data === 1) setIsVideoPlaying(true);
            else if (event.data === 2) setIsVideoPlaying(false);
          }
        }
      });
    };

    const pollInterval = setInterval(() => {
      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
        clearInterval(pollInterval);
      }
    }, 100);

    return () => {
      clearInterval(pollInterval);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowContent(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    if (contentSectionRef.current) {
      observer.observe(contentSectionRef.current);
    }
    return () => {
      if (contentSectionRef.current) {
        observer.unobserve(contentSectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const sections = ['services', 'media'];
    const observers: IntersectionObserver[] = [];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        sectionRefs.current[id] = el;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          { threshold: 0.4, rootMargin: '-20% 0px -20% 0px' }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });
    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main dir={t.dir} className="min-h-screen bg-white text-neutral-950 tracking-tight transition-all duration-300">

      {/* ===== HERO (replaces About Us) ===== */}
      <Hero data={heroData} />

      {fetchError && (
        <div className="bg-red-600 text-white p-3 text-center text-xs font-bold uppercase sticky top-0 z-[60]">
          Connection issue: Showing cached or unavailable content.
        </div>
      )}

      {/* GLOBAL SCALE */}
      <section id="firm" className="relative w-full bg-sky-600 py-10 border-b border-sky-700 scroll-mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-tight">
              {globalScaleData.heading ?? t.globalScaleHeading}
            </h2>
            <p className="text-sm text-white/70 font-light mt-2 tracking-wider uppercase">
              {globalScaleData.sub ?? t.globalScaleSub}
            </p>
            <div className="w-16 h-0.5 bg-white/30 mx-auto mt-4"></div>
          </div>
        </div>
        <div className="stats-marquee-wrapper bg-sky-600 min-h-[120px] flex items-center justify-center">
          {isLoading ? (
            <div className="text-white/60 animate-pulse text-sm uppercase tracking-widest font-semibold">Loading data...</div>
          ) : activeStats.length === 0 ? (
            <div className="text-white/80 text-sm text-center">
               <span className="font-semibold">{t.emptyGlobalScaleHeading}</span> <br/> 
               <span className="opacity-75">{t.emptyGlobalScaleSub}</span>
            </div>
          ) : (
            <>
              <div 
                className={`stats-marquee-track ${isPaused ? 'paused' : ''}`}
                ref={marqueeRef}
              >
                {[...activeStats, ...activeStats, ...activeStats].map((stat: any, idx: number) => (
                  <div key={idx} className="stat-item" title={`${stat.value} - ${stat.label}`}>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-sub">{stat.sub}</div>
                  </div>
                ))}
              </div>
              <div className="stats-controls">
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  aria-label={isPaused ? t.play : t.pause}
                  className="text-white hover:text-white/80 transition-colors"
                >
                  {isPaused ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                    </svg>
                  )}
                </button>
                <span className="duration-indicator">
                  {currentStatIndex + 1}
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      {/* SOLUTIONS & MEDIA */}
      <div 
        ref={contentSectionRef}
        className={`max-w-7xl mx-auto px-6 py-24 flex flex-col gap-24 md:gap-32 transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* SOLUTIONS */}
        <section id="services" className="w-full overflow-hidden scroll-mt-0">
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">{t.bizTag}</span>
            <h2 className="text-[44px] md:text-[60px] leading-[48px] md:leading-[60px] font-light text-neutral-950 uppercase tracking-tight mt-1">
              {t.bizHeading}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={`loading-${i}`} className="bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden opacity-50 pointer-events-none">
                  <div className="h-56 w-full bg-sky-50 flex items-center justify-center p-4 animate-pulse"></div>
                  <div className="h-[2px] w-full bg-sky-200"></div>
                  <div className="p-6 py-8 flex-1 flex flex-col justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-6 bg-sky-100 w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-sky-100 w-full animate-pulse"></div>
                      <div className="h-4 bg-sky-100 w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : businessLines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessLines.slice(0, 10).map((subSection: any) => {
                const imageSrc = getStrapiImage(subSection.image, "/CICapitalLogo-Ar.png");
                let linkUrl = subSection.link || `/solutions/${subSection.slug}`;
                const isExternal = linkUrl.startsWith('http://') || linkUrl.startsWith('https://');
                return (
                  <div 
                    key={subSection.id} 
                    className="solution-card bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden hover:shadow-lg hover:border-sky-300 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="h-56 w-full bg-sky-50 relative overflow-hidden">
                      <img 
                        src={imageSrc}
                        alt={subSection.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = "/CICapitalLogo-Ar.png"; }}
                      />
                    </div>
                    <div className="h-[2px] w-full bg-sky-600"></div>
                    <div className="p-6 py-8 flex-1 flex flex-col gap-3 card-content">
                      <h3 className="card-title text-xl md:text-2xl font-light text-neutral-950 uppercase tracking-tight line-clamp-2 transition-colors duration-300">
                        {subSection.title}
                      </h3>
                      <p className="text-neutral-700 text-base md:text-lg leading-relaxed font-normal line-clamp-3 mb-2">
                        {subSection.desc || subSection.description}
                      </p>
                      {isExternal ? (
                        <a
                          href={linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 transition-all duration-200 inline-flex items-center gap-1 hover:gap-2"
                        >
                          {t.exploreMore}
                        </a>
                      ) : (
                        <Link href={linkUrl}>
                          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 cursor-pointer transition-all duration-200 inline-flex items-center gap-1 hover:gap-2">
                            {t.exploreMore}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white border border-sky-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-sky-200 mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h3 className="text-2xl font-light text-neutral-900 uppercase tracking-tight mb-2">{t.emptySolutionsHeading}</h3>
              <p className="text-neutral-500 font-light">{t.emptySolutionsSub}</p>
            </div>
          )}
        </section>

        {/* MEDIA */}
        <section id="media" className="scroll-mt-0">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">{t.mediaTag}</span>
              <h2 className="text-[44px] md:text-[60px] leading-[48px] md:leading-[60px] font-light text-neutral-950 uppercase tracking-tight mt-1">
                {t.mediaHeading}
              </h2>
            </div>
            <button className="text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline cursor-pointer transition-colors duration-200">
              {t.viewAll}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              [0, 1, 2].map((i) => (
                <article key={`loading-${i}`} className="bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden opacity-50 pointer-events-none">
                  <div className="h-56 w-full bg-sky-50 flex items-center justify-center p-6 border-b border-sky-50 animate-pulse"></div>
                  <div className="p-8 py-12 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-sky-100 w-1/3 animate-pulse"></div>
                      <div className="h-6 bg-sky-100 w-full animate-pulse"></div>
                      <div className="h-6 bg-sky-100 w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </article>
              ))
            ) : pressReleases.length > 0 ? (
              pressReleases.map((press: any) => {
                const imageSrc = getStrapiImage(press.image, "/CICapitalLogo-Ar.png");
                return (
                  <article key={press.id} className="bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden hover:shadow-md hover:border-sky-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="h-56 w-full bg-white flex items-center justify-center p-6 border-b border-sky-50 select-none">
                      <img 
                        src={imageSrc}
                        alt="Corporate Document Asset" 
                        className="max-w-full max-h-full object-contain opacity-90 transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = "/CICapitalLogo-Ar.png"; }}
                      />
                    </div>
                    <div className="p-8 py-12 flex-1 flex flex-col justify-between gap-6">
                      <div>
                        <div className="flex justify-between items-center gap-3 mb-4">
                          <span className="text-[10px] font-bold tracking-wider uppercase bg-sky-50 text-sky-700 px-2 py-0.5 rounded-none">
                            {press.category}
                          </span>
                          <span className="text-xs text-neutral-400 font-normal">{press.date}</span>
                        </div>
                        <h3 className="text-lg font-light text-neutral-950 leading-snug uppercase tracking-tight line-clamp-3 hover:text-neutral-700 transition-colors">
                          {press.title}
                        </h3>
                      </div>
                      <div className="pt-4 border-t border-sky-50">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 inline-flex items-center gap-1 group cursor-pointer hover:gap-2 transition-all duration-200">
                          {t.readMore}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="col-span-1 md:col-span-3 bg-white border border-sky-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-sky-200 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="text-2xl font-light text-neutral-900 uppercase tracking-tight mb-2">{t.emptyNewsHeading}</h3>
                <p className="text-neutral-500 font-light">{t.emptyNewsSub}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* BACK TO TOP */}
      <button 
        onClick={scrollToTop}
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label={t.backToTop}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
        </svg>
      </button>

    </main>
  );
}