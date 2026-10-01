# Constraints

These are the dials a text is written along. Set all three before drafting.

## text_type

What is being written. It sets the structure, person and length. Default: `series-statement`.

| Option | Meaning |
|---|---|
| `series-statement` | The statement for a body of work on `/work/<slug>` |
| `artwork-entry` | Title, year, medium, and an optional one-line description for one piece |
| `bio` | The About page biography |
| `cv-entry` | One line in Education, Solo Exhibitions or Public Artworks |
| `writing-page` | A standalone essay or text page in Mika's own words |
| `sales-copy` | Contact, sales and commission text |

## person

Who is speaking. Use one person per text and never mix them. Default: `third-person-first-name` (Mika's choice, 2026-10-01).

| Option | Meaning |
|---|---|
| `third-person-first-name` | Refers to the artist as "Mika" (pronoun "she"), never "Revell" in the same text. A bio opens with her full name, "Mika Revell", once |
| `first-person-artist` | "I", for memoir-like accounts such as The Bondage of Costume, and for writing pages |
| `no-person` | No named speaker, for artwork entries, CV lines and sales copy |

Defaults by text type:
- series-statement and bio: third-person-first-name.
- writing-page: decided per piece, first-person-artist or third-person-first-name (Mika, 2026-10-01). Ask if it isn't clear.
- artwork-entry, cv-entry and sales-copy: no-person.
- If Mika's own draft is in first person, keep it first person.

## length

How long the text runs. Default: `standard`.

| Option | Meaning |
|---|---|
| `short` | 1 paragraph, 40 to 80 words |
| `standard` | 2 to 4 paragraphs, 120 to 300 words (most series statements on the site) |
| `long` | 5 or more paragraphs, for writing pages only |
