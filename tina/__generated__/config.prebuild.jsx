// tina/config.ts
import { defineConfig, wrapFieldsWithMeta } from "tinacms";
import React from "react";
var ImageUrlField = wrapFieldsWithMeta(({ input }) => {
  return React.createElement(
    "div",
    null,
    React.createElement("input", {
      type: "text",
      id: input.name,
      value: input.value || "",
      onChange: (e) => input.onChange(e.target.value),
      style: {
        width: "100%",
        padding: "8px 12px",
        fontSize: "14px",
        border: "1px solid #e1e1e1",
        borderRadius: "4px",
        boxSizing: "border-box"
      }
    }),
    input.value && React.createElement("img", {
      src: input.value,
      alt: "Preview",
      style: {
        maxWidth: "100%",
        maxHeight: "200px",
        marginTop: "8px",
        borderRadius: "4px",
        objectFit: "contain"
      },
      onError: (e) => {
        e.target.style.display = "none";
      }
    })
  );
});
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "master";
var config_default = defineConfig({
  branch,
  // Get this from tina.io
  clientId: process.env.TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,
  // Search configuration - requires TINA_SEARCH_TOKEN from Tina Cloud dashboard
  // Only enable search if the token is configured
  ...process.env.TINA_SEARCH_TOKEN && {
    search: {
      tina: {
        indexerToken: process.env.TINA_SEARCH_TOKEN,
        stopwordLanguages: ["eng"]
      }
    }
  },
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public"
    }
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
            isTitle: true
          },
          {
            type: "string",
            name: "image",
            label: "Image URL",
            required: true,
            ui: {
              component: ImageUrlField
            }
          },
          {
            type: "string",
            name: "medium",
            label: "Medium"
          },
          {
            type: "string",
            name: "dimensions",
            label: "Dimensions"
          },
          {
            type: "number",
            name: "year",
            label: "Year"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          }
        ]
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
            isTitle: true
          },
          {
            type: "string",
            name: "slug",
            label: "Slug",
            required: true
          },
          {
            type: "string",
            name: "subtitle",
            label: "Subtitle"
          },
          {
            type: "number",
            name: "year",
            label: "Year"
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "coverImage",
            label: "Cover Image URL",
            required: true,
            ui: {
              component: ImageUrlField
            }
          },
          {
            type: "string",
            name: "artworks",
            label: "Artworks",
            list: true,
            description: "List of artwork IDs included in this work (e.g., artwork-1, artwork-2)"
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
            description: "Lower numbers appear first"
          }
        ]
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
            fields: [
              {
                type: "string",
                name: "image",
                label: "Image URL",
                required: true,
                ui: {
                  component: ImageUrlField
                }
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text"
              },
              {
                type: "string",
                name: "workSlug",
                label: "Work Slug",
                description: "Link to a work series"
              },
              {
                type: "string",
                name: "artworkId",
                label: "Artwork ID",
                description: "Link to a specific artwork"
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
