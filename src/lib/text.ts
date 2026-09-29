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
    if (out && (out + s).trim().length > max) break;
    out += s;
  }
  out = out.trim();
  return out.length > max ? out.slice(0, max - 3).replace(/\s+\S*$/, '') + '...' : out;
}
