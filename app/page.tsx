"use client";

import React, { useState, useEffect, useRef } from 'react';

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
    profileTag: "FINANCIAL STATEMENT / Q1 2026 RELEASES",
    profileHeading: "Corporate Profile",
    profileDesc: "CI Capital Holding for Financial Investments is a premier diversified financial services group and Egypt's leading provider of institutional investment banking, asset management, securities brokerage, and non-banking alternative credit lines. Operating via global delivery Desks spanning Cairo, New York, and Dubai, the firm serves institutional funds, sovereign desks, and corporate networks.",
    bizTag: "CORE SEGMENTS",
    bizHeading: "Solutions",
    mediaTag: "CORPORATE DISCLOSURES",
    mediaHeading: "Stay Informed",
    viewAll: "View All Disclosures \u2192",
    readMore: "Read Report \u2192",
    gatewayBtn: "Secure Gateway",
    tabInstitutional: "Institutional & Corporate Banking",
    tabRetail: "Retail & Alternative Finance",
    emptyNewsHeading: "No News Available",
    emptyNewsSub: "Check back later for the latest corporate disclosures and updates.",
    metrics: [
      { 
        label: "GROUP ASSETS UNDER MANAGEMENT", 
        value: "EGP 186B+", 
        subText: "Egypt's leading asset management portfolio", 
        trend: "+28% YoY Growth" 
      },
      { 
        label: "QUARTERLY RECORD REVENUES", 
        value: "EGP 2.7B", 
        subText: "Highest recorded consolidated performance", 
        trend: "Record Brokerage Activity" 
      },
      { 
        label: "TOTAL FINANCING PORTFOLIO", 
        value: "EGP 27.8B", 
        subText: "Strong balance sheet allocation", 
        trend: "98% Premium Asset Quality" 
      }
    ],
    businessLines: {
      institutional: [
        { id: "ib", title: "Investment Banking", image: "/CICapitalLogo-Ar.png", desc: "Market-leading M&A advisory, capital structuring, equity, and debt capital market financing transactions." },
        { id: "am", title: "Asset Management", image: "/CICapitalLogo-Ar.png", desc: "Customized multi-asset class funds and discretionary portfolio management for global and local institutions." },
        { id: "sb", title: "Securities Brokerage", image: "/CICapitalLogo-Ar.png", desc: "Top-tier execution research and brokerage engines built for institutional and high-net-worth retail desks." },
        { id: "res", title: "Research Division", image: "/CICapitalLogo-Ar.png", desc: "In-depth macroeconomic analysis, equity evaluations, and critical tracking of the EGX and regional markets." }
      ],
      retail: [
        { id: "corp", title: "Corplease (Leasing)", image: "/CICapitalLogo-Ar.png", desc: "Egypt's premier financial leasing solutions providing structural equipment, machinery, and commercial real estate assets." },
        { id: "reefy", title: "Reefy (Microfinance)", image: "/CICapitalLogo-Ar.png", desc: "Empowering local micro-enterprises and micro-entrepreneurs across Egypt with accessible business capital lines." },
        { id: "souhoola", title: "Souhoola (Consumer Finance)", image: "/CICapitalLogo-Ar.png", desc: "Instant digital point-of-sale financing lines and flexible buy-now-pay-later digital alternative channels." },
        { id: "fact", title: "Factoring Services", image: "/CICapitalLogo-Ar.png", desc: "Optimizing short-term corporate liquidity and structural supply chain financing for businesses." },
        { id: "ins", title: "Insurance Brokerage", image: "/CICapitalLogo-Ar.png", desc: "Comprehensive risk management advisory and corporate insurance portfolio structuring." },
        { id: "prop", title: "PropTech Financing", image: "/CICapitalLogo-Ar.png", desc: "Innovative structural digital financing models streamlining property assets and digital mortgage access points." }
      ]
    },
    press: [
      { id: 1, date: "June 28, 2026", title: "CI Capital Advises on Landmark EGP 2.5 Billion Corporate Bond Issuance", category: "Investment Banking", image: "/CICapitalLogo-Ar.png" },
      { id: 2, date: "June 15, 2026", title: "CI Capital Asset Management Mutual Funds Outperform EGX Benchmarks in H1 2026", category: "Asset Management", image: "/CICapitalLogo-Ar.png" },
      { id: 3, date: "May 29, 2026", title: "Reefy Signals Massive Growth with Expansion of Microfinance Branch Network", category: "Financial Inclusion", image: "/CICapitalLogo-Ar.png" }
    ]
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
    profileTag: "القوائم المالية / إصدارات الربع الأول ٢٠٢٦",
    profileHeading: "الملف المؤسسي للشركة",
    profileDesc: "سي آي كابيتال القابضة للاستثمارات المالية هي مجموعة خدمات مالية متنوعة والمزود الرائد في مصر للخدمات المصرفية الاستثمارية للمؤسسات، إدارة الأصول، ووساطة الأوراق المالية، والتأجير التمويلي والخدمات المالية غير المصرفية للمؤسسات والشركات الكبرى والأفراد ذوي الملاءة المالية.",
    bizTag: "القطاعات الأساسية",
    bizHeading: "حلولنا",
    mediaTag: "الإفصاحات والمركز الإعلامي",
    mediaHeading: "ابق على اطلاع",
    viewAll: "عرض جميع الإفصاحات \u2190",
    readMore: "اقرأ التقرير \u2190",
    gatewayBtn: "بوابة الدخول",
    tabInstitutional: "المؤسسات والشركات",
    tabRetail: "خدمات التجزئة والتمويل الاستهلاكي",
    emptyNewsHeading: "لا توجد أخبار متاحة",
    emptyNewsSub: "يرجى التحقق لاحقاً للحصول على أحدث الإفصاحات والتحديثات.",
    metrics: [
      { 
        label: "إجمالي الأصول تحت الإدارة", 
        value: "١٨٦+ مليار ج.م", 
        subText: "المحفظة الاستثمارية الأكبر نمواً بمصر", 
        trend: "نمو سنوي بنسبة ٢٨٪" 
      },
      { 
        label: "إيرادات ربع سنوية قياسية", 
        value: "٢.٧ مليار ج.م", 
        subText: "الأعلى أداءً في تاريخ الشركة المجمع", 
        trend: "نشاط سمسرة استثنائي" 
      },
      { 
        label: "المحفظة التمويلية المباشرة", 
        value: "٢٧.٨ مليار ج.م", 
        subText: "توزيع ائتماني قوي ومرن", 
        trend: "جودة أصول متميزة بنسبة ٩٨٪" 
      }
    ],
    businessLines: {
      institutional: [
        { id: "ib", title: "الخدمات المصرفية الاستثمارية", image: "/CICapitalLogo-Ar.png", desc: "الاستشارات الرائدة في عمليات الدمج والاستحواذ، وهيكلة رأس المال، وأسواق رأس المال المدين والأسهم." },
        { id: "am", title: "إدارة الأصول", image: "/CICapitalLogo-Ar.png", desc: "صناديق استثمارية مخصصة لإدارة الأصول المتعددة والمحافظ الاستثمارية للمؤسسات المحلية والعالمية." },
        { id: "sb", title: "وساطة الأوراق المالية", image: "/CICapitalLogo-Ar.png", desc: "أنظمة تنفيذ وبحوث تداول رفيعة المستوى مصممة لخدمة المؤسسات الاستثمارية والأفراد ذوي الملاءة المالية." },
        { id: "res", title: "قطاع البحوث", image: "/CICapitalLogo-Ar.png", desc: "التحليل الاقتصادي الكلي المعمق وبحوث الأسهم وتتبع حركة البورصة المصرية والأسواق الإقليمية." }
      ],
      retail: [
        { id: "corp", title: "كوربليس (التأجير التمويلي)", image: "/CICapitalLogo-Ar.png", desc: "حلول التأجير التمويلي الرائدة في مصر لتوفير المعدات والمصانع والآلات والأصول العقارية التجارية." },
        { id: "reefy", title: "شركة ريفي (التمويل متناهي الصغر)", image: "/CICapitalLogo-Ar.png", desc: "تمكين المشروعات متناهية الصغر ورواد الأعمال في جميع أنحاء مصر من خلال خطوط تمويل ميسرة." },
        { id: "souhoola", title: "سهولة (التمويل الاستهلاكي)", image: "/CICapitalLogo-Ar.png", desc: "خطوط تمويل استهلاكي رقمية فورية وحلول الشراء الآن والدفع لاحقاً عبر قنوات رقمية متطورة." },
        { id: "fact", title: "الخصم والتمويل التجاري", image: "/CICapitalLogo-Ar.png", desc: "تحسين السيولة النقدية قصيرة الأجل للشركات وتمويل سلاسل التوريد وهيكلة رأس المال العامل." },
        { id: "ins", title: "وساطة التأمين", desc: "خدمات استشارية شاملة لإدارة المخاطر وهيكلة المحافظ التأمينية للشركات والمؤسسات." },
        { id: "prop", title: "التمويل العقاري التكنولوجي", image: "/CICapitalLogo-Ar.png", desc: "نماذج تمويل رقمية مبتكرة لتيسير تملك الأصول العقارية والوصول إلى خطوط التمويل العقاري." }
      ]
    },
    press: [
      { id: 1, date: "28 يونيو 2026", title: "سي آي كابيتال تقدم الاستشارة بشأن إصدار سندات توريق بقيمة 2.5 مليار جنيه", category: "الخدمات المصرفية", image: "/CICapitalLogo-Ar.png" },
      { id: 2, date: "15 يونيو 2026", title: "صناديق استثمار سي آي كابيتال تتفوق على المؤشرات القياسية للبورصة المصرية في النصف الأول من 2026", category: "إدارة الأصول", image: "/CICapitalLogo-Ar.png" },
      { id: 3, date: "29 مايو 2026", title: "شركة ريفي تشير إلى نمو هائل مع توسيع شبكة فروع التمويل متناهي الصغر", category: "الشمول المالي", image: "/CICapitalLogo-Ar.png" }
    ]
  }
};

