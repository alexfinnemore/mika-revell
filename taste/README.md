# Taste package: Mika Revell's writing voice

This folder holds the judgment an agent needs to write for mikarevell.com the way Mika would, and to write issues and docs for this repo the way Alex would. It lives in the repo so any agent that clones the site has it, including Mika's own Claude, with no outside service.

**Status:** extracted from the site's own text on 2026-09-29. Mika has not yet reviewed it. Treat the beliefs as a strong draft until she confirms them.

## What is here

| File | What it holds |
|---|---|
| `mika-voice/philosophy.md` | Six beliefs behind her writing, each quoted from her text and ending in what it means in practice. Read first. |
| `mika-voice/mythos.md` | The references her own texts cite. Nothing added. |
| `mika-voice/constraints.md` | The dials: `text_type`, `person` and `length`, with defaults. |
| `mika-voice/behavior.md` | How to write each text type, which plain-writing rules apply, and the Never list. |
| `mika-voice/output-contract.md` | What a finished text of each type must contain. |
| `mika-voice/examples.md` | Good examples (her real sentences) and bad examples (weak real sentences, with fixes). |
| `mika-voice/house-format.md` | Spelling, punctuation, and the formats for titles, mediums, subtitles and CV lines. |
| `mika-voice/vocabulary.md` | Her recurring words and structures, with the files they appear in. |
| `mika-voice/analysis-2026-09-29.md` | How the package was derived: sources, authorship confidence, evidence and limits. This is a dated record, so don't edit it. |
| `plain-writing.md` | Alex's plain-writing rules. Issues and docs follow them in full, and Mika's art texts follow a stated subset. |
| `issue-writing.md` | How to write a GitHub issue for this site, with the research behind it. |

The procedures that use these files are Claude skills in `.claude/skills/`:
- `write-in-mika-voice` drafts or edits site text.
- `check-mika-text` tests text against the voice.
- `write-site-issue` writes an issue.

## How an agent loads it

For any text that appears on the site:
1. `mika-voice/philosophy.md`
2. `mika-voice/constraints.md`, then choose the dials.
3. `mika-voice/behavior.md`
4. `plain-writing.md`, the section for Mika's texts.
5. `mika-voice/output-contract.md` for the text type.
6. `mika-voice/examples.md`
7. `mika-voice/house-format.md` and `mika-voice/vocabulary.md` as reference.
8. The facts, from `src/content/`. This folder holds no facts about Mika.

For an issue or a repo doc, load `plain-writing.md` (all of it), then `issue-writing.md`.

## How it maps to a Smaak taste package

The structure follows Smaak's model of a taste package, so the two can be converted either way.

| Smaak field | File here |
|---|---|
| philosophy | `mika-voice/philosophy.md` |
| mythos | `mika-voice/mythos.md` |
| constraints | `mika-voice/constraints.md` |
| behavior | `mika-voice/behavior.md` |
| output contract | `mika-voice/output-contract.md` |
| examples (positive and negative) | `mika-voice/examples.md` |
| sections | `mika-voice/house-format.md`, `mika-voice/vocabulary.md` |
| context docs | `mika-voice/analysis-2026-09-29.md`, `issue-writing.md` (its research part) |
| skills | `.claude/skills/*/SKILL.md` |

This folder is the only copy. A Smaak package `mika-revell` was built first on 2026-09-29 and retired the same day when the package moved here.

## One fact, one home

- **Facts about Mika** (dates, venues, titles, the CV) live only in `src/content/*.yaml`. Don't copy them into this folder.
- **Voice rules** live only here. Skills and issues point to these files and don't restate them.

## How to update it

- **When Mika corrects the voice** (for example, "I'd never say that"), change the belief or rule in the relevant file. Add the corrected sentence to `examples.md` as a new good-and-bad pair. Record the change in the commit message, with her words.
- **When check-mika-text keeps failing on the same thing**, that pattern is a candidate for a new negative example or a Never-list entry.
- **Don't edit `analysis-2026-09-29.md`.** If the package is extracted again, write a new dated analysis file.
- **The next planned step** is a session with Mika. Read her the six beliefs in `philosophy.md`, ask where they're wrong, and update this README's status line when she has reviewed them.
