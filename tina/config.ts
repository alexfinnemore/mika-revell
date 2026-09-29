import { defineConfig, wrapFieldsWithMeta, type TinaField } from "tinacms";
import React from "react";
import { refId, slugify } from "../src/lib/ids.mjs";

// Custom image preview component for external URLs (like Vercel Blob)
const ImageUrlField = wrapFieldsWithMeta<{ input: { value: string; onChange: (value: string) => void; name: string } }>(({ input }) => {
  return React.createElement(
    "div",
    null,
    React.createElement("input", {
      type: "text",
      id: input.name,
      value: input.value || "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => input.onChange(e.target.value),
      style: {
        width: "100%",
        padding: "8px 12px",
        fontSize: "14px",
        border: "1px solid #e1e1e1",
        borderRadius: "4px",
        boxSizing: "border-box" as const,
      },
    }),
    input.value &&
      React.createElement("img", {
        src: input.value,
        alt: "Preview",
        style: {
          maxWidth: "100%",
          maxHeight: "200px",
          marginTop: "8px",
          borderRadius: "4px",
          objectFit: "contain" as const,
        },
        onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
          (e.target as HTMLImageElement).style.display = "none";
        },
      })
  );
});

// Images live in Vercel Blob, so image fields hold a URL (with a preview) rather than an upload.
const imageUrlField = (name: string, label: string, opts: { required?: boolean } = {}): TinaField => ({
  type: "string",
  name,
  label,
  description: "Paste the Vercel Blob URL. Claude uploads new images for you (see AGENTS.md).",
  ...opts,
  ui: { component: ImageUrlField as any },
});

// Filenames become page URLs and the ids other entries link to, so they're
// generated from the title once, when an entry is created, and never renamed.
const filenameFromTitle = {
  readonly: true,
  slugify: (values: { title?: string }) => slugify(values?.title),
};
const labelFromRef = (ref?: string) => refId(ref)?.replace(/-/g, " ") || "New item";

