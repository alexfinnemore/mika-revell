---
name: Site change
about: A change to mikarevell.com, code or content. Guidance in taste/issue-writing.md.
title: ""
labels: []
assignees: []
---

<!-- How to write this: taste/issue-writing.md and the write-site-issue skill. Write in full sentences with no em dashes (taste/plain-writing.md). -->

## User need

<!-- One or more user stories. Name Mika or Alex; for visitors, name the kind of visitor. -->
As [Mika / Alex / a gallerist checking her exhibition history / a collector on a phone], I want [capability], so that [the decision or experience it changes].

## Part of the site

<!-- Every page URL, file path and CMS collection affected. -->
- Pages:
- Files:
- CMS collections (TinaCMS at /admin):

## Why

<!-- Two or three sentences: the reason, and who benefits. Label anything from a conversation with its source and date. -->

## Do / Don't

Do:
-

Don't:
-

## Plan

<!-- Numbered steps, written before building. One action per step, on a named file or tool. Use the write-in-mika-voice and check-mika-text skills for any copy. Update this section if the plan changes, and say what changed. -->
1.
2.
3.

## Acceptance criteria

<!-- Each one is something a visitor or Mika can see, and names what checks it: an e2e test (file > test name, or "new"), the build, or a manual browser check with a screenshot. Include what must not change. -->
1. [Visible behavior]. Checked by: [e2e test / build / manual + screenshot].
2. [What must not change or appear]. Checked by: [...].

## Testing

- [ ] Local run (`npm run dev`), pages visited:
- [ ] Screenshots at desktop and phone widths attached
- [ ] e2e tests run and passing:
- [ ] Production build passes (`npm run build`)
- [ ] Copy passes check-mika-text (if any text changed)

## Closing rule

Close this issue only when all three are true:
- [ ] Local tests and build pass.
- [ ] The requester (usually Mika or Alex) has approved the result.
- [ ] The change is deployed and checked on www.mikarevell.com.

The closing comment says what shipped, the commit, what changed from the plan, and what is still open.
