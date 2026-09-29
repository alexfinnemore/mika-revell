import { test, expect } from './fixtures';
import { pages, hiddenWorks, publicWriting, loadAllImages } from './pages';

test.describe('every page', () => {
  for (const { name, path } of pages) {
    test(`${name} loads cleanly`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
      page.on('pageerror', (err) => errors.push(err.message));

      const response = await page.goto(path);
      expect(response?.status(), `${path} status`).toBe(200);
      await expect(page).toHaveTitle(/Mika Revell/);
      await expect(page.locator('h1'), 'one h1 per page').toHaveCount(1);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description?.length ?? 0, 'meta description of at least 50 characters').toBeGreaterThanOrEqual(50);

      await loadAllImages(page);
      const images = await page.locator('main img').evaluateAll((imgs) =>
        imgs.map((img) => ({
          src: (img as HTMLImageElement).currentSrc,
          hasAlt: img.hasAttribute('alt'),
          loaded: (img as HTMLImageElement).naturalWidth > 0,
        })),
      );
      for (const img of images) {
        expect(img.hasAlt, `alt attribute on ${img.src}`).toBe(true);
        expect(img.loaded, `image loaded: ${img.src}`).toBe(true);
      }

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'no sideways scrolling').toBeLessThanOrEqual(0);

      expect(errors, 'console errors').toEqual([]);
    });
  }
});

test('every internal link works', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const { path } of pages) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
    hrefs.forEach((h) => seen.add(h));
  }
  for (const href of seen) {
    const [pathname, hash] = href.split('#');
    const response = await request.get(pathname);
    expect(response.status(), `link ${href}`).toBe(200);
    if (hash) {
      await page.goto(pathname);
      await expect(page.locator(`[id="${hash}"]`), `anchor ${href}`).toHaveCount(1);
    }
  }
});

test('hidden series have no page', async ({ request }) => {
  for (const work of hiddenWorks) {
    const response = await request.get(`/work/${work.id}/`);
    expect(response.status(), `/work/${work.id}/`).toBe(404);
  }
});

test('writing appears in the menu only when there is some', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('nav a[href="/writing/"]');
  await expect(link.first()).toHaveCount(publicWriting.length ? 1 : 0);
});

test.describe('navigation', () => {
  test('menu reaches every section', async ({ page, isMobile }) => {
    await page.goto('/');
    for (const label of ['About', 'Work', 'Contact']) {
      if (isMobile) await page.getByRole('button', { name: 'Open menu' }).click();
      const menu = page.locator(isMobile ? '#mobile-menu' : '#desktop-nav');
      await menu.getByRole('link', { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`/${label.toLowerCase()}/?$`));
    }
  });

  test('mobile menu opens and closes', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'phone only');
    await page.goto('/');
    const button = page.getByRole('button', { name: 'Open menu' });
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});

test('homepage images link into their series', async ({ page }) => {
  await page.goto('/');
  const hrefs = await page.locator('main a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of hrefs) expect(href).toMatch(/^\/work\/[a-z0-9-]+(\/)?(#[a-z0-9-]+)?$/);
});

test('artwork captions show on hover or tap', async ({ page, isMobile }) => {
  await page.goto('/work/cruise-control/');
  const artwork = page.locator('figure.artwork').first();
  const caption = artwork.locator('figcaption');
  await expect(caption).toHaveCSS('opacity', '0');
  if (isMobile) await artwork.tap();
  else await artwork.hover();
  await expect(caption).toHaveCSS('opacity', '1');
  if (isMobile) {
    // A second tap hides it again.
    await artwork.tap();
    await expect(caption).toHaveCSS('opacity', '0');
  }
});

test('contact form is labelled and posts to Formspree', async ({ page }) => {
  await page.goto('/contact/');
  const form = page.locator('form');
  await expect(form).toHaveAttribute('action', /formspree\.io/);
  for (const label of ['Name', 'Email', 'Message']) {
    await expect(page.getByLabel(label)).toHaveAttribute('required', '');
  }
});

test('about page shows the CV', async ({ page }) => {
  await page.goto('/about/');
  for (const heading of ['Education', 'Selected Public Artworks', 'Solo Exhibitions']) {
    await expect(page.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('the CMS editor loads', async ({ request }) => {
  const response = await request.get('/admin/index.html');
  expect(response.status()).toBe(200);
});
