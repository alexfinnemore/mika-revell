// Ids and links shared by the site, the CMS config and the scripts.
// Plain JavaScript so every one of them can import it.

/**
 * Turn a title into an id: lowercase words joined by hyphens, accents removed.
 * Ids are filenames, page URLs and what links point at.
 * @param {string | undefined} text
 */
export function slugify(text) {
  return (text || 'untitled')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * The id a TinaCMS link points at. Links are stored as repo paths such as
 * "src/content/artworks/oil-spill" or "src/content/artworks/oil-spill.yaml".
 * @param {string | undefined} ref
 * @returns {string | undefined}
 */
export function refId(ref) {
  return ref?.split('/').pop()?.replace(/\.(ya?ml|md)$/, '') || undefined;
}

/**
 * Widths the site asks Vercel to resize images to. Used by astro.config.mjs
 * (which images Vercel may produce) and src/lib/image.ts (which ones pages
 * request). Each width is billed separately, so keep the list short.
 */
export const IMAGE_WIDTHS = [640, 1280, 1920];
