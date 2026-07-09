// lib/strapi.ts
export async function fetchFromStrapi(path: string, locale: string = 'en') {
  try {
    const res = await fetch(`http://localhost:1337/api/${path}?populate=*&locale=${locale}`);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return [];
  }
}

export const getStrapiImage = (imageObj: any, fallback: string = ''): string => {
  if (!imageObj) return fallback;

  if (typeof imageObj === 'string') return imageObj;

  if (imageObj.url) {
    if (imageObj.url.startsWith('http')) return imageObj.url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageObj.url}`;
  }

  if (imageObj.data) {
    const data = imageObj.data;
    if (Array.isArray(data) && data.length > 0 && data[0].attributes?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${data[0].attributes.url}`;
    }
    if (data.attributes?.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.attributes.url}`;
    }
    if (data.url) {
      return `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.url}`;
    }
  }

  if (Array.isArray(imageObj) && imageObj.length > 0) {
    return getStrapiImage(imageObj[0], fallback);
  }

  return fallback;
};