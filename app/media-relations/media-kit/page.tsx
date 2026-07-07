// app/media-relations/media-kit/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { getStrapiImage } from '@/lib/strapi';

async function fetchMediaKitItems() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/media-kit-items?populate=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default function MediaKitPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMediaKitItems().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  const handleDownload = async (imageUrl: string, title: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.png`; // adjust extension if needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-neutral-500">Loading media kit...</p>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-light text-neutral-950 tracking-tight">
          Media Kit
        </h1>
        <p className="text-neutral-500 mt-2">
          Download our official logos and brand assets.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-neutral-500">No media kit items available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item: any) => {
            const attrs = item.attributes || item;
            const imageUrl = attrs.image ? getStrapiImage(attrs.image, '') : null;
            const title = attrs.title || 'Untitled';
            const description = attrs.description || '';

            return (
              <div
                key={item.id}
                className="bg-white border border-sky-100 shadow-sm rounded-none overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col"
              >
                {imageUrl && (
                  <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-light text-neutral-950 tracking-tight">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-sm text-neutral-500 mt-1">{description}</p>
                  )}
                  {imageUrl && (
                    <button
                      onClick={() => handleDownload(imageUrl, title)}
                      className="mt-4 inline-block bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium uppercase tracking-wider px-4 py-2 transition-colors self-start"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}