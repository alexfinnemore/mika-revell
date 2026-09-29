---
name: setup
description: Set up this repo on a new machine so the site, the TinaCMS editor and the tests all run locally. Use when someone has just cloned the repo, asks to "onboard", or when `npm run dev` or `npm test` fails because something is missing.
---

# Set up the site on this machine

Follow "Set up a new machine" in AGENTS.md, checking each step before moving on:

1. `node -v` prints v24. If not, install Node 24 (`brew install node@24` on a Mac, then put `$(brew --prefix node@24)/bin` first on the PATH) and reopen the shell.
2. `npm ci` finishes without errors.
3. `.env` exists and contains `BLOB_READ_WRITE_TOKEN`, `TINA_CLIENT_ID` and `TINA_TOKEN` (check names only, never print the values). If not, the person needs to run `vercel login` themselves (it opens a browser), then you run `vercel link --project mika-revell --yes` and `vercel env pull .env --yes`. If they have no access to the Vercel project, stop and ask them to get it from Alex.
4. `npx playwright install webkit` succeeds, or install it by hand as described under "Known quirks" in AGENTS.md. Google Chrome must be installed for the desktop tests.
5. `npm test` passes. It starts the dev server itself.
6. Start `npm run dev`, open http://localhost:4321 and http://localhost:4321/admin/index.html, and confirm both load.

Finish by telling the person, in two or three plain sentences, what they can now do: add work from a folder, add writing, or edit in the CMS. Point them to AGENTS.md.
