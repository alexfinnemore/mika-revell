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
| CMS | Decap CMS (planned) | Visual editor at `/admin` |
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
│   └── admin/                  # Decap CMS config (future)
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

## Decap CMS (Visual Editor)

**Status**: Planned for Phase 5

Decap CMS provides a visual editor at `/admin` for non-technical content updates.

### Setup Requirements

1. **GitHub OAuth App** (for authentication):
   - Go to GitHub → Settings → Developer settings → OAuth Apps → New
   - Application name: `Mika Revell CMS`
   - Homepage URL: `https://mikarevell.com`
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Save Client ID and Client Secret

2. **Netlify Identity** or **External OAuth Provider**:
   - Decap CMS needs an OAuth backend for GitHub auth
   - Options: Netlify Identity (free), or self-hosted oauth server
   - See: https://decapcms.org/docs/external-oauth-clients/

3. **CMS Config** (`public/admin/config.yml`):
   ```yaml
   backend:
     name: github
     repo: alexfinnemore/mika-revell
     branch: master

   media_folder: "public/uploads"
   public_folder: "/uploads"

   collections:
     - name: "artworks"
       label: "Artworks"
       folder: "src/content/artworks"
       extension: "yaml"
       format: "yaml"
       create: true
       fields:
         - { label: "ID", name: "id", widget: "string" }
         - { label: "Title", name: "title", widget: "string" }
         - { label: "Image URL", name: "image", widget: "string" }
         - { label: "Medium", name: "medium", widget: "string", required: false }
         - { label: "Dimensions", name: "dimensions", widget: "string", required: false }
         - { label: "Year", name: "year", widget: "number", required: false }
         - { label: "Description", name: "description", widget: "text", required: false }
   ```

### CRUD via CMS

Once configured:
1. Go to `mikarevell.com/admin`
2. Log in with GitHub
3. Use visual editor to create/edit/delete content
4. Changes commit to GitHub → auto-deploy via Vercel

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

---

## Future Phases

- [x] Phase 1: Homepage with vertical image stack
- [ ] Phase 2: Work pages (series listing + individual series)
- [ ] Phase 3: About page
- [ ] Phase 4: Contact page
- [ ] Phase 5: Decap CMS integration
- [ ] Phase 6: Migrate images to Vercel Blob

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
