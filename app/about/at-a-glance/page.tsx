// app/about/at-a-glance/page.tsx
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';

// ─── Robust rich text renderer ──────────────────────────────────
function renderRichText(content: any) {
  if (!content) return null;

  if (typeof content === 'string') {
    return (
      <p className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">
        {content}
      </p>
    );
  }

  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === 'paragraph') {
        const text = block.children?.map((child: any) => child.text || '').join('') || '';
        return (
          <p key={index} className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">
            {text}
          </p>
        );
      }
      if (block.type === 'list' && block.format === 'unordered') {
        const items = block.children?.map((item: any) => {
          const itemText = item.children?.map((c: any) => c.text || '').join('') || '';
          return (
            <li key={item.id || index} className="text-neutral-700 text-base md:text-lg leading-relaxed">
              {itemText}
            </li>
          );
        }) || [];
        return <ul key={index} className="list-disc pl-6 mb-4 space-y-1">{items}</ul>;
      }
      return null;
    });
  }

  return null;
}

// ─── Fetch data ──────────────────────────────────────────────────
async function getAboutPage() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-page?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      console.error('❌ Failed to fetch about-page:', res.status);
      return null;
    }
    const json = await res.json();
    console.log('📦 About page data:', JSON.stringify(json, null, 2));
    
    const attrs = json.data?.attributes || json.data;
    return attrs || null;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return null;
  }
}

// ─── Page Component ──────────────────────────────────────────────
export default async function AtAGlancePage() {
  const data = await getAboutPage();

  // Fallback content
  const heroTitle = data?.heroTitle || 'At a Glance';
  const heroSubtitle = data?.heroSubtitle || 'Building a better future';
  const heroImage = data?.heroImage || null;
  const stats = data?.stats || [];
  const introTitle = data?.introTitle || '';
  const introText = data?.introText || null;
  const globalPresenceTitle = data?.globalPresenceTitle || '';
  const globalPresenceText = data?.globalPresenceText || null;
  const highlights = data?.highlightCards || [];
  const ctaText = data?.ctaText || '';
  const ctaLink = data?.ctaLink || '';

  // Get the hero image URL
  const heroImageUrl = heroImage ? getStrapiImage(heroImage, '') : null;

  return (
    <section className="w-full bg-white">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden bg-sky-700 flex items-center justify-center">
        {heroImageUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
          />
        )}
        {/* Overlay – reduces opacity for better text contrast */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Content – centered over the image */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight">
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="text-lg md:text-xl text-white/80 mt-4 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* ─── Stats ────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat: any, idx: number) => (
              <div
                key={idx}
                className="bg-white shadow-lg border border-sky-100 p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-sky-600">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Intro ────────────────────────────────────────────────── */}
      {(introTitle || introText) && (
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          {introTitle && (
            <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight mb-4">
              {introTitle}
            </h2>
          )}
          {introText && (
            <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600">
              {renderRichText(introText)}
            </div>
          )}
        </div>
      )}

      {/* ─── Global Presence ──────────────────────────────────────── */}
      {(globalPresenceTitle || globalPresenceText) && (
        <div className="bg-neutral-50 py-16 md:py-20 border-t border-neutral-100">
          <div className="max-w-4xl mx-auto px-6">
            {globalPresenceTitle && (
              <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight mb-4">
                {globalPresenceTitle}
              </h2>
            )}
            {globalPresenceText && (
              <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600">
                {renderRichText(globalPresenceText)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Highlight Cards ──────────────────────────────────────── */}
      {highlights.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((card: any, idx: number) => {
              const iconUrl = card.icon ? getStrapiImage(card.icon, '') : null;
              return (
                <Link
                  key={idx}
                  href={card.link || '#'}
                  className="group block bg-white border border-sky-100 p-8 hover:shadow-md transition-shadow duration-300"
                >
                  {iconUrl && (
                    <div className="w-12 h-12 mb-4 flex items-center justify-center">
                      <img
                        src={iconUrl}
                        alt={card.title}
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
              );
            })}
          </div>
        </div>
      )}

      {/* ─── CTA ────────────────────────────────────────────────────── */}
      {ctaText && ctaLink && (
        <div className="bg-sky-600 text-white py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Link
              href={ctaLink}
              className="inline-block border-2 border-white px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-white hover:text-sky-600 transition-colors"
            >
              {ctaText}
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}