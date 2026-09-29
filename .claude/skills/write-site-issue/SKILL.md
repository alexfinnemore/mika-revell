---
name: write-site-issue
description: Write a GitHub issue for mikarevell.com that Mika can read, an agent can build from, and a browser or e2e test can verify. It covers user need, part of the site, why, do and don't, plan, acceptance criteria, testing, and the closing rule. Use when asked to "write an issue", "file this as an issue", "create a GitHub issue for the site", or "turn this request into an issue", and before starting any change to the site.
---

# Write a site issue

## Before writing

1. Read `taste/plain-writing.md`. Issues follow every rule in it: full sentences, no em dashes, no slogans, and the point first.
2. Read `taste/issue-writing.md`. It has the general rules, the section definitions and the research behind them.
3. Read the part of the repo the request touches, so the "Part of the site" section names real files.
   - Content is in `src/content/`.
   - Schemas are in `src/content/config.ts` and `tina/config.ts`.
   - Pages are in `src/pages/`.
4. Check that there's no existing issue for the same work: `gh issue list --search "<keywords>" --state all`.

## Write the issue

- **Title.** Say what changes, in the imperative, in the requester's words where possible.
- **Body.** Use the sections from `taste/issue-writing.md`, in this order:
  1. User need
  2. Part of the site
  3. Why
  4. Do / Don't
  5. Plan
  6. Acceptance criteria (each naming what checks it)
  7. Testing
  8. Closing rule
- Write the plan before any building starts.

## Create it

Write the body to a temporary file and create the issue:

```bash
gh issue create --title "<title>" --body-file <file>
```

Add a label if one fits (`bug`, `enhancement`, `content`, `stack`, `documentation`). Report the issue URL.

## Self-check before creating

- Is every user named, or a specific kind of visitor?
- Could an agent that wasn't in the conversation build from this?
- Could Mika read it without being sold to?
- Does every acceptance criterion say how it's checked?
- Are unconfirmed claims labeled as unconfirmed?
- Are there no em dashes and no fragments?

## When closing

- Close only when the local tests and build pass, the requester has approved, and the change is deployed and checked on www.mikarevell.com.
- The closing comment says what shipped, the commit, what changed from the plan, and what's still open.
