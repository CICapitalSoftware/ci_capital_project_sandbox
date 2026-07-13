// lib/strapi.ts

export function getStrapiImage(image: any, fallback: string = ''): string {
  if (!image) return fallback;

  // Strapi v5 flat shape: image.url directly
  // Strapi v4 nested shape: image.data.attributes.url
  const url = image?.url || image?.data?.attributes?.url || null;

  if (!url) return fallback;

  // Already absolute (e.g. S3/Cloudinary provider) — return as-is.
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Relative path (local provider, e.g. "/uploads/xyz.jpg") — prefix with Strapi host.
  const base = process.env.NEXT_PUBLIC_STRAPI_URL || '';
  return `${base}${url}`;
}