// Pages that are a single document: the editor can change them but not add or delete copies.
const singleDocument = { allowedActions: { create: false, delete: false } };

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "master";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  // Search configuration - only enabled if TINA_SEARCH_TOKEN is available
  ...(process.env.TINA_SEARCH_TOKEN ? {
    search: {
      tina: {
        indexerToken: process.env.TINA_SEARCH_TOKEN,
        stopwordLanguages: ["eng"],
      },
      indexBatchSize: 100,
      maxSearchIndexFieldLength: 200,
    },
  } : {}),

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "artworks",
        label: "Artworks",
        path: "src/content/artworks",
        format: "yaml",
        ui: { filename: filenameFromTitle },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            isTitle: true,
          },
          imageUrlField("image", "Image URL", { required: true }),
          {
            type: "string",
            name: "medium",
            label: "Medium",
          },
          {
            type: "string",
            name: "dimensions",
            label: "Dimensions",
          },
          {
            type: "number",
            name: "year",
            label: "Year",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
        ],
      },
      {
        name: "works",
        label: "Series",
        path: "src/content/works",
        format: "yaml",
        ui: {
          filename: filenameFromTitle,
          router: ({ document }) => `/work/${document._sys.filename}/`,
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle",
          },
          {
            type: "number",
            name: "year",
            label: "Year",
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          imageUrlField("coverImage", "Cover Image URL", { required: true }),
          {
            type: "object",
            name: "artworks",
            label: "Artworks in Series",
            description: "In the order they appear on the page. Drag to reorder.",
            list: true,
            ui: {
              itemProps: (item: { artwork?: string }) => ({ label: labelFromRef(item?.artwork) }),
            },
            fields: [
              {
                type: "reference",
                name: "artwork",
                label: "Artwork",
                collections: ["artworks"],
              },
            ],
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            description: "Lower numbers appear first",
          },
          {
            type: "boolean",
            name: "hidden",
            label: "Hidden",
            description: "Hidden series have no page on the site and don't appear anywhere, including their images on the homepage.",
          },
        ],
      },
      {
        name: "homepage",
        label: "Homepage",
        path: "src/content/homepage",
        format: "yaml",
        ui: { ...singleDocument, router: () => "/" },
        fields: [
          {
            type: "object",
            name: "images",
            label: "Featured Images",
            description: "Shown top to bottom in this order. Drag to reorder.",
            list: true,
            ui: {
              itemProps: (item: { alt?: string; artworkId?: string; image?: string }) => ({
                label: item?.alt || item?.artworkId?.split('/').pop() || (item?.image ? item.image.split('/').pop()?.split('.')[0] : "New Image"),
              }),
            },
            fields: [
              imageUrlField("image", "Image URL", { required: true }),
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
              },
              {
                type: "reference",
                name: "workSlug",
                label: "Work Series",
                description: "The series this image links to (pick from the list)",
                collections: ["works"],
              },
              {
                type: "reference",
                name: "artworkId",
                label: "Artwork",
                description: "Optional: scroll to a specific artwork within the series",
                collections: ["artworks"],
              },
            ],
          },
        ],
      },
      {
        name: "about",
        label: "About",
        path: "src/content/about",
        format: "yaml",
        ui: { ...singleDocument, router: () => "/about/" },
        fields: [
          imageUrlField("heroImage", "Hero Image URL", { required: true }),
          {
            type: "string",
            name: "heroImageAlt",
            label: "Hero Image Alt Text",
          },
          {
            type: "string",
            name: "bio",
            label: "Bio",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          imageUrlField("secondImage", "Second Image URL"),
          {
            type: "string",
            name: "secondImageAlt",
            label: "Second Image Alt Text",
          },
          {
            type: "object",
            name: "education",
            label: "Education",
            list: true,
            fields: [
              {
                type: "string",
                name: "degree",
                label: "Degree",
                required: true,
              },
              {
                type: "string",
                name: "institution",
                label: "Institution",
                required: true,
              },
              {
                type: "number",
                name: "year",
                label: "Year",
                required: true,
              },
            ],
          },
          {
            type: "object",
            name: "soloExhibitions",
            label: "Solo Exhibitions",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "venue",
                label: "Venue",
                required: true,
              },
              {
                type: "number",
                name: "year",
                label: "Year",
                required: true,
              },
            ],
          },
          {
            type: "object",
            name: "publicArtworks",
            label: "Public Artworks",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "venue",
                label: "Venue",
                required: true,
              },
              {
                type: "string",
                name: "note",
                label: "Note",
                description: "Optional note (e.g., award, commission type)",
              },
              {
                type: "string",
                name: "collaborator",
                label: "Collaborator",
              },
              {
                type: "number",
                name: "year",
                label: "Year",
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "contact",
        label: "Contact",
        path: "src/content/contact",
        format: "yaml",
        ui: { ...singleDocument, router: () => "/contact/" },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
            isTitle: true,
          },
          imageUrlField("image", "Image URL", { required: true }),
          {
            type: "string",
            name: "imageAlt",
            label: "Image Alt Text",
          },
          {
            type: "string",
            name: "body",
            label: "Body Text",
            required: true,
            ui: {
              component: "textarea",
            },
          },
          {
            type: "string",
            name: "email",
            label: "Contact Email",
            description: "Email address for inquiries",
          },
          {
            type: "string",
            name: "instagram",
            label: "Instagram Handle",
            description: "Instagram username (without @)",
          },
        ],
      },
      {
        name: "writing",
        label: "Writing",
        path: "src/content/writing",
        format: "md",
        ui: {
          filename: filenameFromTitle,
          router: ({ document }) => `/writing/${document._sys.filename}/`,
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle",
            description: "Optional, e.g. where or for what the text was written",
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            description: "Lower numbers appear first. Leave empty to sort newest first.",
          },
          {
            type: "boolean",
            name: "hidden",
            label: "Hidden",
            description: "Hidden writing has no page on the site.",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Text",
            isBody: true,
          },
        ],
      },
    ],
  },
});
