// app/about/our-people/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';

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
  const person = await getPerson(slug);

  if (!person) return notFound();

  const attrs = person.attributes;
  const imageUrl = attrs.image ? getStrapiImage(attrs.image, '') : null;

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      <Link
        href="/about/our-people"
        className="text-sky-600 hover:text-sky-700 text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2"
      >
        ← Back to Our People
      </Link>

      <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        {imageUrl && (
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 shadow-md">
            <img
              src={imageUrl}
              alt={attrs.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight">
            {attrs.name}
          </h1>
          <p className="text-lg text-neutral-600 mt-1">{attrs.title}</p>
          {attrs.bio && (
            <div
              className="mt-6 text-neutral-700 text-base leading-relaxed prose prose-gray max-w-none"
              dangerouslySetInnerHTML={{ __html: attrs.bio }}
            />
          )}
        </div>
      </div>
    </article>
  );
}