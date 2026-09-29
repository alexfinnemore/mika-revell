// Adds a folder of images to the site as artworks in a series.
//
//   npm run images:import -- <folder> --series <series-id> [options]
//
// For each image, in filename order (prefix files 01-, 02-, ... to set the order):
//   1. uploads it to Vercel Blob as <series-id>/<artwork-id>.<ext>
//   2. creates src/content/artworks/<artwork-id>.yaml with a title from the filename
//   3. adds it to the end of the series, creating the series if it doesn't exist
// then records the new images' dimensions.
//
// Options:
//   --series <id>     Series to add to, e.g. cruise-control. Required.
//   --title "..."     Title for a new series. Required when the series doesn't exist yet.
//   --year <year>     Year for new artworks (and a new series).
//   --medium "..."    Medium for new artworks, e.g. "Oil on canvas".
//   --dry-run         Show what would happen without uploading or writing anything.
//
// New series are created hidden, so nothing half-finished goes live. Unhide it in
// the CMS (or remove `hidden: true`) once the titles and text are right.
//
// Needs BLOB_READ_WRITE_TOKEN in .env (run `vercel env pull .env`).
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { execFileSync } from 'node:child_process';
import { parseDocument } from 'yaml';
import { slugify } from '../src/lib/ids.mjs';

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;
const ARTWORKS = 'src/content/artworks';
const WORKS = 'src/content/works';

const { values: opts, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    series: { type: 'string' },
    title: { type: 'string' },
    year: { type: 'string' },
    medium: { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
});

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

const folder = positionals[0];
const seriesId = opts.series;
const dryRun = opts['dry-run'];
const year = opts.year ? Number(opts.year) : undefined;
if (!folder || !seriesId) fail('Usage: npm run images:import -- <folder> --series <series-id> [--title "..."] [--year 2025] [--medium "..."] [--dry-run]');
if (!fs.existsSync(folder)) fail(`Folder not found: ${folder}`);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(seriesId)) fail(`Series id "${seriesId}" should be lowercase words joined by hyphens, e.g. "softcore-war".`);
if (opts.year && !Number.isInteger(year)) fail(`--year should be a number, got "${opts.year}".`);

// "03-mushroom_cloud (pink).jpg" -> "Mushroom Cloud (Pink)"
const titleFromFilename = (file) =>
  path
    .parse(file)
    .name.replace(/^\d+[\s._-]+/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    // Capitalize the start of each word, but not the letter after an apostrophe ("I'm", "Girl's").
    .replace(/(^|[\s(])(\p{L})/gu, (_, before, letter) => before + letter.toUpperCase());

const files = fs
  .readdirSync(folder)
  .filter((f) => IMAGE_EXT.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (!files.length) fail(`No images (jpg, png, webp, avif, gif) in ${folder}`);

// Plan everything before changing anything, so a clash stops the import cleanly.
const plan = files.map((file) => {
  const title = titleFromFilename(file);
  const id = slugify(title);
  const ext = path.extname(file).toLowerCase().replace('.jpeg', '.jpg');
  return { file, title, id, blobPath: `${seriesId}/${id}${ext}`, yamlPath: path.join(ARTWORKS, `${id}.yaml`) };
});
const ids = plan.map((p) => p.id);
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) fail(`Two images would get the same id: ${[...new Set(dupes)].join(', ')}. Rename the files.`);
const clashes = plan.filter((p) => fs.existsSync(p.yamlPath));
if (clashes.length) {
  fail(`These artworks already exist, so nothing was imported:\n  ${clashes.map((p) => p.yamlPath).join('\n  ')}\nRename the image files, or remove them from the folder.`);
}

const seriesPath = path.join(WORKS, `${seriesId}.yaml`);
const seriesExists = fs.existsSync(seriesPath);
if (!seriesExists && !opts.title) fail(`Series "${seriesId}" doesn't exist yet. Pass --title "Series Title" to create it.`);

console.log(`${dryRun ? '[dry run] ' : ''}Importing ${plan.length} image(s) into ${seriesExists ? 'series' : 'NEW hidden series'} "${seriesId}":`);
plan.forEach((p, i) => console.log(`  ${i + 1}. ${p.file}  ->  ${p.id}  ("${p.title}")`));
if (dryRun) process.exit(0);

if (!process.env.BLOB_READ_WRITE_TOKEN) fail('BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env` first.');
const { put } = await import('@vercel/blob');

// Upload everything first and only then write files, so a failed upload leaves the
// repo untouched and the same command can simply be run again (it overwrites the
// uploads from the failed attempt).
for (const p of plan) {
  const blob = await put(p.blobPath, fs.readFileSync(path.join(folder, p.file)), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  p.url = blob.url;
  console.log(`  uploaded ${p.file}`);
}

for (const p of plan) {
  const artwork = { title: p.title, image: p.url, ...(year && { year }), ...(opts.medium && { medium: opts.medium }) };
  const doc = parseDocument('');
  doc.contents = doc.createNode(artwork);
  fs.writeFileSync(p.yamlPath, doc.toString());
}

const refs = plan.map((p) => ({ artwork: `src/content/artworks/${p.id}.yaml` }));
if (seriesExists) {
  const doc = parseDocument(fs.readFileSync(seriesPath, 'utf8'));
  const list = doc.get('artworks');
  if (list && list.items) refs.forEach((r) => list.add(doc.createNode(r)));
  else doc.set('artworks', refs);
  fs.writeFileSync(seriesPath, doc.toString());
} else {
  const series = { title: opts.title, ...(year && { year }), coverImage: plan[0].url, hidden: true, artworks: refs };
  const doc = parseDocument('');
  doc.contents = doc.createNode(series);
  fs.writeFileSync(seriesPath, doc.toString());
}

execFileSync(process.execPath, ['scripts/image-dimensions.mjs'], { stdio: 'inherit' });
console.log(`\nDone. Next: check titles, years and mediums in ${ARTWORKS}/, and the series in ${seriesPath}.`);
if (!seriesExists) console.log('The new series is hidden until you remove `hidden: true`.');
