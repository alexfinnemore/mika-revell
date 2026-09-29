// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { IMAGE_WIDTHS } from './src/lib/ids.mjs';

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
      // Each width and format is a separately billed transformation.
      sizes: IMAGE_WIDTHS,
      domains: ['pbj78tn8g5vmaowa.public.blob.vercel-storage.com'],
      // One format keeps billed transformations down. AVIF is the smallest; the
      // few browsers without it get the original file.
      formats: ['image/avif'],
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
