/**
 * Vercel Image Optimization utilities
 *
 * Uses Vercel's /_vercel/image endpoint to:
 * - Resize images on-the-fly
 * - Convert to modern formats (WebP/AVIF)
 * - Cache optimized versions on CDN
 */

interface OptimizedImageOptions {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Generate an optimized image URL using Vercel Image Optimization
 */
export function getOptimizedImageUrl({ src, width, quality = 75 }: OptimizedImageOptions): string {
  // In development, return the original URL (Vercel optimization only works in production)
  if (import.meta.env.DEV) {
    return src;
  }

  // Encode the source URL for the query parameter
  const encodedUrl = encodeURIComponent(src);
  return `/_vercel/image?url=${encodedUrl}&w=${width}&q=${quality}`;
}

/**
 * Generate srcset for responsive images
 * Common breakpoints: 640, 768, 1024, 1280, 1536, 1920
 */
export function generateSrcset(
  src: string,
  widths: number[] = [640, 1024, 1536, 1920],
  quality: number = 75
): string {
  if (import.meta.env.DEV) {
    return src;
  }

  return widths
    .map(w => `${getOptimizedImageUrl({ src, width: w, quality })} ${w}w`)
    .join(', ');
}

/**
 * Get default sizes attribute for responsive images
 */
export function getDefaultSizes(maxWidth: string = '100vw'): string {
  return maxWidth;
}

// Standard image widths for different contexts
export const IMAGE_WIDTHS = {
  thumbnail: [320, 640],
  card: [640, 1024, 1536],
  full: [640, 1024, 1536, 1920],
  hero: [1024, 1536, 1920, 2560],
} as const;
