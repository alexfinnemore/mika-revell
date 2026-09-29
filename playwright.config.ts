import { defineConfig, devices } from '@playwright/test';

// Every test runs twice: on a desktop browser and on a phone. See AGENTS.md.
//
//   npm test                      against the local dev server (started for you)
//   BASE_URL=https://... npm test against a deployed site, e.g. a Vercel preview
const BASE_URL = process.env.BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  // Locally the dev server sends full-size original photos, which take a while to load in parallel.
  timeout: 120_000,
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  snapshotPathTemplate: 'tests/e2e/__screenshots__/{projectName}/{arg}{ext}',
  expect: {
    // Photos are masked, so the only expected noise is anti-aliasing. The limit is
    // tight enough that changing one word of text fails.
    toHaveScreenshot: { maxDiffPixels: 100, animations: 'disabled' },
    // Long pages take a while to settle into a stable screenshot.
    timeout: 30_000,
  },
  use: {
    baseURL: BASE_URL ?? 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      // Uses the installed Google Chrome, so no browser download is needed.
      use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 15'] },
    },
  ],
  webServer: BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:4321',
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
