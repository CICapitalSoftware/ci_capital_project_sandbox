// app/about/at-a-glance/page.tsx
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';
import Hero from '@/components/Hero';
import FlipStatCard from '@/components/FlipStatCard';

// ─── Rich text renderer ──────────────────────────────────────
function renderRichText(content: any) {
  if (!content) return null;
  if (typeof content === 'string') {
    return <p className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">{content}</p>;
  }
  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === 'heading') {
        const level = block.level || 2;
        const text = block.children?.map((child: any) => child.text || '').join('') || '';
        const className = `text-${level === 2 ? '2xl' : 'xl'} md:text-${level === 2 ? '3xl' : '2xl'} font-light text-neutral-950 tracking-tight mt-8 mb-4`;
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag key={index} className={className}>{text}</Tag>;
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

// ─── Fetch data ──────────────────────────────────────────────
async function getAboutPage() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-page?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const attrs = json.data?.attributes || json.data;
    return attrs || null;
  } catch {
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
    buttonlink: data?.buttonLink || '#stats',
  };

  const stats = data?.stats || [];
  const contentBlocks = data?.contentBlocks || [];
  const exploreCards = data?.highlightCards || [];
  const defaultImage = data?.defaultImage || null;
  const defaultImageUrl = getStrapiImage(defaultImage, '/placeholder-image.jpg');
  const ctaText = data?.ctaText || '';
  const ctaLink = data?.ctaLink || '';

  return (
    <section className="w-full bg-white">
      {/* ─── Hero ──────────────────────────────────────────────────── */}
      <Hero data={heroData} compact={true} />

      {/* ─── Stats ────────────────────────────────────────────────── */}
      {stats.length > 0 && (
        <div id="stats" className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 scroll-mt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat: any, idx: number) => (
              <FlipStatCard key={idx} stat={stat} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Content Blocks ──────────────────────────────────────── */}
      {contentBlocks.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
          {contentBlocks.map((block: any, idx: number) => {
            const title = block.title || '';
            const text = block.text || null;
            const position = block.imagePosition || 'left';
            const imageUrl = defaultImageUrl;

            if (position === 'full') {
              return (
                <div key={idx} className="space-y-4">
                  {title && (
                    <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight">
                      {title}
                    </h2>
                  )}
                  <div className="w-full overflow-hidden rounded-lg shadow-sm">
                    <img
                      src={imageUrl}
                      alt={title || 'Content image'}
                      className="w-full h-auto max-h-[400px] object-cover"
                    />
                  </div>
                  {text && (
                    <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600">
                      {renderRichText(text)}
                    </div>
                  )}
                </div>
              );
            }

            const isLeft = position === 'left';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}
              >
                <div className="w-full md:w-1/2 overflow-hidden rounded-lg shadow-sm">
                  <img
                    src={imageUrl}
                    alt={title || 'Content image'}
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-3">
                  {title && (
                    <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight">
                      {title}
                    </h2>
                  )}
                  {text && (
                    <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600">
                      {renderRichText(text)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Explore More ────────────────────────────────────────── */}
      {exploreCards.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 border-t border-neutral-100">
          <h2 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight text-center mb-12">
            Explore More
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exploreCards.map((card: any, idx: number) => {
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