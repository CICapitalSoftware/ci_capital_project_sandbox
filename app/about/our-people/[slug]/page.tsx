// app/about/our-people/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';
// import ProfileImage from '@/components/ProfileImage'; // Removed

// ─── Rich text renderer ──────────────────────────────────────────
function renderRichText(content: any[]) {
  if (!content) return null;
  return content.map((block, index) => {
    if (block.type === 'paragraph') {
      const text = block.children.map((child: any) => child.text || '').join('');
      return (
        <p key={index} className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">
          {text}
        </p>
      );
    }
    if (block.type === 'list' && block.format === 'unordered') {
      const items = block.children.map((item: any) => {
        const itemText = item.children.map((c: any) => c.text || '').join('');
        return (
          <li key={item.id} className="text-neutral-700 text-base md:text-lg leading-relaxed">
            {itemText}
          </li>
        );
      });
      return <ul key={index} className="list-disc pl-6 mb-4 space-y-1">{items}</ul>;
    }
    return null;
  });
}

// ─── Fetch person data ──────────────────────────────────────────
async function getPerson(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/people?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

// ─── Fetch all people for sidebar ────────────────────────────────
async function getAllPeople() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/people?populate=*&sort=displayOrder:asc`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/people?fields[0]=slug&pagination[limit]=100`
    );
    const json = await res.json();
    return json.data.map((item: any) => ({
      slug: item.attributes.slug,
    }));
  } catch {
    return [];
  }
}

export default async function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [person, allPeople] = await Promise.all([getPerson(slug), getAllPeople()]);

  if (!person) return notFound();

  const attrs = person.attributes || person;
  const name = attrs.name || 'Unnamed';
  const title = attrs.title || '';
  const bio = attrs.bio;
  const category = attrs.category || '';

  const categoryLabel = category === 'board-of-directors' ? 'Board of Directors' :
                        category === 'executive-management' ? 'Executive Management' :
                        'Leadership';

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* ─── Sidebar ────────────────────────────────────────────── */}
        <aside className="lg:col-span-1 pl-0">
          <nav className="sticky top-24">
            <h3 className="text-lg font-bold uppercase tracking-wider text-sky-600 mb-4">
              Executive Biographies
            </h3>
            <ul className="space-y-3">
              {allPeople.map((p: any) => {
                const a = p.attributes || p;
                const isActive = a.slug === slug;
                return (
                  <li key={a.slug}>
                    <Link
                      href={`/about/our-people/${a.slug}`}
                      className={`text-sm transition-colors ${
                        isActive
                          ? 'font-bold text-sky-600'
                          : 'text-neutral-600 hover:text-sky-600'
                      }`}
                    >
                      {a.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* ─── Main Content ────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          {/* Back link (mobile) */}
          <Link
            href="/about/our-people"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-sky-600 transition-colors group lg:hidden mb-8"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Our People
          </Link>

          {/* Category label */}
          <p className="text-sm font-medium text-neutral-400 uppercase tracking-wider mb-2">
            {categoryLabel}
          </p>

          {/* ─── Name + Title ────────────────────────────────────── */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-950 tracking-tight leading-tight">
              {name}
            </h1>
            {title && (
              <p className="text-xl md:text-2xl font-light text-neutral-600 mt-4">
                {title}
              </p>
            )}
          </div>

          {/* ─── Bio text ──────────────────────────────────────────── */}
          <div className="mt-8 prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600 prose-p:text-neutral-700 prose-p:leading-relaxed prose-ul:text-neutral-700">
            {bio ? (
              renderRichText(bio)
            ) : (
              <p className="text-neutral-500 text-lg">No biography available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}