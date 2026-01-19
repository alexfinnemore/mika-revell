import { defineCollection, z } from 'astro:content';

// Schema for individual artworks
const artworksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    year: z.number().optional(),
    image: z.string(), // URL to image (Vercel Blob or local)
    description: z.string().optional(),
  }),
});

// Schema for work series/bodies of work
const worksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    subtitle: z.string().optional(), // e.g. "BRUTAL. Gallery - Cape Town"
    year: z.number().optional(),
    description: z.string().optional(),
    coverImage: z.string(),
    artworks: z.array(z.string()), // Array of artwork IDs
  }),
});

// Schema for homepage featured images
const homepageCollection = defineCollection({
  type: 'data',
  schema: z.object({
    images: z.array(z.object({
      image: z.string(),
      alt: z.string().optional(),
      workSlug: z.string().optional(),
      artworkId: z.string().optional(),
    })),
  }),
});

export const collections = {
  'artworks': artworksCollection,
  'works': worksCollection,
  'homepage': homepageCollection,
};
