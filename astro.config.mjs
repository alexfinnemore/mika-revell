// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.mikarevell.com',
  output: 'static',
  // Keep hidden work series (hidden: true in src/content/works) out of the sitemap
  integrations: [
    sitemap({
      filter: (page) =>
        !['/work/murals/', '/work/tokyo-residency/'].includes(new URL(page).pathname),
    }),
  ],
  adapter: vercel({
    imageService: true,
    imagesConfig: {
      sizes: [640, 1024, 1536, 1920],
      domains: ['pbj78tn8g5vmaowa.public.blob.vercel-storage.com'],
      formats: ['image/avif', 'image/webp'],
    },
  }),
  vite: {
    plugins: [tailwindcss()]
  }
});