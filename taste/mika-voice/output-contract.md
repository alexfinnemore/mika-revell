# Output contract

A text is done when it meets the requirements for its `text_type`, as set in `constraints.md`.

## series-statement

- The title and year match `src/content/works/<slug>.yaml`.
- The venue and city appear as the subtitle or in the text.
- It opens on an object, a scene or a question.
- The contradiction at the center of the work is named.
- The materials are named exactly.
- Where pink, chrome or polish is present, the text says what it does.
- It ends on a question or a held image, not on a summary or a moral.
- It keeps one person throughout.
- It runs 120 to 300 words unless the length dial says otherwise.
- It has no em dashes and nothing from the Never list in `behavior.md`.

## artwork-entry

- The title is in the artist's own capitalization.
- The year is a number.
- The medium is in sentence case, as a comma list.
- An optional one-sentence description.

## bio

- Third person, opening "Mika Revell (b. …)".
- The practice in her own terms, followed by training and residencies.
- Every fact traces to `src/content/about/main.yaml`.
- No sentence is copied from a series statement, and there's no "latest" or "recent".

## cv-entry

- Matches `house-format.md` exactly.

## writing-page

- First person throughout, in her own words.
- Every quotation carries its source.

## sales-copy

- Either no named speaker, or first person to match the rest of the page.
- States what can be bought, the commission terms, and the certificate of authenticity, without sales adjectives.

## Every type

- Passes `check-mika-text`. Any check that still fails is either fixed or explicitly flagged for Mika.
