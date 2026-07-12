// lib/strapi.ts
export const getStrapiImage = (imageObj: any, fallback: string = ''): string => {
  if (!imageObj) return fallback;
  if (typeof imageObj === 'string') return imageObj;
  if (imageObj.url) {
    if (imageObj.url.startsWith('http')) return imageObj.url;
    return `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageObj.url}`;
  }
  if (imageObj.data) {
    // handle nested data if present
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