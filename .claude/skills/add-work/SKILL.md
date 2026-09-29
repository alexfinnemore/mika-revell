---
name: add-work
description: Add new artwork images to the site from a folder, either as a new series or appended to an existing series, in the order Mika wants, with titles, years, mediums and a series statement. Use when Mika or Alex hands over a folder of images or says "this is a new collection" or "add these to <series>".
---

# Add a folder of work

This is a site change, so it follows the issue workflow in `.claude/skills/site-change/SKILL.md`. Write the issue first; the steps below are its plan.

## 1. Understand what Mika wants

Ask, in one message, only for what you can't see in the folder:

- Is this a new series or more work for an existing one? (List the existing series from `src/content/works/`.)
- For a new series: its title, year, and where it was shown (venue and city), and whether she has a statement for it.
- The order of the images, if the filenames don't already give it.
- Title, year, medium and dimensions for each piece, if not in the filenames or a notes file in the folder. Never guess these.

## 2. Put the files in order

Copy the images into `importing-images/<series-id>/` (ignored by git) and rename them `01-title-of-piece.jpg`, `02-...`, so the filename gives both the order and the title. Keep the original high-resolution files; the site resizes them.

## 3. Import

```
npm run images:import -- importing-images/<series-id> --series <series-id> [--title "Series Title"] [--year 2026] [--medium "Oil on canvas"] --dry-run
```

Check the dry run's order and titles, then run it again without `--dry-run`. It uploads the images, creates one artwork file per image, adds them to the series in order, and records their sizes. A new series is created hidden.

## 4. Fill in the details

- Correct each new file in `src/content/artworks/` with the title, year, medium and dimensions Mika gave you.
- For a new series, add the `subtitle` ("Venue, City"), `year`, `order` (where it sits on /work/, lower first; renumber others if needed) and the statement in `description`. Write or edit the statement with the `write-in-mika-voice` skill, check it with `check-mika-text`, and have Mika approve the text.
- If some pieces should appear on the homepage, add them to `src/content/homepage/featured.yaml` with `workSlug` and `artworkId` links and alt text.
- When Mika is happy, remove `hidden: true` from the series.

## 5. Test and ship

Run `npm run dev` and look at the series page and `/work/` on desktop and phone widths. Then follow the testing, approval and deploy steps in the site-change skill. New pages have no approved screenshot yet, so `npm test` will create one; look at it before committing it.
