import { defineConfig, wrapFieldsWithMeta } from "tinacms";
import React from "react";

// Custom image preview component for external URLs (like Vercel Blob)
const ImageUrlField = wrapFieldsWithMeta(({ input }: { input: { value: string; onChange: (value: string) => void; name: string } }) => {
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
            name: "image",
            label: "Image URL",
            required: true,
            ui: {
              component: ImageUrlField,
            },
          },
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
        label: "Works",
        path: "src/content/works",
        format: "yaml",
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
            name: "slug",
            label: "Slug",
            required: true,
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
          {
            type: "string",
            name: "coverImage",
            label: "Cover Image URL",
            required: true,
            ui: {
              component: ImageUrlField,
            },
          },
          {
            type: "object",
            name: "artworks",
            label: "Artworks in Series",
            list: true,
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
            description: "Hide this series from the public site",
          },
        ],
      },
      {
        name: "homepage",
        label: "Homepage",
        path: "src/content/homepage",
        format: "yaml",
        fields: [
          {
            type: "object",
            name: "images",
            label: "Featured Images",
            list: true,
            ui: {
              itemProps: (item: { alt?: string; artworkId?: string; image?: string }) => ({
                label: item?.alt || item?.artworkId || (item?.image ? item.image.split('/').pop()?.split('.')[0] : "New Image"),
              }),
            },
            fields: [
              {
                type: "string",
                name: "image",
                label: "Image URL",
                required: true,
                ui: {
                  component: ImageUrlField,
                },
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
              },
              {
                type: "string",
                name: "workSlug",
                label: "Work Slug",
                description: "Link to a work series",
              },
              {
                type: "string",
                name: "artworkId",
                label: "Artwork ID",
                description: "Link to a specific artwork",
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
        fields: [
          {
            type: "string",
            name: "heroImage",
            label: "Hero Image URL",
            required: true,
            ui: {
              component: ImageUrlField,
            },
          },
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
          {
            type: "string",
            name: "secondImage",
            label: "Second Image URL",
            ui: {
              component: ImageUrlField,
            },
          },
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
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
            isTitle: true,
          },
          {
            type: "string",
            name: "image",
            label: "Image URL",
            required: true,
            ui: {
              component: ImageUrlField,
            },
          },
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
    ],
  },
});
