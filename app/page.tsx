"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Hero from '@/components/Hero';
import IPhoneMockup from '@/components/iPhoneMockup';
import { getStrapiImage } from '@/lib/strapi';

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
    viewAll: "View All Disclosures →",
    readMore: "Read Report →",
    exploreMore: "Explore More →",
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
    viewAll: "عرض جميع الإفصاحات ←",
    readMore: "اقرأ التقرير ←",
    exploreMore: "اكتشف المزيد ←",
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

async function fetchHomeHero(locale: string = 'en') {
  try {
    const url = `http://localhost:1337/api/home-heroes?populate=*&locale=${locale}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Hero fetch failed with status:', res.status);
      return null;
    }
    const json = await res.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0];
    }
    if (json.data?.attributes) {
      return json.data;
    }
    return null;
  } catch (error) {
    console.error('Hero fetch error:', error);
    return null;
  }
}

// ===== HELPER: Extract plain text from Strapi rich-text object =====
function getPlainText(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      })
      .join(' ');
  }
  if (content.children && Array.isArray(content.children)) {
    return content.children.map((child: any) => child.text || '').join('');
  }
  return String(content);
}

// ===== CSS ANIMATION (inline for simplicity) =====
const phoneAnimationStyle = `
  @keyframes floatPhone {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-14px) rotate(1deg); }
  }
  @keyframes phoneGlow {
    0%, 100% { transform: scale(1); opacity: 0.35; }
    50% { transform: scale(1.08); opacity: 0.55; }
  }
  .float-phone {
    animation: floatPhone 5s ease-in-out infinite;
  }
  .phone-glow {
    animation: phoneGlow 5s ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .float-phone,
    .phone-glow {
      animation: none !important;
    }
  }
