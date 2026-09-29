# mikarevell.com

The portfolio site of the artist Mika Revell: her series of work, a page about her with her CV, a contact page, and pages of writing. It is live at [www.mikarevell.com](https://www.mikarevell.com).

The site is built with [Astro](https://astro.build) and deployed on Vercel. Its content lives in this repo as YAML and Markdown files, which can be edited by hand, by an AI agent, or in the TinaCMS editor at `/admin`. Images are stored in Vercel Blob.

**Everything about how it works and how to change it is in [AGENTS.md](AGENTS.md)**: setting up a machine, the content model, adding new work or writing, and the rules for every change. The two rules to know before touching anything are:

1. Every change starts as a GitHub issue with a plan, using the "Site change" template, and is closed only after it is tested, approved and live.
2. Every change is tested on both a phone view and a desktop view. `npm test` does this automatically, including a screenshot comparison of every page.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Runs the site at http://localhost:4321 and the editor at http://localhost:4321/admin/index.html |
| `npm test` | Runs every end-to-end and screenshot test on desktop and phone |
| `npm run build` | Builds the site exactly as Vercel does |
| `npm run check` | Type-checks the code |
| `npm run images:import -- <folder> --series <id>` | Uploads a folder of images and adds them to a series |
| `npm run test:update-screenshots` | Accepts intended visual changes as the new approved screenshots |
