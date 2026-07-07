// app/press-releases/[slug]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getStrapiImage } from '@/lib/strapi';

// ─── Custom rich text renderer ──────────────────────────────────
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
      return <ul key={index} className="list-disc pl-6 mb-4">{items}</ul>;
    }
    return null;
  });
}

// ─── Fetch a single press release by slug ──────────────────────
async function getPressRelease(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/press-releases?filters[slug][$eq]=${slug}&populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data?.[0] || null;
  } catch {
    return null;
  }
}

// ─── Pre‑render all press release pages at build time ─────────
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/press-releases?fields[0]=slug&pagination[limit]=100`
    );
    const json = await res.json();
    return json.data.map((item: any) => ({
      slug: item.attributes?.slug || item.slug,
    }));
  } catch {
    return [];
  }
}

// ─── Page Component ─────────────────────────────────────────────
export default async function PressReleasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-left">
        <h1 className="text-2xl font-light">Missing slug</h1>
        <p className="text-neutral-500">The URL is missing a slug.</p>
        <Link href="/" className="text-sky-600 hover:text-sky-700">← Back to Home</Link>
      </div>
    );
  }

  const release = await getPressRelease(slug);

  if (!release) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-left">
        <h1 className="text-2xl font-light">Press release not found</h1>
        <p className="text-neutral-500">No content found for slug: <code>{slug}</code></p>
        <Link href="/" className="text-sky-600 hover:text-sky-700">← Back to Home</Link>
      </div>
    );
  }

  const attrs = release.attributes || release;
  const { title, content, date, category, image, bullets } = attrs;

  const imageUrl = image ? getStrapiImage(image, '') : null;
  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const bulletPoints = Array.isArray(bullets) ? bullets : [];

  return (
    <article className="max-w-7xl mx-auto px-6 py-16 text-left">
      <Link
        href="/"
        className="text-sky-600 hover:text-sky-700 text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2"
      >
        ← Back to Home
      </Link>

      <div className="mb-8">
        {category && (
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            {category}
          </span>
        )}
        <h1 className="text-3xl md:text-4xl font-light text-neutral-950 tracking-tight mt-2">
          {title || 'Untitled'}
        </h1>
        {formattedDate && (
          <div className="flex items-center gap-4 mt-3 text-neutral-500 text-sm">
            <span>{formattedDate}</span>
          </div>
        )}
      </div>

      {/* ─── Square image – whole image visible ────────────────── */}
      {imageUrl && (
        <div className="mb-8 max-w-sm">
          <div className="aspect-square w-full overflow-hidden rounded-lg border border-neutral-100 shadow-sm">
            <img
              src={imageUrl}
              alt={title || 'Press release'}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {bulletPoints.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Key Highlights</h2>
          <ul className="list-disc pl-6 space-y-2">
            {bulletPoints.map((point: string, idx: number) => (
              <li key={idx} className="text-neutral-700 text-base md:text-lg leading-relaxed">
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {content ? (
        <div className="prose prose-lg max-w-none text-left">
          {renderRichText(content)}
        </div>
      ) : (
        <p className="text-neutral-500">This press release has no content yet.</p>
      )}
    </article>
  );
}