`;

// ===== MAIN PAGE =====
export default function HomePage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const playerRef = useRef<any>(null);
  
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  const appShowcaseRef = useRef<HTMLDivElement>(null);
  const [showAppShowcase, setShowAppShowcase] = useState(false);
  const [phoneTilt, setPhoneTilt] = useState({ x: 0, y: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  const [metrics, setMetrics] = useState<any[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [globalScaleContent, setGlobalScaleContent] = useState<any>(null);
  
  const [heroData, setHeroData] = useState<any>(null);
  // App showcase fields (raw from Strapi)
  const [appImage, setAppImage] = useState<any>(null);
  const [appLogo, setAppLogo] = useState<any>(null);
  const [appTitle, setAppTitle] = useState<any>(null);
  const [appDescription, setAppDescription] = useState<any>(null);
  // Download buttons
  const [appStoreIcon, setAppStoreIcon] = useState<any>(null);
  const [appStoreUrl, setAppStoreUrl] = useState<string>('');
  const [googlePlayIcon, setGooglePlayIcon] = useState<any>(null);
  const [googlePlayUrl, setGooglePlayUrl] = useState<string>('');

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
      
      const hero = await fetchHomeHero(currentLocale);
      setHeroData(hero);
      
      const attrs = hero?.attributes || hero || {};
      setAppImage(attrs.appImage || null);
      setAppLogo(attrs.appLogo || null);
      setAppTitle(attrs.appTitle || null);
      setAppDescription(attrs.appDescription || null);
      setAppStoreIcon(attrs.appStoreIcon || null);
      setAppStoreUrl(attrs.appStoreUrl || '');
      setGooglePlayIcon(attrs.googlePlayIcon || null);
      setGooglePlayUrl(attrs.googlePlayUrl || '');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // YouTube player init (unchanged)
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

  // Intersection observers (unchanged)
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
    if (!appShowcaseRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowAppShowcase(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(appShowcaseRef.current);
    return () => observer.disconnect();
  }, [appImage]);

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

  const handlePhoneMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setPhoneTilt({
      x: (0.5 - py) * 14,
      y: (px - 0.5) * 14,
    });
  };

  const handlePhoneMouseLeave = () => setPhoneTilt({ x: 0, y: 0 });

  // Prepare image URLs and plain text
  const appImageUrl = appImage ? getStrapiImage(appImage, '') : null;
  const appLogoUrl = appLogo ? getStrapiImage(appLogo, '') : null;
  const plainTitle = getPlainText(appTitle);
  const plainDescription = getPlainText(appDescription);

  // Limit press releases to latest 3
  const latestPress = pressReleases.slice(0, 3);

  // 🔥 Page title: "Home | CI Capital" or "الرئيسية | سي آي كابيتال"
  const pageTitle = locale === 'ar' ? 'الرئيسية | سي آي كابيتال' : 'Home | CI Capital';

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={locale === 'ar' ? 'سي آي كابيتال – مجموعة خدمات مالية متنوعة رائدة في مصر' : 'CI Capital – premier diversified financial services group in Egypt'} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:type" content="website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main dir={t.dir} className="min-h-screen bg-white text-neutral-950 tracking-tight transition-all duration-300">

        {/* Inject animation style */}
        <style>{phoneAnimationStyle}</style>

        <Hero data={heroData} />

        {/* ─── App Showcase Section ────────────────────────────── */}
        {appImageUrl && (
          <section className="relative w-full bg-gradient-to-b from-white via-sky-50 to-white py-16 md:py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div ref={appShowcaseRef} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div
                  className={`lg:w-1/2 text-left transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                    showAppShowcase ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  {/* App Logo – left-aligned */}
                  {appLogoUrl && (
                    <div className="flex justify-start mb-4">
                      <img
                        src={appLogoUrl}
                        alt="App logo"
                        className="h-32 md:h-56 w-auto"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Title – bigger, left aligned */}
                  {plainTitle && (
                    <h2 className="text-4xl md:text-6xl font-light text-neutral-950 tracking-tight leading-tight">
                      {plainTitle}
                    </h2>
                  )}

                  {/* Description – bigger, left aligned, no max-width */}
                  {plainDescription && (
                    <p className="text-xl md:text-2xl text-neutral-600 mt-6">
                      {plainDescription}
                    </p>
                  )}

                  {/* Download Buttons */}
                  <div className="flex flex-wrap gap-4 mt-8 justify-start">
                    {/* App Store */}
                    {appStoreUrl && (
                      <a
                        href={appStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block hover:opacity-80 transition-opacity"
                        aria-label="Download on the App Store"
                      >
                        <div className="flex items-center bg-black text-white rounded-md px-3 py-1 h-10 min-w-[120px]">
                          {appStoreIcon ? (
                            <img
                              src={getStrapiImage(appStoreIcon, '')}
                              alt=""
                              className="h-6 w-auto mr-2"
                              loading="lazy"
                            />
                          ) : (
                            <svg className="h-6 w-auto mr-2" viewBox="0 0 24 24" fill="white">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                          )}
                          <div className="flex flex-col leading-tight">
                            <span className="text-[8px] font-medium">Download on the</span>
                            <span className="text-[13px] font-bold">App Store</span>
                          </div>
                        </div>
                      </a>
                    )}

                    {/* Google Play */}
                    {googlePlayUrl && (
                      <a
                        href={googlePlayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block hover:opacity-80 transition-opacity"
                        aria-label="Get it on Google Play"
                      >
                        <div className="flex items-center bg-black text-white rounded-md px-3 py-1 h-10 min-w-[120px]">
                          {googlePlayIcon ? (
                            <img
                              src={getStrapiImage(googlePlayIcon, '')}
                              alt=""
                              className="h-6 w-auto mr-2"
                              loading="lazy"
                            />
                          ) : (
                            <svg className="h-6 w-auto mr-2" viewBox="0 0 24 24" fill="white">
                              <path d="M3.5 2.5L13.5 12l-10 9.5V2.5zM14 12l9-5.5v11L14 12z" />
                            </svg>
                          )}
                          <div className="flex flex-col leading-tight">
                            <span className="text-[8px] font-medium">Get it on</span>
                            <span className="text-[13px] font-bold">Google Play</span>
                          </div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>

                {/* ─── Phone Animation ─── */}
                <div
                  className="lg:w-1/2 flex justify-center motion-reduce:!opacity-100 motion-reduce:!transform-none"
                  style={{
                    opacity: showAppShowcase ? 1 : 0,
                    transform: showAppShowcase
                      ? 'translateX(0px) translateY(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)'
                      : 'translateX(-40px) translateY(60px) rotateX(70deg) rotateY(0deg) rotateZ(-10deg) scale(0.8)',
                    transformOrigin: 'center bottom',
                    transition: 'transform 1800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1400ms ease-out',
                    transitionDelay: showAppShowcase ? '150ms' : '0ms',
                  }}
                >
                  <div
                    className="relative inline-block [perspective:1200px]"
                    onMouseMove={handlePhoneMouseMove}
                    onMouseLeave={handlePhoneMouseLeave}
                  >
                    {/* Ambient breathing glow */}
                    <div
                      className="phone-glow absolute inset-0 -z-10 bg-sky-400/40 blur-3xl rounded-[3rem]"
                      aria-hidden="true"
                    />
                    <div className="float-phone">
                      <div
                        className="transition-transform duration-300 ease-out will-change-transform motion-reduce:transition-none"
                        style={{ transform: `rotateX(${phoneTilt.x}deg) rotateY(${phoneTilt.y}deg)` }}
                      >
                        <IPhoneMockup imageUrl={appImageUrl} alt="CI Capital App" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

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
              {/* View All Disclosures → /media-relations/media-releases */}
              <Link
                href="/media-relations/media-releases"
                className="text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline cursor-pointer transition-colors duration-200"
              >
                {t.viewAll}
              </Link>
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
              ) : latestPress.length > 0 ? (
                latestPress.map((press: any) => {
                  const attrs = press.attributes || press;
                  const imageSrc = getStrapiImage(attrs.image, "/CICapitalLogo-Ar.png");
                  const slug = attrs.slug;
                  return (
                    <Link key={press.id} href={`/press-releases/${slug}`}>
                      <article className="bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden hover:shadow-md hover:border-sky-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer">
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
                                {attrs.category}
                              </span>
                              <span className="text-xs text-neutral-400 font-normal">{attrs.date}</span>
                            </div>
                            <h3 className="text-lg font-light text-neutral-950 leading-snug uppercase tracking-tight line-clamp-3 hover:text-neutral-700 transition-colors">
                              {attrs.title}
                            </h3>
                          </div>
                          <div className="pt-4 border-t border-sky-50">
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                              {t.readMore}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
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
    </>
  );
}