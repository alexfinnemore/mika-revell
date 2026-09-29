// Fails if the CMS (tina/config.ts) and the site (src/content/schemas.ts)
// disagree about which fields a content type has. Without this, a field added
// in one place is either rejected by the build or invisible in the editor.
//
// Reads the schema TinaCMS generates (tina/__generated__/_schema.json), so run
// it after `tinacms build`. `npm run build` does this; `npm run check:schema`
// runs it alone.
import fs from 'node:fs';
import * as schemas from '../src/content/schemas.ts';

type TinaField = { name: string; type: string; list?: boolean; fields?: TinaField[]; isBody?: boolean };

const astroSchemas: Record<string, unknown> = {
  artworks: schemas.artworkSchema,
  works: schemas.workSchema,
  homepage: schemas.homepageSchema,
  about: schemas.aboutSchema,
  contact: schemas.contactSchema,
  writing: schemas.writingSchema,
};

// Zod wraps fields in optional/default/array layers; peel them off to reach the shape.
function unwrap(schema: any): any {
  const def = schema?._zod?.def;
  if (!def) return schema;
  if (['optional', 'default', 'nullable', 'pipe'].includes(def.type)) return unwrap(def.innerType ?? def.in);
  if (def.type === 'array') return unwrap(def.element);
  return schema;
}

function compare(path: string, tina: TinaField[], zod: any, problems: string[]) {
  const shape = unwrap(zod)?._zod?.def?.shape ?? {};
  // The Markdown body of a writing page is the file's content, not a frontmatter field.
  const tinaFields = tina.filter((f) => !f.isBody);
  const tinaNames = new Set(tinaFields.map((f) => f.name));
  for (const name of Object.keys(shape)) {
    if (!tinaNames.has(name)) problems.push(`${path}.${name} is in src/content/schemas.ts but not in tina/config.ts`);
  }
  for (const field of tinaFields) {
    if (!(field.name in shape)) {
      problems.push(`${path}.${field.name} is in tina/config.ts but not in src/content/schemas.ts`);
    } else if (field.type === 'object' && field.fields) {
      compare(`${path}.${field.name}`, field.fields, shape[field.name], problems);
    }
  }
}

const generated = JSON.parse(fs.readFileSync('tina/__generated__/_schema.json', 'utf8'));
const problems: string[] = [];
const tinaNames = new Set<string>();

for (const collection of generated.collections as { name: string; fields: TinaField[] }[]) {
  tinaNames.add(collection.name);
  if (!astroSchemas[collection.name]) {
    problems.push(`CMS collection "${collection.name}" has no schema in src/content/schemas.ts`);
    continue;
  }
  compare(collection.name, collection.fields, astroSchemas[collection.name], problems);
}
for (const name of Object.keys(astroSchemas)) {
  if (!tinaNames.has(name)) problems.push(`Collection "${name}" is missing from tina/config.ts`);
}

if (problems.length) {
  console.error(`Content schema check failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`Content schema check passed (${tinaNames.size} collections).`);
