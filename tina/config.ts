import { defineConfig } from "tinacms";

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
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'new-artwork';
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "image",
            name: "image",
            label: "Image",
            required: true,
            description: "Paste Vercel Blob URL or upload image",
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
        label: "Work Series",
        path: "src/content/works",
        format: "yaml",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/\s+/g, '-') || 'new-work';
            },
          },
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            required: true,
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
            description: "Used in URL: /work/[slug]",
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle",
            description: "e.g., Gallery name and location",
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
            type: "image",
            name: "coverImage",
            label: "Cover Image",
            required: true,
            description: "Main image shown on /work page",
          },
          {
            type: "string",
            name: "artworks",
            label: "Artworks",
            list: true,
            description: "List of artwork IDs included in this series",
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            description: "Lower numbers appear first on /work page",
          },
        ],
      },
      {
        name: "homepage",
        label: "Homepage",
        path: "src/content/homepage",
        format: "yaml",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "images",
            label: "Featured Images",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.alt || "Featured Image",
              }),
            },
            fields: [
              {
                type: "image",
                name: "image",
                label: "Image URL",
                required: true,
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
                description: "Describe the image for accessibility",
              },
              {
                type: "string",
                name: "workSlug",
                label: "Link to Work Series",
                description: "Slug of the work series this links to",
              },
              {
                type: "string",
                name: "artworkId",
                label: "Artwork ID",
                description: "ID of the specific artwork to scroll to",
              },
            ],
          },
        ],
      },
    ],
  },
});
