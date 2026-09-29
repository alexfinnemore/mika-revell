// Screenshot comparison for every page on desktop and phone. A change that
// alters how a page looks fails here until someone reviews the difference and
// accepts it with `npm run test:update-screenshots`. See AGENTS.md.
//
// Artwork photos are masked (drawn as solid blocks): locally they are the
// original files, on Vercel they are resized copies, so their pixels never
// match exactly. The blocks still show each image's size and position, and
// site.spec.ts checks that every image actually loads.
import { test, expect } from '@playwright/test';
import { pages, loadAllImages } from './pages';

for (const { name, path } of pages) {
  test(`${name} looks right @visual`, async ({ page }) => {
    await page.goto(path);
    await loadAllImages(page);
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      mask: [page.locator('main img')],
    });
  });
}
