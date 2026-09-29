// Content schemas for the site. TinaCMS describes the same fields in
// tina/config.ts for the editor; `npm run check:schema` fails if the two drift.
//
// Kept in a plain module (not src/content.config.ts) so the schema check script
// can import it outside of Astro.
import { z } from 'astro/zod';

// A TinaCMS reference, stored as a repo path such as
// "src/content/artworks/oil-spill" or "src/content/artworks/oil-spill.yaml".
const reference = z.string();

export const artworkSchema = z.strictObject({
  title: z.string(),
  image: z.string(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  year: z.number().optional(),
  description: z.string().optional(),
});

export const workSchema = z.strictObject({
  title: z.string(),
  subtitle: z.string().optional(),
  year: z.number().optional(),
  description: z.string().optional(),
  coverImage: z.string(),
  artworks: z.array(z.strictObject({ artwork: reference })).default([]),
  order: z.number().optional(),
  hidden: z.boolean().optional(),
});

export const homepageSchema = z.strictObject({
  images: z.array(
    z.strictObject({
      image: z.string(),
      alt: z.string().optional(),
      workSlug: reference.optional(),
      artworkId: reference.optional(),
    }),
  ),
});

export const aboutSchema = z.strictObject({
  heroImage: z.string(),
  heroImageAlt: z.string().optional(),
  bio: z.string(),
  secondImage: z.string().optional(),
  secondImageAlt: z.string().optional(),
  education: z
    .array(z.strictObject({ degree: z.string(), institution: z.string(), year: z.number() }))
    .optional(),
  soloExhibitions: z
    .array(z.strictObject({ title: z.string(), venue: z.string(), year: z.number() }))
    .optional(),
  publicArtworks: z
    .array(
      z.strictObject({
        title: z.string(),
        venue: z.string(),
        note: z.string().optional(),
        collaborator: z.string().optional(),
        year: z.number(),
      }),
    )
    .optional(),
});

export const contactSchema = z.strictObject({
  title: z.string(),
  image: z.string(),
  imageAlt: z.string().optional(),
  body: z.string(),
  email: z.string().optional(),
  instagram: z.string().optional(),
});

// Pages of writing: Markdown files whose frontmatter is below and whose body is the text.
export const writingSchema = z.strictObject({
  title: z.string(),
  subtitle: z.string().optional(),
  date: z.coerce.date().optional(),
  order: z.number().optional(),
  hidden: z.boolean().optional(),
});
