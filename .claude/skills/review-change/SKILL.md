---
name: review-change
description: Review a change to mikarevell.com before asking for approval, covering correctness, the site's own rules, accessibility, performance, security and copy. Use after building any change and before pushing it for review, or when asked to "review", "code review" or "check the branch".
---

# Review a change

Run this on the branch before step 4 (approval) of the site-change workflow. It has two parts: a general bug hunt, then the checks that are specific to this site. Findings go into the issue as a comment, and each one is either fixed or explicitly set aside with a reason.

## 1. Bug hunt

If you are Claude Code, run the built-in `/code-review` skill on the branch (the diff against `master`) at `high` effort. Otherwise read the whole diff (`git diff master...HEAD`) and look for logic errors, unhandled empty or missing content, and code that only works with the current content.

## 2. Automated checks

All of these must pass. Paste the one-line result of each into the issue.

- `npm run check` (types)
- `npm run build` (includes the content schema check and link checking)
- `npm test` (every page on desktop and phone, including screenshots)
- `npm run check:secrets` (no secrets in the branch's commits; needs `brew install gitleaks`)

## 3. Site checklist

Go through each line and note anything that fails.

**Content and the editor**
- A new or changed content field is in both `src/content/schemas.ts` and `tina/config.ts` (the build checks names; you check that labels and descriptions make sense to Mika in the editor).
- No content file other files link to has been renamed or deleted without updating the links.
- Anything Mika will edit in the CMS has a clear label, a description where it isn't obvious, and a sensible order in the editor.

**Pages**
- Images go through `ResponsiveImage` (resizing, reserved space, lazy loading), and only the first image on a page has `priority`.
- Every image has meaningful alt text, or empty alt text if it's decorative and the text beside it says the same thing.
- Each page has exactly one `h1`, a title in the form "Name | Mika Revell", and a meta description.
- Nothing scrolls sideways on a phone, and tap targets are big enough to hit.
- The change was looked at in a browser at phone and desktop widths, not only through tests.

**Speed**
- No new client-side JavaScript unless it's needed, no new third-party scripts, fonts or embeds, and no new image widths or formats (each is billed).
- Screenshot diffs were opened and are intended.

**Security**
- No secrets in code, content or commits. Secrets live in Vercel's environment variables and reach a machine only through `vercel env pull .env`, which is gitignored.
- New external links that open in a new tab have `rel="noopener noreferrer"`.
- New dependencies are necessary, maintained, and don't add `npm audit` findings (`npm audit`).

**Words**
- Copy follows `taste/plain-writing.md`, and anything in Mika's voice passes the `check-mika-text` skill.
- Mika's own writing hasn't been changed in substance without her approval.

**Docs and tests**
- New behavior has a test in `tests/e2e/`.
- If the change alters how something works or how to do a task, AGENTS.md and the relevant skill are updated in the same branch.

## 4. Report

Comment on the issue with: the automated check results, each finding (file and line, what's wrong, what you did about it), and anything you decided not to fix and why. Fix what you can before asking for approval.
