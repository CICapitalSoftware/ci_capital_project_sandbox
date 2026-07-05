// lib/strapi.js
export async function fetchFromStrapi(path: string, locale: string = 'en') {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/${path}?populate=*&locale=${locale}`
  );
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const json = await res.json();
  return json.data || [];
}

export const getStrapiImage = (imageObj: any, fallback: string) => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj;
  if (imageObj.url) return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageObj.url}`;
  if (Array.isArray(imageObj) && imageObj[0]?.url)
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageObj[0].url}`;
  return fallback;
};

// lib/strapi.js
export async function fetchHomeHero() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home-hero?populate=*`,
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