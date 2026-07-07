// app/media-relations/media-releases/page.tsx
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';

async function getAllPressReleases() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/press-releases?populate=*&sort=date:desc&pagination[limit]=100`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function MediaReleasesPage() {
  const releases = await getAllPressReleases();

  // Group releases by year (from the date field)
  const groupedByYear = releases.reduce((acc: Record<string, any[]>, press: any) => {
    const attrs = press.attributes || press;
    const year = attrs.date ? new Date(attrs.date).getFullYear().toString() : 'Unknown';
    if (!acc[year]) acc[year] = [];
    acc[year].push(press);
    return acc;
  }, {});

  // Sort years descending (newest first)
  const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight">
          All Media Releases
        </h1>
        <p className="text-neutral-500 mt-2">Stay updated with our latest news and announcements.</p>
      </div>

      {releases.length === 0 ? (
        <p className="text-neutral-500">No press releases available.</p>
      ) : (
        <div className="space-y-16">
          {sortedYears.map((year) => {
            const yearReleases = groupedByYear[year];
            return (
              <div key={year}>
                {/* Year header */}
                <h2 className="text-3xl md:text-4xl font-light text-neutral-800 border-b border-neutral-200 pb-4 mb-8">
                  {year}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {yearReleases.map((press: any) => {
                    const attrs = press.attributes || press;
                    const imageSrc = attrs.image ? getStrapiImage(attrs.image, '') : null;
                    const formattedDate = attrs.date
                      ? new Date(attrs.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : null;

                    return (
                      <Link key={press.id} href={`/press-releases/${attrs.slug}`}>
                        <article className="bg-white rounded-none border border-sky-100 shadow-sm flex flex-col overflow-hidden hover:shadow-md hover:border-sky-300 transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
                          {imageSrc && (
                            <div className="h-48 w-full bg-white overflow-hidden">
                              <img
                                src={imageSrc}
                                alt={attrs.title || 'Press release'}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="p-6 flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-center gap-3 mb-2">
                                {attrs.category && (
                                  <span className="text-[10px] font-bold tracking-wider uppercase bg-sky-50 text-sky-700 px-2 py-0.5 rounded-none">
                                    {attrs.category}
                                  </span>
                                )}
                                {formattedDate && (
                                  <span className="text-xs text-neutral-400 font-normal">{formattedDate}</span>
                                )}
                              </div>
                              <h3 className="text-lg font-light text-neutral-950 leading-snug uppercase tracking-tight line-clamp-3 hover:text-neutral-700 transition-colors">
                                {attrs.title}
                              </h3>
                            </div>
                            <div className="pt-4 border-t border-sky-50 mt-4">
                              <span className="text-xs font-bold uppercase tracking-wider text-neutral-950 inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                                Read Report →
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}