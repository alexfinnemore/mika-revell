// The test runner with one addition: when testing a protected Vercel preview
// (BASE_URL set and VERCEL_OIDC_TOKEN in .env, from `vercel env pull .env`), send
// Vercel's short-lived token header on requests to that site only, so the tests
// get past the login page without the token going to any other host.
import { test as base, expect } from '@playwright/test';

try {
  process.loadEnvFile('.env');
} catch {
  // No .env: fine for local runs.
}

const BASE_URL = process.env.BASE_URL;
const TOKEN = process.env.VERCEL_OIDC_TOKEN;
const HEADER = 'x-vercel-trusted-oidc-idp-token';
const protectedOrigin = BASE_URL && TOKEN && BASE_URL.includes('.vercel.app') ? new URL(BASE_URL).origin : undefined;

export const test = base.extend({
  context: async ({ context }, use) => {
    if (protectedOrigin) {
      await context.route(`${protectedOrigin}/**`, (route) =>
        route.continue({ headers: { ...route.request().headers(), [HEADER]: TOKEN! } }),
      );
    }
    await use(context);
  },
  request: async ({ playwright, baseURL }, use) => {
    const request = await playwright.request.newContext({
      baseURL,
      extraHTTPHeaders: protectedOrigin ? { [HEADER]: TOKEN! } : undefined,
    });
    await use(request);
    await request.dispose();
  },
});

export { expect };
