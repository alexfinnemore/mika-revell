---
name: write-in-mika-voice
description: Draft or edit text for mikarevell.com in Mika Revell's voice, with every fact taken from the repo. Use for a new series statement, artwork entries, the bio, CV lines, a writing page, or sales copy. Triggers include "write a description for this series", "add this new body of work", "rewrite the bio", "add a writing page", "write the artwork entries", and "edit the copy on the site".
---

# Write in Mika's voice

This skill produces text Mika would recognize as hers, using only facts that exist in the repo or in what she supplied.

## Process

1. Read the taste package, in this order:
   - `taste/mika-voice/philosophy.md`
   - `taste/mika-voice/constraints.md`
   - `taste/mika-voice/behavior.md`
   - `taste/plain-writing.md`, the section "Mika's art texts"
   - `taste/mika-voice/output-contract.md`
   - `taste/mika-voice/examples.md`
   - `taste/mika-voice/house-format.md` and `taste/mika-voice/vocabulary.md`
2. Collect the facts.
   - Read the relevant files under `src/content/` (about, works, artworks) and whatever Mika supplied: notes, a draft, a folder.
   - List each fact (title, year, venue, city, materials) with its source.
   - If a fact is missing or two sources disagree, stop and ask Mika. Don't pick one.
3. Set the dials from `constraints.md`: text_type, person and length. If Mika's own draft is in first person, keep it first person.
4. Draft to `output-contract.md` for the text type.
   - For a series statement: open on an object, a scene or a question; name the contradiction; give the pink or polish a job; name the materials and the venue; close on a question or a held image.
   - When editing Mika's own draft, change as little as possible, and keep her phrases wherever they pass.
5. Run the `check-mika-text` skill on the draft. Fix every fail, and list anything that needs Mika's decision.
6. Return the result.

## Output

- **Text:** ready to paste. For YAML fields, write plain text with blank lines between paragraphs.
- **Facts used:** each fact and its source file.
- **Check result:** the check-mika-text verdict and table.
- **Questions for Mika:** anything unresolved, or "None".

## Avoid

- Inventing a fact, a quote, a reference or an interpretation.
- Smoothing her voice into generic museum prose.
- Anything from the Never list in `taste/mika-voice/behavior.md`.
- Copying one series statement into another text.
