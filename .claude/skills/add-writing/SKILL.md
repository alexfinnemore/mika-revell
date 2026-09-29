---
name: add-writing
description: Add a page of writing (an essay, a statement, a text for a show) to the site's Writing section. Use when Mika or Alex gives you a text and wants it published as its own page.
---

# Add a page of writing

This is a site change, so it follows the issue workflow in `.claude/skills/site-change/SKILL.md`.

1. Ask for anything missing: the title, an optional subtitle (for example where or for what it was written), the date, and whether it should appear before other writing (`order`).
2. Create `src/content/writing/<id>.md`, where the id is the title in lowercase words joined by hyphens:

   ```markdown
   ---
   title: The Title
   subtitle: Written for the catalogue of Softcore War
   date: 2026-09-01
   ---

   The text, in Markdown. Blank lines between paragraphs. Use ## for headings,
   > for quotations, and *italics* for titles of works.
   ```

3. Keep Mika's text as she wrote it. Fix only clear typos, list them in the issue, and propose anything else for her approval. The `check-mika-text` skill flags problems, but her text is the authority.
4. Run `npm run dev` and check `/writing/` and the new page on desktop and phone widths. The Writing link appears in the menu once the first piece exists.
5. Finish with the testing, approval and deploy steps in the site-change skill.

To take a piece down without deleting it, add `hidden: true` to its frontmatter.
