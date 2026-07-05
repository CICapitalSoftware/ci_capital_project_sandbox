// app/about/timeline/page.tsx
import { getStrapiImage } from '@/lib/strapi';

// --- Types ---
interface HeroData {
  title: string;
  subtitle?: string;
  image?: any;
  overlayOpacity?: number;
  ctaText?: string;
  ctaLink?: string;
}

interface TimelineItem {
  id: number;
  attributes: {
    date: string;
    description: string;
    category?: string;
    image?: any;
  };
}

// --- Fetch Helpers ---
async function getHero(): Promise<HeroData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/timeline-hero?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Failed to fetch hero');
    const json = await res.json();
    return json.data?.attributes || null;
  } catch (error) {
    console.error('Hero fetch error:', error);
    return null;
  }
}

async function getTimelineItems(): Promise<TimelineItem[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/timeline-items?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error('Failed to fetch timeline');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// --- Helper Functions ---
const getFullYear = (date: string) => {
  if (!date) return '';
  return new Date(date).getFullYear().toString();
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    Milestone: 'text-sky-600',
    Award: 'text-amber-600',
    Expansion: 'text-emerald-600',
    Innovation: 'text-purple-600',
    Partnership: 'text-indigo-600',
  };
  return colors[category] || 'text-neutral-500';
};

// --- Page Component ---
export default async function TimelinePage() {
  const hero = await getHero();
  const items = await getTimelineItems();

  // Group items by year
  const groupedItems = items.reduce((acc: any, item: any) => {
    const attrs = item.attributes || item;
    if (!attrs.date) return acc;
    const year = getFullYear(attrs.date);
    if (!acc[year]) acc[year] = [];
    acc[year].push({ ...item, attributes: attrs });
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedItems).sort((a, b) => parseInt(b) - parseInt(a));
  sortedYears.forEach((year) => {
    groupedItems[year].sort((a: any, b: any) => {
      const dateA = new Date(a.attributes.date);
      const dateB = new Date(b.attributes.date);
      return dateA.getTime() - dateB.getTime();
    });
  });

  const heroImage = hero?.image ? getStrapiImage(hero.image, '') : null;
  const overlayOpacity = hero?.overlayOpacity ?? 40;

  return (
    <section className="relative w-full bg-white">
      {/* ===== HERO SECTION ===== */}
      <div className="relative w-full overflow-hidden">
        {/* Background image with overlay */}
        {heroImage ? (
          <div className="relative h-[60vh] md:h-[70vh] flex items-center">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity / 100 }}
            />
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-white">
              {hero?.title && (
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight mb-4">
                  {hero.title}
                </h1>
              )}
              {hero?.subtitle && (
                <p className="text-lg md:text-xl font-light text-white/80 max-w-2xl">
                  {hero.subtitle}
                </p>
              )}
              {hero?.ctaText && hero?.ctaLink && (
                <div className="mt-8">
                  <a
                    href={hero.ctaLink}
                    className="inline-block bg-white text-neutral-900 px-8 py-3 font-medium uppercase tracking-wider text-sm hover:bg-neutral-100 transition-colors"
                  >
                    {hero.ctaText}
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Fallback hero without image (clean minimal)
          <div className="py-16 md:py-24 bg-neutral-50 border-b border-neutral-200">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl font-light text-neutral-950 tracking-tight">
                {hero?.title || 'Company History'}
              </h1>
              {hero?.subtitle && (
                <p className="text-lg text-neutral-600 mt-4 max-w-2xl">
                  {hero.subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ===== TIMELINE SECTION ===== */}
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {items.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200">
            <p className="text-neutral-500">No timeline items available yet. Add some in Strapi!</p>
          </div>
        ) : (
          <div className="space-y-16 md:space-y-20">
            {sortedYears.map((year) => {
              const yearItems = groupedItems[year];
              return (
                <div key={year} className="relative">
                  <div className="mb-6">
                    <span className="text-5xl md:text-7xl font-light text-neutral-200 tracking-tight select-none">
                      {year}
                    </span>
                  </div>
                  <div className="space-y-8 md:space-y-10 pl-0 md:pl-4">
                    {yearItems.map((item: any, index: number) => {
                      const attrs = item.attributes;
                      const { description, category, image } = attrs;
                      if (!description) return null;
                      const categoryColor = getCategoryColor(category || '');
                      const imageUrl = image ? getStrapiImage(image, '') : null;

                      return (
                        <div
                          key={item.id}
                          className="group animate-fadeIn"
                          style={{ animationDelay: `${index * 80}ms` }}
                        >
                          {category && (
                            <span className={`text-xs font-medium uppercase tracking-wider ${categoryColor} block mb-1`}>
                              {category}
                            </span>
                          )}
                          <div className="text-neutral-700 text-base md:text-lg leading-relaxed max-w-2xl">
                            {description}
                          </div>
                          {imageUrl && (
                            <div className="mt-4 max-w-sm">
                              <img
                                src={imageUrl}
                                alt="Timeline item"
                                className="w-full h-auto object-cover border border-neutral-100"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}