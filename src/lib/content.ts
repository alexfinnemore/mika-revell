import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

// TinaCMS stores references as repo paths ("src/content/artworks/oil-spill" or
// ".../oil-spill.yaml"). The entry id is the filename without its extension.
export function refId(ref: string | undefined): string | undefined {
  return ref?.split('/').pop()?.replace(/\.(ya?ml|md)$/, '') || undefined;
}

// A broken reference fails the build with the file to fix, rather than
// quietly dropping an artwork from the live site.
function missing(kind: string, id: string, where: string): never {
  throw new Error(
    `${where} links to ${kind} "${id}", but src/content/${kind}/${id}.yaml doesn't exist. ` +
      `Fix or remove that link (in the CMS or the YAML file).`,
  );
}

const byOrder = (a: { data: { order?: number } }, b: { data: { order?: number } }) =>
  (a.data.order ?? 999) - (b.data.order ?? 999);

/** Series shown on the site, in display order. Hidden series get no page at all. */
export async function getPublicWorks() {
  const works = await getCollection('works', ({ data }) => !data.hidden);
  return works.sort(byOrder);
}

/** The artworks in a series, in the order the series lists them. */
export async function getWorkArtworks(work: CollectionEntry<'works'>) {
  return Promise.all(
    work.data.artworks.map(async ({ artwork }) => {
      const id = refId(artwork)!;
      return (await getEntry('artworks', id)) ?? missing('artworks', id, `Series "${work.id}"`);
    }),
  );
}

/** Homepage images with their link resolved. Links to hidden or missing series fail the build. */
export async function getHomepageImages() {
  const homepage = await getEntry('homepage', 'featured');
  if (!homepage) throw new Error('src/content/homepage/featured.yaml is missing.');
  const publicIds = new Set((await getPublicWorks()).map((w) => w.id));

  return Promise.all(
    homepage.data.images.map(async (item, i) => {
      const where = `Homepage image ${i + 1} (${item.alt || item.image})`;
      const workId = refId(item.workSlug);
      const artworkId = refId(item.artworkId);
      if (workId && !(await getEntry('works', workId))) missing('works', workId, where);
      if (workId && !publicIds.has(workId)) {
        throw new Error(`${where} links to series "${workId}", which is hidden.`);
      }
      if (artworkId && !(await getEntry('artworks', artworkId))) missing('artworks', artworkId, where);
      const href = workId ? `/work/${workId}${artworkId ? `#${artworkId}` : ''}` : undefined;
      return { ...item, href };
    }),
  );
}

/** Pages of writing shown on the site, newest or lowest `order` first. */
let writing: Promise<CollectionEntry<'writing'>[]> | undefined;
export function getPublicWriting() {
  // Cached during a build: the menu asks on every page, and an empty collection
  // logs a warning each time. Not cached in dev, so new writing shows up at once.
  if (import.meta.env.DEV) writing = undefined;
  writing ??= getCollection('writing', ({ data }) => !data.hidden).then(sortWriting);
  return writing;
}

function sortWriting(pieces: CollectionEntry<'writing'>[]) {
  return pieces.sort(
    (a, b) =>
      byOrder(a, b) || (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0),
  );
}
