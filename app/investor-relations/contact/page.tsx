// app/investor-relations/contact/page.tsx
import { getStrapiImage } from '@/lib/strapi';

// ─── Rich text renderer (unchanged) ──────────────────────────
function renderRichText(content: any) {
  if (!content) return null;
  if (typeof content === 'string') {
    return <p className="text-neutral-700 text-base md:text-lg leading-relaxed mb-4">{content}</p>;
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

// ─── Fetch data ──────────────────────────────────────────────
async function getIRContacts() {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/investor-relations-contacts?populate=*`;
    console.log('🔍 Fetching IR contacts from:', url);
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error('❌ Fetch failed:', res.status);
      return null;
    }
    const json = await res.json();
    console.log('✅ API response:', JSON.stringify(json, null, 2));
    const attrs = json.data?.attributes || json.data;
    return attrs || null;
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return null;
  }
}

// ─── Page Component ──────────────────────────────────────────
export default async function IRContactPage() {
  const data = await getIRContacts();

  // If no data, show a debug message
  if (!data) {
    return (
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mb-4">
          Investor Relations Contacts
        </h1>
        <div className="h-1 w-16 bg-sky-600 mb-8" />
        <p className="text-neutral-500">
          No data returned from Strapi. Please ensure the single type is published and the API is accessible.
        </p>
        <p className="text-sm text-neutral-400 mt-4">
          Check the server console for the API response log.
        </p>
      </section>
    );
  }

  const description = data.description || '';
  const email = data.email || '';
  const telephone = data.telephone || '';
  const contactPersons = data.contactPersons || [];

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight mb-4">
        Investor Relations Contacts
      </h1>
      <div className="h-1 w-16 bg-sky-600 mb-8" />

      {/* ─── General Description ────────────────────────────── */}
      {description && (
        <div className="prose prose-lg max-w-none prose-p:text-neutral-700 prose-p:leading-relaxed">
          {renderRichText(description)}
        </div>
      )}

      {/* ─── General Contact Info ────────────────────────────── */}
      {(email || telephone) && (
        <div className="mt-6 space-y-1 text-neutral-700 text-base">
          {email && (
            <p>
              <span className="font-medium">Email:</span>{' '}
              <a href={`mailto:${email}`} className="text-sky-600 hover:underline">
                {email}
              </a>
            </p>
          )}
          {telephone && (
            <p>
              <span className="font-medium">Telephone:</span>{' '}
              <a href={`tel:${telephone.replace(/\s/g, '')}`} className="text-sky-600 hover:underline">
                {telephone}
              </a>
            </p>
          )}
        </div>
      )}

      {/* ─── Contact Persons ──────────────────────────────────── */}
      {contactPersons.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl md:text-3xl font-light text-neutral-950 tracking-tight mb-6">
            Our Investor Relations Team
          </h2>
          <div className="space-y-8">
            {contactPersons.map((person: any, idx: number) => {
              const name = person.name || 'Name';
              const title = person.title || '';
              const personEmail = person.email || '';
              const personPhone = person.phone || '';
              const image = person.image || null;
              const imageUrl = image ? getStrapiImage(image, '') : null;

              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row gap-6 items-start border-b border-neutral-100 pb-6 last:border-0"
                >
                  {imageUrl && (
                    <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-full bg-gray-100 flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-neutral-950">{name}</h3>
                    {title && <p className="text-neutral-600">{title}</p>}
                    <div className="mt-2 space-y-1 text-sm text-neutral-600">
                      {personEmail && (
                        <p>
                          Email:{' '}
                          <a href={`mailto:${personEmail}`} className="text-sky-600 hover:underline">
                            {personEmail}
                          </a>
                        </p>
                      )}
                      {personPhone && (
                        <p>
                          Phone:{' '}
                          <a href={`tel:${personPhone.replace(/\s/g, '')}`} className="text-sky-600 hover:underline">
                            {personPhone}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── If no content at all ───────────────────────────── */}
      {!description && !email && !telephone && contactPersons.length === 0 && (
        <p className="text-neutral-500">No contact information available. Please add content in Strapi.</p>
      )}
    </section>
  );
}