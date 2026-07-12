// app/about/at-a-glance/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getStrapiImage } from '@/lib/strapi';
import Hero from '@/components/Hero';
import FlipStatCard from '@/components/FlipStatCard';
import Reveal from '@/components/Reveal';
import OfficeLocations, { type OfficeLocation } from '@/components/OfficeLocations';

// ─── Metadata ───────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'About | CI Capital',
  description: 'Learn more about CI Capital – our history, values, and leadership team.',
  openGraph: {
    title: 'About | CI Capital',
    description: 'Learn more about CI Capital – our history, values, and leadership team.',
    type: 'website',
  },
};

// ─── Rich text renderer ──────────────────────────────────────
// Heading levels are clamped so Strapi content can never emit a
// second <h1> (the page title already owns that slot) or skip
// past <h4>, which would break the document outline for
// screen readers and search crawlers.
function renderRichText(content: any) {
  if (!content) return null;

  if (typeof content === 'string') {
    const paragraphs = content.split('\n').filter((p) => p.trim() !== '');
    return paragraphs.map((p, i) => (
      <p key={i} className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">
        {p}
      </p>
    ));
  }

  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === 'heading') {
        const rawLevel = block.level || 2;
        const level = Math.max(2, Math.min(rawLevel, 4)); // clamp to h2–h4
        const text = block.children?.map((child: any) => child.text || '').join('') || '';
        const sizeClass =
          level === 2
            ? 'text-2xl md:text-3xl'
            : level === 3
            ? 'text-xl md:text-2xl'
            : 'text-lg md:text-xl';
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return (
          <Tag
            key={index}
            className={`${sizeClass} font-light text-neutral-950 tracking-tight mt-8 mb-4`}
          >
            {text}
          </Tag>
        );
      }
      if (block.type === 'paragraph') {
        const text = block.children?.map((child: any) => child.text || '').join('') || '';
        return (
          <p key={index} className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">
            {text}
          </p>
        );
      }
      if (block.type === 'list' && block.format === 'unordered') {
        const items =
          block.children?.map((item: any) => {
            const itemText = item.children?.map((c: any) => c.text || '').join('') || '';
            return (
              <li
                key={item.id || index}
                className="text-neutral-700 text-base md:text-lg leading-relaxed"
              >
                {itemText}
              </li>
            );
          }) || [];
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-1">
            {items}
          </ul>
        );
      }
      return null;
    });
  }

  return null;
}

