// components/Hero.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface HeroData {
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  titleLine4?: string;
  subtitle?: string;
  smallTitle?: string;
  buttontext?: string;
  buttonlink?: string;
  backgroundImage?: any;
  backgroundVideo?: any;
  image?: any;
  logoImage?: any;
}

interface HeroProps {
  data: HeroData | HeroData[] | null;
}

export default function Hero({ data }: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [directions, setDirections] = useState<string[]>([]);

  const normalizedData = Array.isArray(data) ? data[0] : data;

  const title1 = normalizedData?.titleLine1 || '';
  const title2 = normalizedData?.titleLine2 || '';
  const title3 = normalizedData?.titleLine3 || '';
  const title4 = normalizedData?.titleLine4 || '';
  const subtitle = normalizedData?.subtitle || '';
  const smallTitle = normalizedData?.smallTitle || '';
  const buttonText = normalizedData?.buttontext || '';
  const buttonLink = normalizedData?.buttonlink || '';

  let logoUrl = null;
  const logo = normalizedData?.logoImage;
  if (logo) {
    const logoData = Array.isArray(logo) ? logo[0] : logo;
    if (logoData?.url) {
      logoUrl = `http://localhost:1337${logoData.url}`;
    }
  }

  useEffect(() => {
    let urls: string[] = [];
    const img = normalizedData?.backgroundImage;
    if (img) {
      if (Array.isArray(img)) {
        urls = img
          .filter((item: any) => item?.url)
          .map((item: any) => `http://localhost:1337${item.url}`);
      } else if (img.url) {
        urls = [`http://localhost:1337${img.url}`];
      }
    }
    setImageUrls(urls);
    setCurrentImageIndex(0);
    const dirs = urls.map(() => Math.random() > 0.5 ? 'left-to-right' : 'right-to-left');
    setDirections(dirs);
  }, [normalizedData]);

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const interval = setInterval(() => {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * imageUrls.length);
      } while (nextIndex === currentImageIndex && imageUrls.length > 1);
      setCurrentImageIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageUrls, currentImageIndex]);

  let bgVideoUrl = null;
  const video = normalizedData?.backgroundVideo;
  if (video) {
    const videoData = Array.isArray(video) ? video[0] : video;
    if (videoData?.url) {
      bgVideoUrl = `http://localhost:1337${videoData.url}`;
    }
  }

  const hasMultipleImages = imageUrls.length > 1;
  const hasSingleImage = imageUrls.length === 1;

  if (!normalizedData) {
    return (
      <section className="relative w-full h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-white/30 text-sm">Loading…</div>
      </section>
    );
  }

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden bg-neutral-900">
      {/* Background - unchanged */}
      {bgVideoUrl ? (
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={bgVideoUrl} type="video/mp4" />
          {imageUrls.length > 0 && (
            <img src={imageUrls[0]} alt="background" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </video>
      ) : hasMultipleImages ? (
        <>
          {imageUrls.map((url, index) => {
            const isActive = index === currentImageIndex;
            const direction = directions[index] || 'left-to-right';
            return (
              <div
                key={url}
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                style={{ backgroundImage: `url(${url})` }}
              >
                {isActive && (
                  <div
                    className={`absolute inset-0 w-full h-full ken-burns-${direction}`}
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
              </div>
            );
          })}
        </>
      ) : hasSingleImage ? (
        <div
          className="hero-bg-image absolute inset-0 bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${imageUrls[0]})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-sky-800 to-slate-900" />
      )}

      <div className="absolute inset-0 bg-black/35 z-10" />

      <div className="relative z-20 flex items-center justify-center h-full px-6 text-center text-white">
        <div className="max-w-4xl">
          {logoUrl ? (
            <div className="mb-6 flex justify-center">
              <img src={logoUrl} alt="Company Logo" className="max-h-32 md:max-h-48 w-auto object-contain" />
            </div>
          ) : (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight tracking-wide">
              {title1 && <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>{title1}</span>}
              {title2 && <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>{title2}</span>}
              {title3 && <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>{title3}</span>}
              {title4 && <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>{title4}</span>}
            </h1>
          )}

          {smallTitle && (
            <p
              className="text-3xl md:text-4xl font-light text-white/80 max-w-2xl mx-auto opacity-0 animate-fade-in-up tracking-wide"
              style={{ animationDelay: '0.2s' }}
            >
              {smallTitle}
            </p>
          )}

          {subtitle && (
            <div
              className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto opacity-0 animate-fade-in-up tracking-wide"
              style={{ animationDelay: '0.9s' }}
              dangerouslySetInnerHTML={{ __html: subtitle }}
            />
          )}

          {buttonText && buttonLink && (
            <div className="mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
              <Link
                href={buttonLink}
                className="inline-block border-2 border-white px-8 py-3 text-sm font-medium uppercase tracking-widest hover:bg-white hover:text-neutral-900 transition-colors"
              >
                {buttonText}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes kenBurnsLeftToRight {
          0% { transform: scale(1) translateX(-5%); }
          100% { transform: scale(1.15) translateX(5%); }
        }
        @keyframes kenBurnsRightToLeft {
          0% { transform: scale(1) translateX(5%); }
          100% { transform: scale(1.15) translateX(-5%); }
        }
        .ken-burns-left-to-right {
          animation: kenBurnsLeftToRight 12s ease-in-out infinite alternate;
        }
        .ken-burns-right-to-left {
          animation: kenBurnsRightToLeft 12s ease-in-out infinite alternate;
        }
      `}</style>
    </section>
  );
}