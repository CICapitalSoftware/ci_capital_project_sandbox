const STRAPI_URL = "http://localhost:1337/api";

export async function fetchFromStrapi(path: string) {
  try {
    const res = await fetch(`${STRAPI_URL}/${path}?populate=*`);
    const data = await res.json();
    return data.data; // Strapi v5 returns data in a 'data' wrapper
  } catch (error) {
    console.error("Strapi fetch error:", error);
    return null;
  }
}