# Mika Revell - Artist Portfolio Website

A static portfolio website for fine artist Mika Revell, built with Astro, Tailwind CSS, and Vercel Blob storage.

**Live site**: [mikarevell.com](https://mikarevell.com) (or Vercel preview URL)

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Astro 4.x | Static site generation, zero JS by default |
| Styling | Tailwind CSS v4 | Utility-first CSS with custom theme |
| Content | YAML files in `src/content/` | Type-safe content collections |
| Images | Vercel Blob | CDN-delivered image storage |
| CMS | TinaCMS | Visual editor at `/admin` |
| Hosting | Vercel | Auto-deploy from GitHub |

---

## Project Structure

```
mika-revell/
├── src/
│   ├── components/
│   │   ├── Nav.astro           # Desktop sidebar + mobile hamburger
│   │   ├── Footer.astro        # Copyright + Instagram link
│   │   ├── ImageCard.astro     # Image with hover effect
│   │   └── Button.astro        # Primary/secondary button variants
│   ├── layouts/
│   │   └── BaseLayout.astro    # HTML head, nav, footer wrapper
│   ├── pages/
│   │   ├── index.astro         # Homepage - vertical image stack
│   │   ├── about.astro         # Artist bio (stub)
│   │   ├── contact.astro       # Contact info (stub)
│   │   └── work/
│   │       ├── index.astro     # Grid of all work series
│   │       └── [slug].astro    # Individual series with artworks
│   ├── content/
│   │   ├── config.ts           # Zod schemas for content types
│   │   ├── artworks/           # Individual artwork YAML files
│   │   ├── works/              # Work series YAML files
│   │   └── homepage/
│   │       └── featured.yaml   # Homepage image order + links
│   └── styles/
│       └── global.css          # Tailwind theme + base styles
├── public/
│   └── admin/                  # TinaCMS admin interface (auto-generated)
├── tina/
│   └── config.ts               # TinaCMS collections configuration
├── importing-images/           # Local images for upload (gitignored)
└── .env.local                  # Environment variables (gitignored)
```

---

## Content Management

### Content Collections

All content is stored as YAML files with TypeScript validation via Zod schemas in `src/content/config.ts`.

#### Artworks (`src/content/artworks/*.yaml`)

Individual pieces of art:

```yaml
id: "hanging-piece"              # Unique ID (used for anchors)
title: "Untitled (Hanging)"
medium: "Mixed media sculpture"  # Optional
dimensions: "48 x 24 x 12 in"    # Optional
year: 2023                       # Optional
image: "https://xyz.public.blob.vercel-storage.com/hanging-piece.jpg"
description: "A visceral exploration of tension..."  # Optional
```

#### Works (`src/content/works/*.yaml`)

Bodies of work / series containing multiple artworks:

```yaml
title: "Softcore War"
slug: "softcore-war"             # URL slug: /work/softcore-war
year: 2023                       # Optional
description: "Body of work exploring..."  # Optional
coverImage: "https://xyz.public.blob.vercel-storage.com/cover.jpg"
artworks:                        # Ordered list of artwork IDs
  - hanging-piece
  - spiky-sphere
  - installation-view
```

#### Homepage (`src/content/homepage/featured.yaml`)

Controls homepage image order and links:

```yaml
images:
  - image: "https://xyz.public.blob.vercel-storage.com/image1.jpg"
    alt: "Description for accessibility"
    workSlug: "softcore-war"     # Links to /work/softcore-war
    artworkId: "hanging-piece"   # Scrolls to #hanging-piece anchor
  - image: "https://..."
    alt: "..."
    # workSlug/artworkId optional - image won't link if omitted
```

### CRUD Operations for Content

#### Create New Artwork

1. Upload image to Vercel Blob (see Image Management below)
2. Create `src/content/artworks/[id].yaml` with the schema above
3. Add the artwork ID to relevant `src/content/works/[series].yaml`
4. Optionally add to `src/content/homepage/featured.yaml`

#### Update Artwork

Edit the YAML file directly. Changes deploy automatically on push.

#### Delete Artwork

1. Remove from `homepage/featured.yaml` if present
2. Remove from all `works/*.yaml` files
3. Delete `artworks/[id].yaml`
4. Optionally delete image from Vercel Blob

#### Create New Work Series

1. Create `src/content/works/[slug].yaml`
2. Upload cover image to Blob
3. Create artwork files and add IDs to the `artworks` array

---

## Image Management (Vercel Blob)

Images are stored in Vercel Blob for CDN delivery. The `BLOB_READ_WRITE_TOKEN` is required for uploads.

### Setup

```bash
# Link project to Vercel (creates .vercel/ folder)
npx vercel link

# Pull environment variables including BLOB_READ_WRITE_TOKEN
npx vercel env pull .env.local
```

### Upload Images

#### Via Vercel CLI

```bash
# Single file
npx vercel blob upload ./importing-images/my-image.jpg

# Returns URL like: https://xyz.public.blob.vercel-storage.com/my-image.jpg
```

#### Via Node.js Script

```javascript
// scripts/upload-image.js
import { put } from '@vercel/blob';
import fs from 'fs';

const file = fs.readFileSync('./importing-images/my-image.jpg');
const { url } = await put('my-image.jpg', file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});
console.log('Uploaded:', url);
```

Run with: `node --env-file=.env.local scripts/upload-image.js`

#### Via REST API (curl)

```bash
# Upload
curl -X PUT "https://blob.vercel-storage.com/my-image.jpg" \
  -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN" \
  -H "x-api-version: 7" \
  -H "Content-Type: image/jpeg" \
  --data-binary @./importing-images/my-image.jpg

# List blobs
curl "https://blob.vercel-storage.com?limit=100" \
  -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN"

# Delete
curl -X DELETE "https://blob.vercel-storage.com?url=https://xyz.public.blob.vercel-storage.com/my-image.jpg" \
  -H "Authorization: Bearer $BLOB_READ_WRITE_TOKEN"
```

### Image Naming Convention

```
[series-slug]-[artwork-id].jpg
e.g., softcore-war-hanging-piece.jpg
```

---

## TinaCMS (Visual Editor)

TinaCMS provides a visual editor at `/admin` for non-technical content updates.

### Accessing the CMS

1. Go to `https://mikarevell.com/admin` (or `localhost:4321/admin` in dev)
2. Log in with your Tina Cloud account
3. Edit content visually - changes commit directly to GitHub

### Adding a New Artwork

1. In Tina: **Artworks** → **Create New**
2. Enter ID (lowercase with hyphens, e.g., `my-new-artwork`)
3. Enter title
4. Paste Vercel Blob URL in image field (see Image Management section)
5. Fill optional fields: medium, dimensions, year, description
6. Save

### Creating a New Work Series

1. In Tina: **Work Series** → **Create New**
2. Fill in: title, slug (URL path), subtitle, year
3. Add description (supports multi-line text)
4. Paste cover image URL
5. Add artwork IDs to the artworks list
6. Set display order number (lower = appears first on /work page)
7. Save

### Editing Homepage Featured Images

1. In Tina: **Homepage** → **featured**
2. Add/remove/reorder images in the list
3. Each image needs:
   - **Image URL**: Vercel Blob URL
   - **Alt Text**: Accessibility description
   - **Link to Work Series**: Slug of work series (e.g., `softcore-war`)
   - **Artwork ID**: Specific artwork to scroll to
4. Save

### Changing Work Series Order

1. In Tina: **Work Series** → select a series
2. Change the **Display Order** field number
3. Lower numbers appear first on the `/work` page
4. Save

### Inviting Team Members

1. Go to [tina.io](https://tina.io) → Your Project → Team
2. Invite collaborators via email
3. They create a Tina account (no GitHub access needed)
4. They can then edit content at `/admin`

### Environment Variables

Required in Vercel dashboard:

| Variable | Purpose |
|----------|---------|
| `TINA_CLIENT_ID` | From Tina Cloud project settings |
| `TINA_TOKEN` | From Tina Cloud project settings |

---

## Development

### Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build for production
npm run preview      # Preview production build
```

### Style Guide

| Property | Value |
|----------|-------|
| Background | `#FFFFFF` (white) |
| Text | `#000000` (black) |
| Text Muted | `#717070` (gray) |
| Accent | `#FF776B` (coral) |
| Accent Hover | `#E5685D` (darker coral) |
| Surface | `#F3F3F3` (light gray) |
| Font | Inter (300 light, 400 regular, 600 semibold) |
| Nav Width | 180px (desktop) |
| Max Content Width | 980px |

### Breakpoints

- Mobile: < 640px (base styles)
- Tablet: 640px - 1024px (`sm:`, `md:`)
- Desktop: > 1024px (`lg:`)

---

## Deployment

Vercel auto-deploys on push to `master`:

1. Push changes: `git push origin master`
2. Vercel builds and deploys (~30 seconds)
3. Preview URL provided for PRs

### Environment Variables (Vercel Dashboard)

| Variable | Purpose |
|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | Auto-added when Blob storage created |
| `TINA_CLIENT_ID` | TinaCMS authentication |
| `TINA_TOKEN` | TinaCMS API token |

---

## Completed Features

- [x] Homepage with vertical image stack
- [x] Work pages (series listing + individual series)
- [x] About page
- [x] Contact page
- [x] TinaCMS integration
- [x] Images hosted on Vercel Blob
- [x] Homepage click-through to artworks
- [x] Configurable series display order

---

## For Claude Code Sessions

When working on this project:

1. **Content changes**: Edit YAML files in `src/content/`
2. **Image uploads**: Use Vercel Blob API (see Image Management)
3. **Styling**: Custom theme vars in `src/styles/global.css`
4. **New pages**: Add to `src/pages/`, use `BaseLayout.astro`
5. **Build test**: Always run `npm run build` to verify

### Common Tasks

**Add homepage image**:
```yaml
# src/content/homepage/featured.yaml - add to images array
- image: "https://blob-url..."
  alt: "Description"
  workSlug: "series-slug"
  artworkId: "artwork-id"
```

**Add artwork to series**:
1. Create `src/content/artworks/new-piece.yaml`
2. Add `new-piece` to `artworks` array in `src/content/works/[series].yaml`

**Check for errors**:
```bash
npm run build  # TypeScript + Astro validation
```
