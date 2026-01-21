// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static',
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