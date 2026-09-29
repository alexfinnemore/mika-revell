import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  artworkSchema,
  workSchema,
  homepageSchema,
  aboutSchema,
  contactSchema,
  writingSchema,
} from './content/schemas';

// Each entry's id is its filename without the extension (oil-spill.yaml -> "oil-spill").
// That id is also the page URL for series and writing, and what TinaCMS references point at.
const idFromFilename = ({ entry }: { entry: string }) => entry.replace(/\.(ya?ml|md)$/, '');
const filesIn = (dir: string, pattern = '*.yaml') =>
  glob({ pattern, base: `./src/content/${dir}`, generateId: idFromFilename });
const yamlIn = (dir: string) => filesIn(dir);

export const collections = {
  artworks: defineCollection({ loader: yamlIn('artworks'), schema: artworkSchema }),
  works: defineCollection({ loader: yamlIn('works'), schema: workSchema }),
  homepage: defineCollection({ loader: yamlIn('homepage'), schema: homepageSchema }),
  about: defineCollection({ loader: yamlIn('about'), schema: aboutSchema }),
  contact: defineCollection({ loader: yamlIn('contact'), schema: contactSchema }),
  writing: defineCollection({
    loader: filesIn('writing', '*.md'),
    schema: writingSchema,
  }),
};