// ─── Fetch data ──────────────────────────────────────────────
async function getAboutPage() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-page?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error(`[about-page] Strapi responded ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    // Support both Strapi v4 (data.attributes) and v5 (flat data) shapes.
    const attrs = json.data?.attributes || json.data;
    return attrs || null;
  } catch (err) {
    console.error('[about-page] Failed to fetch about-page from Strapi:', err);
    return null;
  }
}

// ─── Page Component ──────────────────────────────────────────
export default async function AtAGlancePage() {
  const data = await getAboutPage();

  // Hero data
  const heroData = {
    backgroundImage: data?.heroImage || null,
    logoImage: data?.logoImage || null,
    subtitle: data?.caption || '',
    buttontext: data?.buttonText || '',
    buttonlink: data?.buttonLink || '#intro',
  };

  // ─── Intro section ──────────────────────────────────────────
  const introTitle = data?.introTitle || '';
  const introText1 = data?.introText1 || null;
  const introText2 = data?.introText2 || null;
  const introImage1 = data?.introImage1 || null;
  const introImage2 = data?.introImage2 || null;
  const introImage1Url = getStrapiImage(introImage1, '/placeholder-image.jpg');
  const introImage2Url = getStrapiImage(introImage2, '/placeholder-image.jpg');

  // ─── Stats ──────────────────────────────────────────────────
  const stats = data?.stats || [];

  // ─── Video section ────────────────────────────────────────
  const videoUrl = data?.videoUrl || '';
  const videoTitle = data?.videoTitle || 'Watch Our Story';

  // ─── Office locations ───────────────────────────────────────
  const offices: OfficeLocation[] = data?.offices || [];

  // ─── Explore More & CTA ────────────────────────────────────
  const exploreCards = data?.highlightCards || [];
  const ctaText = data?.ctaText || '';
  const ctaLink = data?.ctaLink || '';

  // JSON-LD structured data for richer search results
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CI Capital',
    description: 'Learn more about CI Capital – our history, values, and leadership team.',
    ...(heroData.logoImage
      ? { logo: getStrapiImage(heroData.logoImage, '') }
      : {}),
  };

  return (
    <section className="w-full bg-white">
      {/* Structured data — helps search engines render a rich Organization card */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />

      <Hero data={heroData} compact={true} />

      {/* ─── Stats – overlay hero ──────────────────────────────── */}
      {stats.length > 0 && (
        <div id="stats" className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 scroll-mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat: any, idx: number) => (
              <Reveal key={idx} delay={idx * 80}>
                <FlipStatCard stat={stat} />
              </Reveal>
            ))}
          </div>
        </div>
      )}

      {/* ─── 1. Company Intro ────────────────────────────────────── */}
      <div id="intro" className="max-w-7xl mx-auto px-6 py-16 md:py-24 scroll-mt-16">
        {introTitle && (
          <Reveal>
            <h1 className="text-3xl md:text-5xl font-light text-neutral-950 tracking-tight text-center mb-12">
              {introTitle}
            </h1>
          </Reveal>
        )}

        {/* Row 1: Image (left) + First 2 paragraphs (right) */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {introImage1Url && (
            <Reveal className="w-full md:w-1/2">
              <div className="relative w-full aspect-[4/3] overflow-hidden shadow-sm">
                <Image
                  src={introImage1Url}
                  alt="Company introduction"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          )}
          <Reveal className="w-full md:w-1/2" delay={120}>
            <div className="space-y-4">
              {introText1 && (
                <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600">
                  {renderRichText(introText1)}
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* Row 2: Next 2 paragraphs (left) + Image (right) */}
        {introImage2Url && introText2 && (
          <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center mt-16">
            <Reveal className="w-full md:w-1/2">
              <div className="relative w-full aspect-[4/3] overflow-hidden shadow-sm">
                <Image
                  src={introImage2Url}
                  alt="Company introduction"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            </Reveal>
            <Reveal className="w-full md:w-1/2" delay={120}>
              <div className="space-y-4">
                <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600">
                  {renderRichText(introText2)}
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>

      {/* ─── 2. Video Section ────────────────────────────────────── */}
      {videoUrl && (
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 border-t border-neutral-100">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight text-center mb-12">
              {videoTitle}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="relative w-full max-w-4xl mx-auto shadow-lg" style={{ aspectRatio: '16 / 9' }}>
              <iframe
                src={videoUrl}
                title={videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </Reveal>
        </div>
      )}

      {/* ─── 3. Office Locations ─────────────────────────────────── */}
      {offices.length > 0 && <OfficeLocations offices={offices} title="Our Offices" />}

      {/* ─── 4. Explore More ────────────────────────────────────── */}
      {exploreCards.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 border-t border-neutral-100">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight text-center mb-12">
              Explore More
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exploreCards.map((card: any, idx: number) => {
              const iconUrl = card.icon ? getStrapiImage(card.icon, '') : null;
              return (
                <Reveal key={idx} delay={idx * 100}>
                  <Link
                    href={card.link || '#'}
                    className="group block bg-white border border-sky-100 p-8 hover:shadow-md hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-600 focus-visible:outline-offset-2 transition-all duration-300"
                  >
                    {iconUrl && (
                      <div className="w-12 h-12 mb-4 flex items-center justify-center">
                        <Image
                          src={iconUrl}
                          alt=""
                          width={48}
                          height={48}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-medium text-neutral-950 group-hover:text-sky-600 transition-colors">
                      {card.title}
                    </h3>
                    {card.description && (
                      <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
                        {card.description}
                      </p>
                    )}
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── 5. CTA ──────────────────────────────────────────────── */}
      {ctaText && ctaLink && (
        <div className="bg-sky-600 text-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Link
              href={ctaLink}
              className="inline-block border-2 border-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-white hover:text-sky-600 focus-visible:bg-white focus-visible:text-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}