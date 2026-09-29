---
name: site-change
description: The required workflow for any change to mikarevell.com, code or content, from writing the GitHub issue through testing, approval, deploy and closing. Use for every change, including ones done through the add-work and add-writing skills.
---

# Make a change to the site

The rules are in "Rules for every change" in AGENTS.md. This is the procedure.

## 1. Issue

- Search open issues first (`gh issue list`); reuse one if it already covers the change.
- Otherwise write one with the "Site change" template (`.github/ISSUE_TEMPLATE/site-change.md`): `gh issue create --template "Site change"` or write the body to a file and pass `--body-file`. Follow the `write-site-issue` skill.
- The Plan section is filled in before you start building. Acceptance criteria name how each is checked: an e2e test in `tests/e2e/`, the build, or a manual check with a screenshot.

## 2. Build

- Branch from `master`: `git switch -c <issue-number>-<short-name>`.
- Make the change. If it adds a page type or behavior, add or extend a test in `tests/e2e/site.spec.ts`. Pages are discovered from the content files, so new series and writing are tested automatically.
- Commit messages reference the issue (`Fixes #12` only in the final commit that completes it).

## 3. Test, on phone and desktop

- `npm test` (all checks, desktop Chrome and iPhone Safari), `npm run build`, `npm run check`. All must pass.
- If screenshot tests fail, open the diff images in `test-results/`. An intended change: confirm nothing else moved, run `npm run test:update-screenshots`, and commit the new screenshots. An unintended change: fix it.
- Open the changed pages in `npm run dev` at a desktop width and a phone width yourself, and attach screenshots to the issue (or save them next to it and describe them).
- Tick the Testing checklist in the issue.

## 4. Review

Run the `review-change` skill and post its findings on the issue. Fix what it finds before asking for approval.

## 5. Approval

- Push the branch. Vercel posts a preview URL on the commit (`gh api repos/{owner}/{repo}/commits/<sha>/statuses`). Optionally run `BASE_URL=<preview url> npm test`.
- Share the preview URL and screenshots with whoever asked for the change, and wait for their approval. Don't merge without it.

## 6. Deploy and close

- Merge to `master` (a pull request or a fast-forward merge), then wait for the Vercel deploy and check the live page at www.mikarevell.com.
- Close the issue with a comment saying what shipped, the commit, anything that changed from the plan, and anything still open.
