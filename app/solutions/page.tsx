"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

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
    
    whoWeAreTag: "ABOUT US",
    whoWeAreHeading: "Who We Are",
    emptyWhoWeAreHeading: "About Our Firm",
    emptyWhoWeAreSub: "Our company profile is currently being updated. Please check back soon.",
    
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
    
    whoWeAreTag: "معلومات عنا",
    whoWeAreHeading: "من نحن",
    emptyWhoWeAreHeading: "عن مؤسستنا",
    emptyWhoWeAreSub: "يتم حالياً تحديث ملف الشركة. يرجى التحقق مرة أخرى قريباً.",
    
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

// Spinning Metric Card Component
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
            <span className="text-[10px] tracking-wider text-sky-700 font-bold uppercase leading-none">
              {label}
            </span>
            <span className="text-[9px] border border-sky-300 text-sky-700 px-1 rounded-none leading-none">
              0{index + 1}
            </span>
          </div>
          <span className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight leading-none">
            {value}
          </span>
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium tracking-wide leading-none">
            <span>TOUCH CARD TO DISCLOSE</span>
            <span className="animate-pulse text-sky-600">✦</span>
          </div>
        </div>

        <div 
          className="absolute inset-0 w-full h-full bg-sky-50 border border-sky-200 p-6 flex flex-col justify-between shadow-sm"
          style={{ 
            transform: 'rotateY(180deg)', 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden' 
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider text-sky-700 font-bold uppercase leading-none">
              SECURE LEDGER
            </span>
            <span className="text-[9px] bg-sky-600 text-white px-1 leading-none">
              AUDITED
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xl font-normal text-neutral-950 leading-tight">
              {subText}
            </span>
            <span className="text-xs font-semibold text-sky-700 tracking-wide">
              {trend}
            </span>
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

export default function HomePage() {
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const playerRef = useRef<any>(null);
  
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
  
  const [metrics, setMetrics] = useState<any[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [businessLines, setBusinessLines] = useState<any[]>([]);
  const [whoWeAreContent, setWhoWeAreContent] = useState<any>(null);
  const [globalScaleContent, setGlobalScaleContent] = useState<any>(null);
  const [navItems, setNavItems] = useState<any[]>([]);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [currentStatIndex, setCurrentStatIndex] = useState(0);

  const t = TRANSLATIONS[locale];

  const toggleLanguage = async () => {
    const newLocale = locale === 'en' ? 'ar' : 'en';
    setIsLanguageSwitching(true);
    setLocale(newLocale);
    await loadData(newLocale);
    setIsLanguageSwitching(false);
  };

  // Fallback navigation with dropdowns (in case Strapi has no data)
  const getFallbackNav = (locale: string) => {
    if (locale === 'ar') {
      return [
        { id: 1, label: "حلول العملاء", dropdownItems: [{ label: "الخبرة", link: "#" }, { label: "الخدمات المصرفية الاستثمارية العالمية", link: "#" }] },
        { id: 2, label: "رؤى", dropdownItems: [{ label: "جميع الرؤى", link: "#" }, { label: "الذكاء الاصطناعي", link: "#" }] },
        { id: 3, label: "من نحن", dropdownItems: [{ label: "عن الشركة", link: "#" }, { label: "الجوائز", link: "#" }] },
        { id: 4, label: "الوظائف", link: "#" },
        { id: 5, label: "اتصل بنا", link: "#" },
      ];
    }
    return [
      { id: 1, label: "Client Solutions", dropdownItems: [{ label: "Expertise", link: "#" }, { label: "Global Investment Banking", link: "#" }] },
      { id: 2, label: "Insights", dropdownItems: [{ label: "All Insights", link: "#" }, { label: "Artificial Intelligence", link: "#" }] },
      { id: 3, label: "Who We Are", dropdownItems: [{ label: "About Us", link: "#" }, { label: "Awards", link: "#" }] },
      { id: 4, label: "Careers", link: "#" },
      { id: 5, label: "Contact", link: "#" },
    ];
  };

  const loadData = async (currentLocale: string) => {
    try {
      setIsLoading(true);
      setFetchError(false);
      const [
        fetchedMetrics, 
        fetchedPress, 
        fetchedBizLines, 
        fetchedWhoWeAre, 
        fetchedGlobalScale,
        fetchedNav
      ] = await Promise.all([
        fetchFromStrapi("metrics", currentLocale),
        fetchFromStrapi("press-releases", currentLocale),
        fetchFromStrapi("business-lines", currentLocale),
        fetchFromStrapi("who-we-ares", currentLocale),
        fetchFromStrapi("global-scales", currentLocale),
        fetchFromStrapi("navigations", currentLocale),
      ]);
      
      console.log('Fetched navigation:', JSON.stringify(fetchedNav, null, 2));
      
      setMetrics(fetchedMetrics);
      setPressReleases(fetchedPress);
      setBusinessLines(fetchedBizLines);
      setWhoWeAreContent(Array.isArray(fetchedWhoWeAre) ? fetchedWhoWeAre[0] : fetchedWhoWeAre);
      setGlobalScaleContent(Array.isArray(fetchedGlobalScale) ? fetchedGlobalScale[0] : fetchedGlobalScale);
      
      // Process navigation: if Strapi has data with dropdowns, use it; otherwise fallback
      let sortedNav = [];
      if (Array.isArray(fetchedNav) && fetchedNav.length > 0) {
        const hasDropdownItems = fetchedNav.some((item: any) => {
          const attrs = item.attributes || item;
          return attrs.dropdownItems && attrs.dropdownItems.length > 0;
        });
        if (hasDropdownItems) {
          sortedNav = [...fetchedNav].sort((a, b) => (a.order || 0) - (b.order || 0));
        } else {
          sortedNav = getFallbackNav(currentLocale);
        }
      } else {
        sortedNav = getFallbackNav(currentLocale);
      }
      
      setNavItems(sortedNav);
      
    } catch (error) {
      setFetchError(true);
      setNavItems(getFallbackNav(currentLocale));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(locale);
  }, []);

  // Prepare Dynamic Fallback Variables
  const whoWeAreData = whoWeAreContent?.attributes || whoWeAreContent || {};
  const globalScaleData = globalScaleContent?.attributes || globalScaleContent || {};
  const activeStats = globalScaleData.stats || [];

  // Track current stat index for duration indicator
  useEffect(() => {
    if (isPaused || activeStats.length === 0) return;
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % activeStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, activeStats.length]);

  // Header hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // YouTube Iframe Initialization
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
            if (event.data === 0) {
              event.target.playVideo();
            }
            if (event.data === 1) {
              setIsVideoPlaying(true);
            } else if (event.data === 2) {
              setIsVideoPlaying(false);
            }
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
    const sections = ['about', 'services', 'media'];
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
      const headerHeight = 0;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hover handlers
  const handleMouseEnter = (id: number) => {
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <main dir={t.dir} className="min-h-screen bg-white text-neutral-950 tracking-tight transition-all duration-300">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Roboto+Slab:wght@300;400;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        html { scroll-behavior: smooth; }
        * {
          font-family: 'Roboto Slab', 'Merriweather', Georgia, 'Times New Roman', serif !important;
        }
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        h1, h2, h3, h4, h5, h6 {
          font-weight: 300 !important;
          letter-spacing: -0.02em !important;
        }
        p {
          max-width: 70ch;
          line-height: 1.8;
        }
        .text-neutral-500 {
          color: #4b5563 !important;
        }
        *:focus-visible {
          outline: 2px solid #0284c7 !important;
          outline-offset: 2px !important;
        }

        .header-transition {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .header-hidden {
          transform: translateY(-100%);
          opacity: 0;
        }
        .header-visible {
          transform: translateY(0);
          opacity: 1;
        }

        /* RBC-style dropdown menu */
        .nav-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          background: white;
          min-width: 280px;
          padding: 0.75rem 0;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all 0.25s cubic-bezier(0.2, 0.9, 0.3, 1.1);
          z-index: 100;
        }
        .nav-dropdown.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateX(-50%) translateY(0);
        }
        .nav-dropdown a {
          display: block;
          padding: 0.75rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 400;
          font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
          color: #1f2937;
          transition: background 0.15s, color 0.15s;
          text-decoration: none;
          white-space: nowrap;
          letter-spacing: 0.01em;
        }
        .nav-dropdown a:hover {
          background: #f3f4f6;
          color: #0284c7;
        }

        .nav-item {
          position: relative;
          display: inline-block;
        }

        /* Underline animation – now uses the inner span approach, so no need for ::after */

        .back-to-top {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 100;
          background: #0284c7;
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 0.75rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }
        .back-to-top.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }
        .back-to-top:hover {
          background: #0369a1;
          transform: scale(1.05);
        }

        /* Stats Marquee - Sky Blue background matching header */
        .stats-marquee-wrapper {
          overflow: hidden;
          position: relative;
          width: 100%;
          border-top: 1px solid #1a6da8;
          border-bottom: 1px solid #1a6da8;
          padding: 1.5rem 0;
        }
        .stats-marquee-wrapper::before,
        .stats-marquee-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 80px;
          z-index: 5;
          pointer-events: none;
        }
        .stats-marquee-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #0284c7 0%, transparent 100%);
        }
        .stats-marquee-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #0284c7 0%, transparent 100%);
        }
        
        .stats-marquee-track {
          display: flex;
          animation: scrollStats 30s linear infinite;
          width: max-content;
        }
        .stats-marquee-track.paused {
          animation-play-state: paused;
        }
        .stats-marquee-track:hover {
          animation-play-state: paused;
        }
        
        .stat-item {
          flex: 0 0 auto;
          padding: 0 3rem;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,0.15);
          font-family: 'Roboto Slab', 'Merriweather', Georgia, 'Times New Roman', serif !important;
          cursor: default;
        }
        .stat-item:last-child {
          border-right: none;
        }
        .stat-item .stat-value {
          font-size: 2.75rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .stat-item .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255,255,255,0.9);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 0.25rem;
        }
        .stat-item .stat-sub {
          font-size: 0.8rem;
          font-weight: 400;
          color: rgba(255,255,255,0.6);
          margin-top: 0.1rem;
        }
        
        .stats-controls {
          position: absolute;
          right: 1.5rem;
          bottom: 1rem;
          top: auto;
          transform: none;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.15);
          padding: 0.35rem 0.75rem 0.35rem 0.5rem;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
        }
        .stats-controls button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 9999px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }
        .stats-controls button:hover {
          background: rgba(255,255,255,0.2);
        }
        .stats-controls .duration-indicator {
          color: rgba(255,255,255,0.9);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          padding: 0 0.25rem;
          min-width: 1.5rem;
          text-align: center;
        }
        
        @keyframes scrollStats {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @media (min-width: 768px) {
          .stat-item .stat-value {
            font-size: 3.25rem;
          }
          .stat-item .stat-label {
            font-size: 1rem;
          }
          .stat-item .stat-sub {
            font-size: 0.875rem;
          }
        }

        /* Solution card - description always visible */
        .solution-card {
          transition: all 0.3s ease;
        }
        .solution-card .card-content {
          transition: all 0.3s ease;
        }
        .solution-card .card-title {
          transition: all 0.3s ease;
        }
        .solution-card:hover .card-title {
          color: #0284c7;
        }
      `}</style>

      {fetchError && (
        <div className="bg-red-600 text-white p-3 text-center text-xs font-bold uppercase sticky top-0 z-[60]">
          Connection issue: Showing cached or unavailable content.
        </div>
      )}

      {/* HEADER */}
      <header className={`border-b border-blue-700 bg-sky-600 py-3 px-6 sticky top-0 z-50 shadow-md header-transition ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}>
        <div dir="ltr" className="max-w-7xl mx-auto flex flex-row items-center justify-between w-full gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Image 
              src="/CICapitalSiteLogo-White.png" 
              alt="CI Capital Logo" 
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const container = e.currentTarget.parentElement;
                if (container) {
                  const label = document.createElement('span');
                  label.className = 'text-2xl tracking-tight text-white font-bold uppercase';
                  label.innerHTML = 'CI<span class="text-sky-200 font-light">CAPITAL</span>';
                  container.appendChild(label);
                }
              }}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 lg:gap-4">
            <nav className="flex items-center gap-1 xl:gap-2">
              {navItems.map((item: any) => {
                const attrs = item.attributes || item;
                const label = attrs.label || '';
                const link = attrs.link || '';
                const dropdownItems = attrs.dropdownItems || [];
                const hasDropdown = dropdownItems.length > 0;

                if (hasDropdown) {
                  return (
                    <div 
                      key={item.id} 
                      className="nav-item relative group"
                      onMouseEnter={() => handleMouseEnter(item.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <span className="flex items-center text-white hover:text-sky-100 transition-colors font-medium text-sm uppercase tracking-wider px-3 py-2 cursor-default">
                        <span className="relative inline-block">
                          {label}
                          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                        </span>
                      </span>
                      <div className={`nav-dropdown ${openDropdown === item.id ? 'open' : ''}`}>
                        {dropdownItems.map((d: any, idx: number) => (
                          <a key={idx} href={d.link || '#'} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-sky-600 transition-colors">
                            {d.label || 'Link'}
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <a key={item.id} href={link || '#'} className="nav-item text-white hover:text-sky-100 transition-colors font-medium text-sm uppercase tracking-wider px-3 py-2 group">
                      <span className="relative inline-block">
                        {label}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100" />
                      </span>
                    </a>
                  );
                }
              })}
            </nav>

            {/* Search icon */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white hover:text-sky-100 transition-colors"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Language toggle */}
            <button 
              onClick={toggleLanguage}
              disabled={isLanguageSwitching}
              className="text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-all bg-white hover:bg-sky-50 px-3 py-1 rounded-md cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Toggle language"
            >
              {isLanguageSwitching ? '...' : t.langBtn}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div dir={t.dir} className="w-full mt-2 transition-all duration-200">
            <div className="relative w-full max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full bg-white border border-sky-300 text-neutral-950 placeholder-neutral-400 rounded-md py-2 px-4 pr-10 focus:outline-none focus:border-white text-xs font-light shadow-sm"
                autoFocus 
                aria-label="Search"
              />
              <div className={`absolute inset-y-0 flex items-center px-4 text-sky-600 ${t.dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* WHO WE ARE SECTION */}
      <section id="about" className="relative w-full bg-white py-16 md:py-20 border-b border-sky-100 scroll-mt-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {isLoading ? (
              <div className="space-y-4 w-full">
                <div className="h-4 bg-sky-50 w-1/4 animate-pulse"></div>
                <div className="h-10 bg-sky-50 w-3/4 animate-pulse"></div>
                <div className="h-6 bg-sky-50 w-full animate-pulse mt-4"></div>
                <div className="h-6 bg-sky-50 w-full animate-pulse"></div>
              </div>
            ) : !whoWeAreData.description ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700 block mb-3">{t.whoWeAreTag}</span>
                <h1 className="text-[44px] md:text-[60px] leading-[48px] md:leading-[60px] font-light text-neutral-950 uppercase tracking-tight mb-6">
                  {t.emptyWhoWeAreHeading}
                </h1>
                <p className="text-neutral-500 text-lg leading-relaxed font-light border-l-4 border-sky-100 pl-4">
                  {t.emptyWhoWeAreSub}
                </p>
              </div>
            ) : (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700 block mb-3">
                  {whoWeAreData.tag ?? t.whoWeAreTag}
                </span>
                <h1 className="text-[44px] md:text-[60px] leading-[48px] md:leading-[60px] font-light text-neutral-950 uppercase tracking-tight mb-6">
                  {whoWeAreData.title ?? t.whoWeAreHeading}
                </h1>
                <p className="text-neutral-700 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                  {whoWeAreData.description}
                </p>
                
                {whoWeAreData.values && whoWeAreData.values.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-8">
                    {whoWeAreData.values.map((value: any, idx: number) => (
                      <span key={idx} className="inline-block bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium px-4 py-2 rounded-none tracking-wide">
                        {typeof value === 'string' ? value : value.label ?? "Value"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="relative h-64 md:h-80 lg:h-96 bg-sky-50 overflow-hidden shadow-inner">
              <img 
                src={getStrapiImage(whoWeAreData.image, "/about-placeholder.jpg")} 
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
        </div>
      </section>

      {/* GLOBAL SCALE SECTION */}
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

      {/* Content sections - Solutions and Media */}
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
              {[0, 1].map((i) => (
                <div key={`loading-${i}`} className="bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden opacity-50 pointer-events-none">
                  <div className="h-48 md:h-56 w-full bg-sky-50 flex items-center justify-center p-4 animate-pulse"></div>
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
              {businessLines.map((subSection: any) => {
                const imageSrc = getStrapiImage(subSection.image, "/CICapitalLogo-Ar.png");
                return (
                  <div 
                    key={subSection.id} 
                    className="solution-card bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden hover:shadow-lg hover:border-sky-300 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="h-48 md:h-56 w-full bg-sky-50 relative overflow-hidden">
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
                      
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-600 hover:text-sky-700 cursor-pointer transition-all duration-200 inline-flex items-center gap-1 hover:gap-2">
                        {t.exploreMore}
                      </span>
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

      {/* FOOTER */}
      <footer className="bg-neutral-900 text-white py-12 px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold uppercase tracking-tight">CI Capital</h3>
            <p className="mt-4 text-neutral-300 text-sm max-w-md leading-relaxed">
              {t.footerAbout}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-neutral-300">
              <li><a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="hover:text-white transition-colors">{t.navOurFirm}</a></li>
              <li><a href="#services" onClick={(e) => handleSmoothScroll(e, '#services')} className="hover:text-white transition-colors">{t.navBizLines}</a></li>
              <li><a href="#media" onClick={(e) => handleSmoothScroll(e, '#media')} className="hover:text-white transition-colors">{t.navMediaRel}</a></li>
              <li><a href="#careers" onClick={(e) => handleSmoothScroll(e, '#careers')} className="hover:text-white transition-colors">{t.navCareers}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4">{t.footerNewsletter}</h4>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder={t.footerEmailPlaceholder}
                className="px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Email address"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md text-sm font-bold uppercase tracking-wider transition-colors"
              >
                {t.footerSubscribe}
              </button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-400">
          <p>{t.footerLegal}</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">{t.footerPrivacy}</a>
            <a href="#" className="hover:text-white transition-colors">{t.footerTerms}</a>
          </div>
        </div>
      </footer>

      {/* Back to Top */}
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