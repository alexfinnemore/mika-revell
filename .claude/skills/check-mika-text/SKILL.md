---
name: check-mika-text
description: Test text for mikarevell.com against Mika Revell's writing style and the plain-writing rules. Returns pass or fail for each check, with the quoted words and a fix. Use before publishing any copy, and when asked "does this sound like Mika", "check this copy", "review the site text", or "lint the series descriptions".
---

# Check text against Mika's style

This skill gives a repeatable test, so any text on the site is checked the same way.

Before checking, read `taste/mika-voice/philosophy.md`, `behavior.md`, `output-contract.md` and `house-format.md`, and the section "Mika's art texts" in `taste/plain-writing.md`.

## Checks

Run every check that applies to the text_type. Record each one as PASS, FAIL (quote the exact words and give a fix), or N/A.

1. **Em dashes.** Any em dash fails. Fix it with a colon, a comma or a full sentence.
2. **Person.** Only one of "Mika" or "I" refers to the artist; "Revell" alone fails (Mika's choice, 2026-10-01). A bio's first mention of "Mika Revell" is fine, and so is "we" meaning everyone. "We" meaning the artist fails.
3. **Never list.** None of these may appear: "delves", "deftly" (Mika rules these out), "intriguing", "her artistry". Also none of:
   - "explores" or "looks at" as the opening verb of "This series ...";
   - rating words that tell the reader how to judge ("important", "compelling").
   "Explores", "interrogate" and "powerful" are otherwise fine with Mika.
4. **Stale time words.** "latest", "recent", "new" or "currently" fail unless they're tied to a date.
5. **Fragments.** Every sentence has a subject and a verb. Questions are exempt.
6. **Slogans and reframes.** Fail on:
   - "not X but Y";
   - a coined aphorism made for rhythm, such as "absurdity as a weapon".
   Phrases taken from her own existing text are exempt.
7. **Opening.** A series statement or writing page opens on an object, a scene or a question, not with "This series explores / looks at / examines".
8. **Contradiction.** A series statement names its central opposition.
9. **Pink has a job.** Where pink, chrome or polish appears, the text says what it does.
10. **Close.** A series statement doesn't end on a moral or a call to action. Any other ending is fine.
11. **Materials.** The materials are named exactly. "Mixed media" fails when the materials are known.
12. **Format.** It matches `house-format.md`: US spelling, the Oxford comma, the medium in sentence case, and a `Venue, City` subtitle.
13. **Facts.** Every date, venue, award and material matches `src/content/`. A mismatch or an unsourced fact fails. Every quotation has a source, and every attribution to a thinker is correct.
14. **No duplication.** No sentence of 45 characters or more is copied from a different text on the site. Grep `src/content` for each one, and ignore matches in the text being replaced.
15. **Fidelity, when editing her draft.** Her strong verbs and images are kept. Softening them (for example, "forced" to "pulled") fails.
16. **Judgment.** Does the text work from the beliefs in `philosophy.md`, or does it only obey the rules?
    - Answer Strong, Surface, Partial or Misaligned, with one line of evidence.
    - Strong means the beliefs carry the text: it opens on the object, it holds the contradiction, and the pink does work.
    - Surface means it follows the rules but could have come from a checklist.

## Output

- **Verdict.** `Verdict: PASS` when every check is PASS or N/A and the judgment is Strong or Surface. Otherwise `Verdict: FAIL`.
- **Table.** A table with the columns `# | Check | Result | Quote | Fix`.
- **Needs Mika.** A line listing anything only she can decide, such as facts, titles or her own phrasing. Write "None" if there isn't anything.

## Avoid

- Failing her deliberate choices. Unusual title capitalization and her own phrases (such as "traverse an alternate way") go under Needs Mika, not FAIL.
- Rewriting the whole text. A fix is the smallest change that passes.

If the same failure keeps coming up, propose adding it to `taste/mika-voice/examples.md` as a new bad example.
