import { defineCollection, z } from 'astro:content';

// Schema for individual artworks
// Note: The artwork ID is derived from the filename (e.g., my-artwork.yaml -> id: my-artwork)
// The 'id' field in YAML is optional and kept for backwards compatibility
const artworksCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string().optional(), // Optional - filename is used as primary identifier
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
    artworks: z.array(z.object({
      artwork: z.string(), // Reference path like "src/content/artworks/artwork-id"
    })), // Array of artwork references
    order: z.number().optional(), // Display order on /work page (lower = first)
    hidden: z.boolean().optional(), // Hide this series from the public site
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

// Schema for about page
const aboutCollection = defineCollection({
  type: 'data',
  schema: z.object({
    heroImage: z.string(),
    heroImageAlt: z.string().optional(),
    bio: z.string(),
    secondImage: z.string().optional(),
    secondImageAlt: z.string().optional(),
    education: z.array(z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.number(),
    })).optional(),
    soloExhibitions: z.array(z.object({
      title: z.string(),
      venue: z.string(),
      year: z.number(),
    })).optional(),
    publicArtworks: z.array(z.object({
      title: z.string(),
      venue: z.string(),
      note: z.string().optional(),
      collaborator: z.string().optional(),
      year: z.number(),
    })).optional(),
  }),
});

// Schema for contact page
const contactCollection = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    imageAlt: z.string().optional(),
    body: z.string(),
    email: z.string().optional(),
    instagram: z.string().optional(),
  }),
});

export const collections = {
  'artworks': artworksCollection,
  'works': worksCollection,
  'homepage': homepageCollection,
  'about': aboutCollection,
  'contact': contactCollection,
};