async function fetchFromStrapi(path: string) {
  try {
    const res = await fetch(`http://localhost:1337/api/${path}?populate=*`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

// Helper to safely extract Strapi Image URLs
const getStrapiImage = (imageObj: any, fallback: string) => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj; 
  if (imageObj.url) return `http://localhost:1337${imageObj.url}`;
  if (Array.isArray(imageObj) && imageObj[0]?.url) return `http://localhost:1337${imageObj[0].url}`;
  return fallback;
};

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
    >
      <div 
        className="w-full h-full relative transition-transform duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* FRONT FACE */}
        <div 
          className="absolute inset-0 w-full h-full bg-neutral-950/80 border border-neutral-800 p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider text-neutral-400 font-bold uppercase leading-none">
              {label}
            </span>
            <span className="text-[9px] border border-neutral-700 text-neutral-500 px-1 rounded-none leading-none">
              0{index + 1}
            </span>
          </div>
          <span className="text-4xl md:text-5xl font-light text-white tracking-tight leading-none">
            {value}
          </span>
          <div className="flex justify-between items-center text-[10px] text-neutral-500 font-medium tracking-wide leading-none">
            <span>TOUCH CARD TO DISCLOSE</span>
            <span className="animate-pulse">✦</span>
          </div>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 w-full h-full bg-white border border-neutral-300 p-6 flex flex-col justify-between"
          style={{ 
            transform: 'rotateY(180deg)', 
            backfaceVisibility: 'hidden', 
            WebkitBackfaceVisibility: 'hidden' 
          }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] tracking-wider text-neutral-600 font-bold uppercase leading-none">
              SECURE LEDGER
            </span>
            <span className="text-[9px] bg-neutral-950 text-white px-1 leading-none">
              AUDITED
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xl font-normal text-neutral-900 leading-tight">
              {subText}
            </span>
            <span className="text-xs font-semibold text-neutral-500 tracking-wide">
              {trend}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-neutral-400 font-medium leading-none">
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
  const [activeTab, setActiveTab] = useState<'institutional' | 'retail'>('institutional');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const [showContent, setShowContent] = useState(false);

  // Strapi dynamic state variables explicitly declared
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [pressReleases, setPressReleases] = useState<any[]>([]);
  const [businessLines, setBusinessLines] = useState<{institutional: any[], retail: any[]}>({ institutional: [], retail: [] });

  const t = TRANSLATIONS[locale];

  const toggleLanguage = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en');
  };

  const scrollManual = (direction: 'left' | 'right') => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = 360;
    const isRtl = t.dir === 'rtl';

    let offset = direction === 'right' ? scrollAmount : -scrollAmount;
    if (isRtl) offset = -offset;

    slider.scrollBy({ left: offset, behavior: 'smooth' });
  };

  // Fetch Strapi Data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const fetchedMetrics = await fetchFromStrapi("metrics");
      const fetchedPress = await fetchFromStrapi("press-releases");
      const fetchedBizLines = await fetchFromStrapi("business-lines");
      
      setMetrics(fetchedMetrics);
      setPressReleases(fetchedPress);
      
      if (fetchedBizLines && fetchedBizLines.length > 0) {
        const inst = fetchedBizLines.filter((b: any) => b.category && b.category.toLowerCase().trim() === 'institutional');
        const ret = fetchedBizLines.filter((b: any) => b.category && b.category.toLowerCase().trim() === 'retail');
        setBusinessLines({ institutional: inst, retail: ret });
      }

      setIsLoading(false);
    }
    loadData();
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

  // Intersection Observer
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

  // Slider Auto Scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const autoScroll = setInterval(() => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      
      if (Math.abs(slider.scrollLeft) >= maxScroll - 15) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const offset = t.dir === 'rtl' ? -340 : 340;
        slider.scrollBy({ left: offset, behavior: 'smooth' });
      }
    }, 5500);

    return () => clearInterval(autoScroll);
  }, [activeTab, locale]);

  return (
    <main dir={t.dir} className="min-h-screen bg-stone-50 text-neutral-950 tracking-tight transition-all duration-300">
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@200;300;400;500&display=swap');
        
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Barlow Condensed', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        h1, h2, h3, h4 {
          font-family: 'Barlow Condensed', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
          font-weight: 300 !important;
          letter-spacing: -0.02em !important;
        }
        .preserve-3d { transform-style: preserve-3d; -webkit-transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="border-b border-neutral-800 bg-neutral-950 py-3 px-6 sticky top-0 z-50 shadow-md">
        <div dir="ltr" className="max-w-7xl mx-auto flex flex-row items-center justify-between w-full gap-4">
          
          <div className="flex items-center gap-10 xl:gap-14">
            <div className="flex items-center gap-3 shrink-0">
              <img 
                src="/CICapitalSiteLogo-White.png" 
                alt="CI Capital Logo" 
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const container = e.currentTarget.parentElement;
                  if (container) {
                    const label = document.createElement('span');
                    label.className = 'text-xl tracking-tight text-white font-light rounded-none uppercase';
                    label.innerHTML = 'CI<span class="text-neutral-400 font-light">CAPITAL</span>';
                    container.appendChild(label);
                  }
                }}
              />
            </div>

            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-medium text-neutral-400 tracking-normal uppercase">
              <a href="#firm" className="hover:text-white transition-colors duration-150">{t.navOurFirm}</a>
              <a href="#services" className="hover:text-white transition-colors duration-150">{t.navBizLines}</a>
              <a href="#investors" className="hover:text-white transition-colors duration-150">{t.navInvestorRel}</a>
              <a href="#media" className="hover:text-white transition-colors duration-150">{t.navMediaRel}</a>
              <span className="w-px h-3.5 bg-neutral-800"></span>
              <a href="#careers" className="text-white hover:text-neutral-300 transition-colors duration-150">{t.navCareers}</a>
            </nav>
          </div>

          <div className="flex items-center gap-4 xl:gap-6 shrink-0 uppercase text-xs xl:text-sm tracking-wider">
            <a href="#contact" className="hidden sm:inline-block font-light text-neutral-400 hover:text-white transition-colors duration-150">
              {t.navContact}
            </a>
            
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-1.5 rounded-none border transition-all cursor-pointer ${
                searchOpen ? 'bg-white border-white text-black' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
              title="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            <button 
              onClick={toggleLanguage}
              className="text-[11px] font-bold text-white hover:text-neutral-950 transition-all border border-neutral-800 hover:bg-white px-3 py-1 rounded-none cursor-pointer bg-neutral-900"
            >
              {t.langBtn}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div dir={t.dir} className="w-full mt-2 transition-all duration-200">
            <div className="relative w-full max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder={t.searchPlaceholder}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-none py-2 px-4 pr-10 focus:outline-none focus:border-neutral-700 text-xs font-light shadow-inner"
                autoFocus 
              />
              <div className={`absolute inset-y-0 flex items-center px-4 text-slate-500 ${t.dir === 'rtl' ? 'left-0' : 'right-0'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
          </div>
        )}
      </header>

      <section id="firm" className="relative w-full min-h-[calc(100vh-60px)] flex items-center bg-neutral-950 text-white overflow-hidden border-b border-neutral-800">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center select-none pointer-events-none mix-blend-luminosity opacity-20 z-0"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1920&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 w-full h-full pointer-events-none opacity-75 scale-[1.35] z-10">
          <div id="cairo-youtube-iframe" className="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-neutral-950/50 z-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto w-full px-6 py-20 relative z-30 grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
          <div className="lg:col-span-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400 block mb-3">{t.profileTag}</span>
            <h1 className="text-[50px] sm:text-[65px] md:text-[80px] leading-[55px] sm:leading-[70px] md:leading-[80px] font-light text-white uppercase tracking-tight mb-8">
              {t.profileHeading}
            </h1>
            <p className="text-neutral-200 text-lg md:text-xl leading-relaxed font-light max-w-3xl">
              {t.profileDesc}
            </p>
          </div>
          
          <div className="flex flex-col gap-6 w-full shrink-0">
            {(metrics.length > 0 ? metrics : t.metrics).map((metric: any, idx: number) => (
              <SpinningMetricCard 
                key={metric.id || idx}
                index={idx}
                label={metric.label}
                value={metric.value}
                subText={metric.subText}
                trend={metric.trend}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-neutral-400 hover:text-white transition-colors duration-150 cursor-pointer">
          <a href="#services" className="flex flex-col items-center gap-1 group">
            <span className="text-[10px] tracking-widest uppercase font-bold text-neutral-400 group-hover:text-white transition-colors">Scroll to Solutions</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 animate-bounce group-hover:translate-y-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </a>
        </div>
      </section>

      <div 
        ref={contentSectionRef}
        className={`max-w-7xl mx-auto px-6 py-24 flex flex-col gap-24 md:gap-32 transition-all duration-1000 ease-out ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        
        <section id="services" className="w-full overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">{t.bizTag}</span>
              <h2 className="text-[44px] md:text-[60px] leading-[48px] md:leading-[60px] font-light text-neutral-950 uppercase tracking-tight mt-1">
                {t.bizHeading}
              </h2>
            </div>
            <div className="flex bg-neutral-100 p-1 rounded-none border border-neutral-200 w-full md:w-auto">
              <button 
                onClick={() => setActiveTab('institutional')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  activeTab === 'institutional' ? 'bg-neutral-900 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t.tabInstitutional}
              </button>
              <button 
                onClick={() => setActiveTab('retail')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-none text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  activeTab === 'retail' ? 'bg-neutral-900 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {t.tabRetail}
              </button>
            </div>
          </div>

          <div className="relative w-full">
            <div ref={sliderRef} className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4">
              {(businessLines[activeTab].length > 0 ? businessLines[activeTab] : t.businessLines[activeTab]).map((subSection: any) => (
                <div key={subSection.id} className="min-w-[85%] sm:min-w-[45%] lg:min-w-[31%] snap-start bg-white rounded-none border border-neutral-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border-t-2 hover:border-t-neutral-900">
                  <div className="h-72 w-full bg-white relative overflow-hidden flex items-center justify-center border-b border-neutral-100 p-8">
                    <img 
                      src={getStrapiImage(subSection.image, "/CICapitalLogo-Ar.png")} 
                      alt={subSection.title}
                      className="max-w-full max-h-full object-contain transform hover:scale-102 transition-transform duration-300 ease-out" 
                    />
                  </div>
                  <div className="p-8 py-12 flex-1 flex flex-col justify-between gap-8">
                    <div>
                      <h3 className="text-2xl font-light text-neutral-950 mb-3 uppercase tracking-tight">{subSection.title}</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed font-light line-clamp-4">{subSection.desc || subSection.description}</p>
                    </div>
                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 inline-flex items-center gap-1 group cursor-pointer hover:underline">
                        {t.gatewayBtn} <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`flex mt-4 ${t.dir === 'rtl' ? 'justify-start' : 'justify-end'}`}>
              <div dir="ltr" className="flex items-center gap-2 bg-white border border-neutral-200 p-1 rounded-none shadow-sm">
                <button onClick={() => scrollManual('left')} className="w-9 h-9 flex items-center justify-center rounded-none hover:bg-slate-50 text-slate-600 hover:text-neutral-950 active:scale-95 transition-all cursor-pointer text-sm font-bold">←</button>
                <div className="w-px h-4 bg-slate-200"></div>
                <button onClick={() => scrollManual('right')} className="w-9 h-9 flex items-center justify-center rounded-none hover:bg-slate-50 text-slate-600 hover:text-neutral-950 active:scale-95 transition-all cursor-pointer text-sm font-bold">→</button>
              </div>
            </div>
          </div>
        </section>

        <section id="media">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">{t.mediaTag}</span>
              <h2 className="text-[44px] md:text-[60px] leading-[48px] md:leading-[60px] font-light text-neutral-950 uppercase tracking-tight mt-1">
                {t.mediaHeading}
              </h2>
            </div>
            <button className="text-xs font-bold uppercase tracking-wider text-neutral-950 hover:underline cursor-pointer">
              {t.viewAll}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // 1. LOADING STATE
              t.press.map((press: any) => (
                <article key={`loading-${press.id}`} className="bg-white rounded-none border border-neutral-200 shadow-sm flex flex-col overflow-hidden opacity-50 pointer-events-none">
                  <div className="h-56 w-full bg-slate-50 flex items-center justify-center p-6 border-b border-neutral-100 animate-pulse"></div>
                  <div className="p-8 py-12 flex-1 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <div className="h-4 bg-slate-100 w-1/3 animate-pulse"></div>
                      <div className="h-6 bg-slate-100 w-full animate-pulse"></div>
                      <div className="h-6 bg-slate-100 w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </article>
              ))
            ) : pressReleases.length > 0 ? (
              // 2. SUCCESS STATE
              pressReleases.map((press: any) => (
                <article key={press.id} className="bg-white rounded-none border border-neutral-200 shadow-sm flex flex-col overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-200">
                  <div className="h-56 w-full bg-white flex items-center justify-center p-6 border-b border-neutral-100 select-none">
                    <img 
                      src={getStrapiImage(press.image, "/CICapitalLogo-Ar.png")} 
                      alt="Corporate Document Asset" 
                      className="max-w-full max-h-full object-contain opacity-90 transform hover:scale-101 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-8 py-12 flex-1 flex flex-col justify-between gap-6">
                    <div>
                      <div className="flex justify-between items-center gap-3 mb-4">
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-neutral-500 px-2 py-0.5 rounded-none">
                          {press.category}
                        </span>
                        <span className="text-xs text-neutral-400 font-normal">{press.date}</span>
                      </div>
                      <h3 className="text-lg font-light text-neutral-950 leading-snug uppercase tracking-tight line-clamp-3 hover:text-neutral-700 transition-colors">
                        {press.title}
                      </h3>
                    </div>
                    <div className="pt-4 border-t border-neutral-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 inline-flex items-center gap-1 group cursor-pointer hover:underline">
                        {t.readMore}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              // 3. EMPTY STATE
              <div className="col-span-1 md:col-span-3 bg-white border border-neutral-200 shadow-sm p-16 flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-neutral-300 mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <h3 className="text-2xl font-light text-neutral-900 uppercase tracking-tight mb-2">{t.emptyNewsHeading}</h3>
                <p className="text-neutral-500 font-light">{t.emptyNewsSub}</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}