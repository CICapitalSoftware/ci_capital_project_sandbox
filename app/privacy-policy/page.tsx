// app/privacy-policy/page.tsx

// ─── Custom rich text renderer ──────────────────────────────
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
async function getPrivacyPolicy() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/privacy-policy?populate=*`,
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
export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicy();

  const title = data?.title || 'Privacy Policy';
  const sections = data?.sections || []; // 👈 use the new repeatable component
  const lastUpdated = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mb-4">
        {title}
      </h1>
      <div className="h-1 w-16 bg-sky-600 mb-8" />
      <p className="text-sm text-neutral-500 mb-8">
        Last updated: {lastUpdated}
      </p>

      {sections.length > 0 ? (
        <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600 prose-p:text-neutral-700 prose-p:leading-relaxed">
          {sections.map((section: any, idx: number) => {
            const sectionTitle = section.title || '';
            const sectionContent = section.content || null;
            return (
              <div key={idx} className="mb-8">
                {sectionTitle && (
                  <h2 className="text-2xl md:text-3xl font-light text-neutral-950 tracking-tight mt-8 mb-4">
                    {sectionTitle}
                  </h2>
                )}
                {sectionContent && renderRichText(sectionContent)}
              </div>
            );
          })}
        </div>
      ) : (
        // Fallback: if no sections, try to use the old `content` field
        data?.content ? (
          <div className="prose prose-lg max-w-none prose-headings:font-light prose-headings:tracking-tight prose-a:text-sky-600 prose-p:text-neutral-700 prose-p:leading-relaxed">
            {renderRichText(data.content)}
          </div>
        ) : (
          <p className="text-neutral-500">Content not available. Please add sections in Strapi.</p>
        )
      )}
    </section>
  );
}