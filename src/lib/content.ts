import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { refId } from './ids.mjs';

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
  // An empty slot (added in the CMS without picking an artwork) is skipped, not an error.
  const ids = work.data.artworks.map(({ artwork }) => refId(artwork)).filter((id) => id !== undefined);
  return Promise.all(
    ids.map(async (id) => (await getEntry('artworks', id)) ?? missing('artworks', id, `Series "${work.id}"`)),
  );
}

/**
 * Homepage images with their link resolved.
 *
 * A link to a file that doesn't exist fails the build. Images of a hidden series
 * are left off the homepage, so hiding a series in the CMS hides it everywhere.
 * A link to an artwork that isn't in the linked series goes to the series page
 * without jumping to the artwork. Both of those log a warning in the build.
 */
export async function getHomepageImages() {
  const homepage = await getEntry('homepage', 'featured');
  if (!homepage) throw new Error('src/content/homepage/featured.yaml is missing.');

  const items = await Promise.all(
    homepage.data.images.map(async (item, i) => {
      const where = `Homepage image ${i + 1} (${item.alt || item.image})`;
      const workId = refId(item.workSlug);
      let artworkId = refId(item.artworkId);
      if (artworkId && !(await getEntry('artworks', artworkId))) missing('artworks', artworkId, where);
      if (!workId) return { ...item, href: undefined };

      const work = (await getEntry('works', workId)) ?? missing('works', workId, where);
      if (work.data.hidden) {
        console.warn(`${where} is left off the homepage because series "${workId}" is hidden.`);
        return null;
      }
      if (artworkId && !work.data.artworks.some(({ artwork }) => refId(artwork) === artworkId)) {
        console.warn(`${where} links to artwork "${artworkId}", which isn't in series "${workId}".`);
        artworkId = undefined;
      }
      return { ...item, href: `/work/${workId}/${artworkId ? `#${artworkId}` : ''}` };
    }),
  );
  return items.filter((item) => item !== null);
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
