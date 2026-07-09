// scripts/enhance-strapi-images.mjs
import { config } from 'dotenv';
config({ path: '.env.local' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ENHANCE_API = process.env.ENHANCE_API || 'http://localhost:3000/api/enhance-image';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_TOKEN) {
  console.error('❌ Missing STRAPI_API_TOKEN in .env.local');
  process.exit(1);
}

async function getStrapiMedia() {
  const url = `${STRAPI_URL}/api/upload/files`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch media: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function downloadFile(url) {
  const fullUrl = url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  const res = await fetch(fullUrl);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} from ${fullUrl}`);
  }
  return res.arrayBuffer().then(Buffer.from);
}

async function enhanceImage(buffer, filename) {
  const form = new FormData();
  form.append('image', new Blob([buffer]), filename);

  const res = await fetch(ENHANCE_API, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Enhance failed: ${res.status} ${text}`);
  }
  return res.arrayBuffer().then(Buffer.from);
}

async function uploadToStrapi(buffer, filename) {
  const form = new FormData();
  form.append('files', new Blob([buffer]), filename);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${STRAPI_TOKEN}` },
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json[0];
}

async function main() {
  console.log('🔍 Fetching media from Strapi...');
  const media = await getStrapiMedia();
  console.log(`📸 Found ${media.length} files.`);

  const images = media.filter(f => f.mime && f.mime.startsWith('image/'));
  console.log(`🖼️ Filtered to ${images.length} images.`);

  let success = 0, fail = 0;
  const delay = (ms) => new Promise(r => setTimeout(r, ms));

  for (const file of images) {
    console.log(`\n🔄 Processing: ${file.name}`);
    try {
      const original = await downloadFile(file.url);
      console.log(`   ⬆ Enhancing...`);
      let enhanced;
      try {
        enhanced = await enhanceImage(original, file.name);
      } catch (enhanceError) {
        console.warn(`   ⚠️ Enhancement failed, using original image`);
        enhanced = original; // fallback: keep the original
      }
      const newName = `hd_${file.name}`;
      console.log(`   📤 Uploading as ${newName}...`);
      const uploaded = await uploadToStrapi(enhanced, newName);
      console.log(`   ✅ Uploaded: ${uploaded.url}`);
      success++;
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
      fail++;
    }
    await delay(2000);
  }

  console.log(`\n🎉 Done! Success: ${success}, Failed: ${fail}`);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});