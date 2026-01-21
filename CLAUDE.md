# Claude Code Instructions

## Project Overview

This is Mika Revell's artist portfolio site built with Astro and TinaCMS.

## Slash Commands

- `/start-servers` - Start the dev servers (Astro + TinaCMS)
- `/restart-servers` - Kill and restart the dev servers
- `/stop-servers` - Stop all running dev servers
- `/build` - Build for production (kills servers first to avoid port conflicts)

## After Completing Tasks

When finished building or making changes, always check if dev servers are running and restart if needed. Use the `/start-servers` or `/restart-servers` slash commands.

**Manual commands if needed:**
```bash
# Check status
pgrep -f "astro dev" && echo "Astro running" || echo "Astro not running"

# Kill and restart
pkill -f "astro dev" 2>/dev/null; pkill -f "tinacms dev" 2>/dev/null
npm run dev
```

## Skills Reference

- **Image CRUD Operations:** See `.claude/skills/image-crud.md` for Vercel Blob upload/list/delete commands
- **Build Process:** See `.claude/skills/build.md` for build troubleshooting and known issues

## Key Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npx tinacms dev` - Start TinaCMS admin interface

## Content Structure

- `src/content/artworks/` - Individual artwork YAML files
- `src/content/works/` - Work series/collections
- `src/content/homepage/` - Homepage featured images
- `src/content/about/` - About page content

## Image Uploads

Images are stored in Vercel Blob. Use the Image CRUD skill for upload commands.
Store ID: `pbj78tn8g5vmaowa`
