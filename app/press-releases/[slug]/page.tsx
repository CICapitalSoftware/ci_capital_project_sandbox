// app/press-releases/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';

async function getPressRelease(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/press-releases/${id}?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return null;
  }
}

export default async function PressReleasePage({ params }: { params: { slug: string } }) {
  const id = params.slug;

  if (!id || id === '') {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-light">Missing ID</h1>
        <p className="text-neutral-500 mt-2">The URL is missing an ID. Please check the link.</p>
        <Link href="/" className="text-sky-600 hover:text-sky-700 mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const release = await getPressRelease(id);
  if (!release) return notFound();

  const attrs = release.attributes;
  const { title, content, date, category, image } = attrs;

  const imageUrl = image ? getStrapiImage(image, '') : null;
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <article className="max-w-4xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/"
        className="text-sky-600 hover:text-sky-700 text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2"
      >
        ← Back to Home
      </Link>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-light text-neutral-950 tracking-tight mt-6">
        {title || 'Untitled'}
      </h1>

      {/* Date & Category */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-500">
        {formattedDate && <span>{formattedDate}</span>}
        {category && (
          <span className="bg-sky-50 text-sky-700 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
            {category}
          </span>
        )}
      </div>

      {/* Featured image */}
      {imageUrl && (
        <div className="mt-8 mb-10">
          <img
            src={imageUrl}
            alt={title || 'Press release'}
            className="w-full h-auto max-h-[500px] object-cover border border-neutral-100"
          />
        </div>
      )}

      {/* Content – manual renderer (no package needed) */}
      {content ? (
        <div className="prose prose-lg max-w-none">
          {content.map((block: any, index: number) => {
            if (block.type === 'paragraph') {
              const text = block.children.map((child: any) => child.text || '').join('');
              return (
                <p key={index} className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">
                  {text}
                </p>
              );
            }
            // Add more block types if needed (headings, lists, images)
            return null;
          })}
        </div>
      ) : (
        <div className="text-neutral-500 bg-neutral-50 border border-neutral-200 p-8 text-center">
          <p className="text-lg">This press release has no content yet.</p>
          <p className="text-sm mt-2">
            Add content to the <code className="bg-neutral-100 px-2 py-1 rounded">content</code> field in Strapi and publish.
          </p>
        </div>
      )}
    </article>
  );
}