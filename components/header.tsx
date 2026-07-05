// components/Header.tsx
"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

const getFallbackNav = (locale: string) => {
  if (locale === 'ar') {
    return [
      { id: 1, label: "مؤسستنا", dropdownItems: [{ label: "لمحة سريعة", link: "/about/at-a-glance" }, { label: "الجدول الزمني", link: "/about/timeline" }, { label: "فريقنا", link: "/about/our-people" }] },
      { id: 2, label: "حلولنا", link: "/solutions" },
      { id: 3, label: "علاقات المستثمرين", dropdownItems: [{ label: "معلومات السهم", link: "/investor-relations/share-information" }, { label: "الأخبار والإفصاحات", link: "/investor-relations/news" }, { label: "مركز النتائج", link: "/investor-relations/results-center" }, { label: "جهات الاتصال", link: "/investor-relations/contacts" }] },
      { id: 4, label: "العلاقات الإعلامية", link: "/media" },
      { id: 5, label: "الوظائف", link: "/careers" },
      { id: 6, label: "اتصل بنا", link: "/contact" },
    ];
  }
  return [
    { id: 1, label: "Our Firm", dropdownItems: [{ label: "At a Glance", link: "/about/at-a-glance" }, { label: "Timeline", link: "/about/timeline" }, { label: "Our People", link: "/about/our-people" }] },
    { id: 2, label: "Solutions", link: "/solutions" },
    { id: 3, label: "Investor Relations", dropdownItems: [{ label: "Share Information", link: "/investor-relations/share-information" }, { label: "News & Disclosures", link: "/investor-relations/news" }, { label: "Results Center", link: "/investor-relations/results-center" }, { label: "IR Contacts", link: "/investor-relations/contacts" }] },
    { id: 4, label: "Media Relations", link: "/media" },
    { id: 5, label: "Careers", link: "/careers" },
    { id: 6, label: "Contact Us", link: "/contact" },
  ];
};

const HEADER_TRANSLATIONS = {
  en: {
    langBtn: "العربية",
    searchPlaceholder: "Search client gateway, indices, disclosures...",
    dir: "ltr",
  },
  ar: {
    langBtn: "English",
    searchPlaceholder: "البحث في الإفصاحات والبوابات...",
    dir: "rtl",
  }
};

export default function Header() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<'en' | 'ar'>('en');
  const [searchOpen, setSearchOpen] = useState(false);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const t = HEADER_TRANSLATIONS[locale];

  useEffect(() => {
    async function loadNav() {
      const data = await fetchFromStrapi('navigations', locale);
      if (data && data.length > 0) {
        const hasDropdownItems = data.some((item: any) => {
          const attrs = item.attributes || item;
          return attrs.dropdownItems && attrs.dropdownItems.length > 0;
        });
        if (hasDropdownItems) {
          const sorted = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
          setNavItems(sorted);
        } else {
          setNavItems(getFallbackNav(locale));
        }
      } else {
        setNavItems(getFallbackNav(locale));
      }
    }
    loadNav();
  }, [locale]);

  const toggleLanguage = () => {
    setLocale(prev => prev === 'en' ? 'ar' : 'en');
  };

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-item')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (link: string) => {
    if (!link) return false;
    return pathname === link || pathname?.startsWith(link + '/');
  };

  const handleMouseEnter = (id: number) => setOpenDropdown(id);
  const handleMouseLeave = () => setOpenDropdown(null);

  return (
    <header className={`border-b border-blue-700 bg-sky-600 py-3 px-6 sticky top-0 z-50 shadow-md header-transition ${isHeaderVisible ? 'header-visible' : 'header-hidden'}`}>
      <div dir="ltr" className="max-w-7xl mx-auto flex flex-row items-center justify-between w-full gap-4">
        
        {/* Logo with Link to homepage */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
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
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-2 lg:gap-4">
          <nav className="flex items-center gap-1 xl:gap-2">
            {navItems.map((item: any) => {
              const attrs = item.attributes || item;
              const label = attrs.label || '';
              const link = attrs.link || '';
              const dropdownItems = attrs.dropdownItems || [];
              const hasDropdown = dropdownItems.length > 0;
              const isActiveLink = link ? isActive(link) : false;

              if (hasDropdown) {
                return (
                  <div 
                    key={item.id} 
                    className={`nav-item relative ${openDropdown === item.id ? 'active' : ''}`}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <span className="flex items-center text-white hover:text-sky-100 transition-colors font-medium text-sm uppercase tracking-wider px-3 py-2 cursor-default">
                      {label}
                    </span>
                    <div className={`nav-dropdown ${openDropdown === item.id ? 'open' : ''}`}>
                      {dropdownItems.map((d: any, idx: number) => {
                        const dAttrs = d.attributes || d;
                        const isDropdownActive = isActive(dAttrs.link || '');
                        return (
                          <a
                            key={idx}
                            href={dAttrs.link || '#'}
                            className={`block px-4 py-2 text-sm transition-colors ${isDropdownActive ? 'text-sky-600 bg-sky-50' : 'text-gray-700 hover:bg-gray-100 hover:text-sky-600'}`}
                          >
                            {dAttrs.label || 'Link'}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                );
              } else {
                return (
                  <a
                    key={item.id}
                    href={link || '#'}
                    className={`nav-item ${isActiveLink ? 'active' : ''} text-white hover:text-sky-100 transition-colors font-medium text-sm uppercase tracking-wider px-3 py-2`}
                  >
                    {label}
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
            className="text-[11px] font-bold text-sky-600 hover:text-sky-700 transition-all bg-white hover:bg-sky-50 px-3 py-1 rounded-md cursor-pointer shadow-sm"
            aria-label="Toggle language"
          >
            {t.langBtn}
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
            <div className={`absolute inset-y-0 flex items-center px-4 text-sky-600 ${locale === 'ar' ? 'left-0' : 'right-0'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}