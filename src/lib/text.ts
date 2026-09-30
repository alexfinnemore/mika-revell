/** Markdown reduced to plain text, for meta descriptions: links keep their text, images go. */
export function markdownToText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^\s*(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~]/g, '');
}

/** A date as "September 2026". */
export function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
}

/** Split text from the CMS into paragraphs on blank lines or line breaks. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * A page's meta description from the opening of a text: whole sentences, as
 * many as fit in about 160 characters, which is what search results show.
 */
export function summary(text: string, max = 160): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  const sentences = flat.match(/[^.?!]+[.?!]+["')\]]*(\s|$)/g) ?? [flat];
  let out = '';
  for (const s of sentences) {
    // Stop at a whole sentence, unless what we have is too short to describe the page.
    if (out.trim().length >= 70 && (out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  return out.length > max ? out.slice(0, max - 3).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '...' : out;
}
