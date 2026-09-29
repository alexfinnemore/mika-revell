// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.mikarevell.com',
  output: 'static',
  // The dev toolbar overlays the page and would show up in screenshot tests.
  devToolbar: { enabled: false },
  // Hidden series and writing get no page, so they never reach the sitemap.
  integrations: [sitemap()],
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      // Must match IMAGE_WIDTHS in src/lib/image.ts. Each width and format is a
      // separately billed transformation, so keep both lists short.
      sizes: [640, 1280, 1920],
      domains: ['pbj78tn8g5vmaowa.public.blob.vercel-storage.com'],
      formats: ['image/webp'],
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
