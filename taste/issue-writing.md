# Writing issues for mikarevell.com

An issue records a decision to do work. Mika reads it to see what will change, an agent builds from it, and later someone reads it to find out why the site is the way it is. Issues follow `taste/plain-writing.md` in full.

The procedure is the `write-site-issue` skill. The blank template is `.github/ISSUE_TEMPLATE/`.

## General rules

These are adapted from Alex's user-story guide.

- **Name the users.** Mika and Alex by name. For visitors, name the specific kind of visitor ("a gallerist checking her exhibition history"), not "a user".
- **State the need as the decision or experience it changes, not as a feature.** Test it by asking whether something other than the planned build could satisfy the need. If nothing could, you've written a solution disguised as a need.
- **Every claim carries its status.** "Mika's recollection, not checked against the gallery" goes in the same sentence as the claim.
- **Size each issue to one reviewable outcome.** If the acceptance criteria have two unrelated halves, split it into two issues.
- **Write the issue before doing the work,** including planning and review work.
- **No fabricated acceptance criteria.** If you can't say how a condition would be checked, cut it or make it checkable.
- **Close with the truth.** The closing comment says:
  - what shipped, and the commit;
  - what changed from the plan;
  - what the work revealed;
  - what was skipped, and why.

## Sections

1. **User need.** One or more stories in the form "As [person], I want [capability], so that [the decision or experience it changes]." The users on this site are Mika (the owner and editor), Alex (the maintainer), visitors (collectors, gallerists, curators, press), and Mika's or Alex's agent.
2. **Part of the site.** Every affected page URL, file path and CMS collection. For example: `/work/cruise-control`, `src/content/works/cruise-control.yaml`, the Tina "Works" collection, and `tina/config.ts` or `src/content/config.ts` if the schema changes.
3. **Why.** Two or three sentences giving the reason and who benefits, with the source and date of any claim that came from a conversation.
4. **Do / Don't.** Guardrails.
   - Do: "keep Mika's wording and change only what fails check-mika-text".
   - Don't: "don't rename slugs, because it breaks links", "don't invent dates", "don't touch hidden series".
5. **Plan.** Numbered steps, written before building, each one an action on a named file or tool. Include the copy step (write-in-mika-voice, then check-mika-text) and the test step. If the plan changes, update this section and say what changed.
6. **Acceptance criteria.** Numbered, and checkable by someone other than the author.
   - Write each one as behavior a visitor or Mika can see: "The Cruise Control page shows the 2024 exhibition at E69, Berlin". Not "the div has class x".
   - After each criterion, name what checks it: an e2e test (file and test name, or "new"), the build, or a manual browser check with a screenshot.
   - Include negative criteria: what must not change and what must not appear.
7. **Testing.**
   - A local run with `npm run dev`, listing the pages visited.
   - Screenshots at desktop and phone widths.
   - The e2e tests.
   - The production build (`npm run build`).
   - A check-mika-text result for any copy.
8. **Closing rule.** Close only when all three are true:
   - the local tests and build pass;
   - the requester (usually Mika or Alex) has approved the result;
   - the change is deployed and checked on www.mikarevell.com.

## Avoid

- A solution disguised as a need ("so that there is a carousel").
- Criteria no one can check ("looks better", "improved").
- Two outcomes in one issue.
- Restating a rule from `taste/`. Name the file instead.

## Research behind this

This was researched on 2026-09-29. The sources are general guidance on agile and testing. None is specific to artist sites run from a CMS, so the sections above are a judgment built on them, not a standard copied from any one of them. The section list itself was specified by Alex on 2026-09-29.

1. Mike Cohn, Mountain Goat Software, "User Stories", https://www.mountaingoatsoftware.com/agile/user-stories.
   - What it says: the template "As a [type of user], I [want] to [do something], so that [reason or benefit]"; Ron Jeffries' card, conversation and confirmation; and conditions of satisfaction as "examples, rules, tests, sketches, or notes", added "just in time and just enough".
   - What it shaped here: the User need section, and a short plan.
2. Agile Alliance glossary, "INVEST", https://www.agilealliance.org/glossary/invest/.
   - What it says: stories should be Independent, Negotiable, Valuable, Estimable, Small and Testable ("in principle, even if there isn't a test yet"). The criteria come from Bill Wake (2003) and were popularized by Cohn (2004).
   - What it shaped here: one outcome per issue, and every criterion testable.
3. Cucumber, "Writing better Gherkin", https://cucumber.io/docs/bdd/better-gherkin/.
   - What it says: describe behavior, not implementation, in a declarative style, so the wording survives UI changes.
   - What it shaped here: criteria written as what a visitor sees.
4. Playwright, "Best Practices", https://playwright.dev/docs/best-practices.
   - What it says: tests should "verify that the application code works for the end users"; prefer locators by role and text; keep tests isolated; use web-first assertions and screenshot comparisons.
   - What it shaped here: each criterion names its e2e test and is phrased so a role or text locator can check it.
5. GitHub Docs, "Syntax for issue forms", https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms.
   - What it says: templates live in `.github/ISSUE_TEMPLATE`. YAML forms add `required` validation.
   - What it shaped here: the repo template.
