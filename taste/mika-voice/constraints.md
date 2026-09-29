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

Who is speaking. Use one person per text and never mix them. Default: `third-person-surname`.

| Option | Meaning |
|---|---|
| `third-person-surname` | Refers to the artist as "Revell" (pronoun "she"), never "Mika" in the same text |
| `first-person-artist` | "I", for memoir-like accounts such as The Bondage of Costume, and for writing pages |
| `no-person` | No named speaker, for artwork entries, CV lines and sales copy |

Defaults by text type:
- series-statement: third-person-surname.
- writing-page: first-person-artist.
- artwork-entry, cv-entry and sales-copy: no-person.
- If Mika's own draft is in first person, keep it first person.

## length

How long the text runs. Default: `standard`.

| Option | Meaning |
|---|---|
| `short` | 1 paragraph, 40 to 80 words |
| `standard` | 2 to 4 paragraphs, 120 to 300 words (most series statements on the site) |
| `long` | 5 or more paragraphs, for writing pages only |
