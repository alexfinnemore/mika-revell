// Records the width and height of every image the content links to, in
// src/data/image-dimensions.json, so pages can reserve space before images load.
//
// Only images not already in the file are fetched (and only their headers), so
// this is quick to run on every build. Images no longer used are dropped.
//
//   npm run images:dimensions
import fs from 'node:fs';
import path from 'node:path';
import probe from 'probe-image-size';

const OUT = 'src/data/image-dimensions.json';
const CONTENT = 'src/content';
const URL_RE = /https?:\/\/[^\s"'<>)]+\.(?:jpe?g|png|webp|avif|gif)/gi;

function contentFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return contentFiles(p);
    return /\.(ya?ml|md)$/.test(d.name) ? [p] : [];
  });
}

const urls = new Set(contentFiles(CONTENT).flatMap((f) => fs.readFileSync(f, 'utf8').match(URL_RE) ?? []));
const known = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const todo = [...urls].filter((u) => !known[u]);

const failed = [];
await Promise.all(
  todo.map(async (url) => {
    try {
      const { width, height } = await probe(url, { timeout: 20000 });
      known[url] = { width, height };
    } catch (err) {
      failed.push(`${url} (${err.statusCode ?? err.message})`);
    }
  }),
);

const out = Object.fromEntries([...urls].filter((u) => known[u]).sort().map((u) => [u, known[u]]));
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(`Image dimensions: ${Object.keys(out).length} images, ${todo.length - failed.length} newly measured.`);
if (failed.length) {
  // Not fatal: the page still renders, it just can't reserve space for these.
  console.warn(`Couldn't measure ${failed.length} image(s):\n  ${failed.join('\n  ')}`);
}
