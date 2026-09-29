// The site's pages, read from the content files, so new series and writing are
// tested without anyone editing the tests.
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import type { Page } from '@playwright/test';

const CONTENT = path.join(import.meta.dirname, '../../src/content');

function entries(dir: string, ext: string) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(ext))
    .map((f) => {
      const text = fs.readFileSync(path.join(full, f), 'utf8');
      const data = ext === '.md' ? parse(text.split(/^---$/m)[1] ?? '') : parse(text);
      return { id: f.slice(0, -ext.length), data: data ?? {} };
    });
}

export const works = entries('works', '.yaml');
export const publicWorks = works.filter((w) => !w.data.hidden);
export const hiddenWorks = works.filter((w) => w.data.hidden);
export const publicWriting = entries('writing', '.md').filter((w) => !w.data.hidden);

export const pages = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about/' },
  { name: 'contact', path: '/contact/' },
  { name: 'work', path: '/work/' },
  ...publicWorks.map((w) => ({ name: `work-${w.id}`, path: `/work/${w.id}/` })),
  ...(publicWriting.length ? [{ name: 'writing', path: '/writing/' }] : []),
  ...publicWriting.map((w) => ({ name: `writing-${w.id}`, path: `/writing/${w.id}/` })),
];

/** Load every lazy image and wait until all have finished, so screenshots and checks see the whole page. */
export async function loadAllImages(page: Page) {
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((img) => (img.loading = 'eager'));
    await Promise.all(
      imgs.map((img) =>
        img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; }),
      ),
    );
  });
}
