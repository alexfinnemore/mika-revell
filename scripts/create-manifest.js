import fs from 'fs';
import path from 'path';

const importDir = 'importing-images';
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Map folder names to series slugs
const folderToSeries = {
  '1. Unnatural Disasters 2015-2017': 'unnatural-disasters',
  'Cruise control show images copy': 'cruise-control',
  'POWER PLAY copy': 'power-play',
  'SOFTCORE WAR FINAL Images copy': 'softcore-war',
  'wix-export': 'unknown', // needs content-based assignment
};

// Known artwork titles for UUID-named files (from visual review)
const uuidTitles = {
  '50b82e40-f416-4bfe-b776-f15387f3dd26': 'Installation View - Suspended Forms',
  '523ad7c1-2904-459c-8ac1-642daff259d2': 'Sculptural Object I',
  '6ed3c749-3e62-42bd-a463-313343f72116': 'Installation Detail - Hair and Spikes',
  '7ec08c5a-14e1-445d-8a23-3cc2d1edb73b': 'Red Spiky Sphere',
  '8ae459d0-49ee-478c-8f12-b021b800b713': 'Exhibition View I',
  'b41a957e-eeb1-4677-9230-262e66ed8b7b': 'Exhibition View II',
  'ba2ebb3e-cc07-413b-9790-279f998aed86': 'Exhibition View III',
  'bcba94d9-37f1-409e-b9c5-db131bcef272': 'Exhibition View IV',
  'd35df3fa-3a77-41d6-bb76-215cb0d85872': 'Exhibition View V',
  'dea33625-9d99-4df2-b23b-838dae7b7a35': 'Exhibition View VI',
  '20b368e0-5cb5-4046-b3fd-fedcf4dd0259': 'Artist with Spine Sculpture',
  '67482263-e1f6-4888-a2b6-a3cd0892bed8': 'Installation Detail II',
  'cfb63343-9131-4343-8078-94d03c0e941a': 'Installation Detail III',
  '1c0b3bd7-50da-4921-8b05-1c9be442bc93': 'Hair Disk Installation',
  '1fd9c313-b9e6-4f35-b4bd-5286f9a7ea38': 'Cyborg Lightbox',
};

// Map specific UUIDs to series (overrides folder-based detection)
const uuidToSeries = {
  '1c0b3bd7-50da-4921-8b05-1c9be442bc93': 'cruise-control',
  '1fd9c313-b9e6-4f35-b4bd-5286f9a7ea38': 'power-play',
};

// Known artwork titles for IMG_ files (from visual review)
const imgTitles = {
  'IMG_1729': 'Artist with Pink Sculptures',
  'IMG_1730': 'Exhibition Opening',
  'IMG_2077': 'Pink Heart with Pacemaker',
  'IMG_2192': 'Softcore War Gallery Text',
  'IMG_2195': 'Installation View - Bottles',
  'IMG_2197': 'Installation Detail',
  'IMG_2209': 'Exhibition View',
  'IMG_2210': 'Gallery Installation',
  'IMG_2212': 'Detailed Installation View',
  'IMG_2228': 'Exhibition Documentation',
  'IMG_7418': 'Studio Documentation',
  'IMG_0801': 'Watermelon Vase',
};

// Map specific IMG_ files to series
const imgToSeries = {
  'IMG_0801': 'tokyo-residency', // Ceramic work from residency
};

// Softcore War artwork title corrections (from artist)
const softcoreWarTitles = {
  'dreams in which im dying': 'The Dreams in which I\'m Dying…',
  'replicant': 'Replicant',
  'hope is a waking dream': 'Hope is a Waking Dream',
  'consume me': 'Consume Us',
  'lungs': 'Iron Lung',
  'lungs wide': 'Iron Lung (Wide)',
  'bones and plants': 'Under the Skin',
  'closed system': 'Disarmed',
};

// Items to exclude (not artwork)
const excludePatterns = [
  /logo\.png$/i,
  /screenshot/i,
  /_edited\.(jpg|jpeg|png)$/i, // edited versions (keep originals)
];

// Filename patterns for posters (separate consideration)
const posterPatterns = [
  /poster/i,
  /biennale.*poster/i,
];

// Convert filename to title
function filenameToTitle(filename, series) {
  const baseName = path.parse(filename).name;

  // Check for known UUID titles
  const uuidMatch = baseName.match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (uuidMatch && uuidTitles[uuidMatch[1]]) {
    return uuidTitles[uuidMatch[1]];
  }

  // Check for known IMG_ titles
  const imgMatch = baseName.match(/^(IMG_\d+)/i);
  if (imgMatch && imgTitles[imgMatch[1]]) {
    return imgTitles[imgMatch[1]];
  }

  // Default: clean up the filename
  let title = baseName;

  // Remove leading numbers/dots (e.g., "1. Kawaii" -> "Kawaii")
  title = title.replace(/^\d+\.\s*/, '');

  // Replace underscores and hyphens with spaces
  title = title.replace(/[_-]/g, ' ');

  // Clean up multiple spaces
  title = title.replace(/\s+/g, ' ').trim();

  // Check for Softcore War title corrections
  if (series === 'softcore-war') {
    const lowerTitle = title.toLowerCase();
    for (const [key, correctTitle] of Object.entries(softcoreWarTitles)) {
      if (lowerTitle.includes(key)) {
        return correctTitle;
      }
    }
  }

  return title;
}

// Convert to URL-safe slug
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

// Recursively get all image files
function getImageFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.join(basePath, item.name);

    if (item.isDirectory()) {
      files.push(...getImageFiles(fullPath, relativePath));
    } else if (imageExtensions.includes(path.extname(item.name).toLowerCase())) {
      files.push({
        fullPath,
        relativePath,
        filename: item.name,
        folder: basePath.split(path.sep)[0] || 'root',
        subfolder: basePath,
      });
    }
  }

  return files;
}

// Check if file should be excluded
function shouldExclude(filename, folder) {
  // Always exclude these patterns
  if (excludePatterns.some(pattern => pattern.test(filename))) {
    return { exclude: true, reason: 'pattern-match' };
  }

  // Posters from wix-export are excluded, but poster from exhibitions might be included
  if (folder === 'wix-export' && posterPatterns.some(pattern => pattern.test(filename))) {
    return { exclude: true, reason: 'poster' };
  }

  return { exclude: false, reason: null };
}

// Determine series from folder and filename
function determineSeries(folder, filename, subfolder) {
  const lowerFilename = filename.toLowerCase();
  const baseName = path.parse(filename).name;

  // Check for explicit UUID to series mapping
  const uuidMatch = baseName.match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (uuidMatch && uuidToSeries[uuidMatch[1]]) {
    return uuidToSeries[uuidMatch[1]];
  }

  // Check for explicit IMG_ to series mapping
  const imgMatch = baseName.match(/^(IMG_\d+)/i);
  if (imgMatch && imgToSeries[imgMatch[1]]) {
    return imgToSeries[imgMatch[1]];
  }

  // Content-based series assignment takes priority

  // Tokyo Residency
  if (lowerFilename.includes('shono') || lowerFilename.includes('residency')) {
    return 'tokyo-residency';
  }

  // Love Threats
  if (lowerFilename.includes('love') && lowerFilename.includes('threat')) {
    return 'love-threats';
  }

  // Murals - various mural-related keywords
  if (lowerFilename.includes('mural') ||
      lowerFilename.includes('stadium') ||
      lowerFilename.includes('chinatown') ||
      lowerFilename.includes('rooftop') ||
      lowerFilename.includes('milwaukee') ||
      lowerFilename.includes('octopus') ||
      lowerFilename.includes('keep walking') ||
      lowerFilename.includes('sofi') ||
      lowerFilename.includes('agave') ||
      lowerFilename.includes('angels')) {
    return 'murals';
  }

  // Unnatural Disasters
  if (lowerFilename.includes('hiroshima') ||
      lowerFilename.includes('fukushima') ||
      lowerFilename.includes('gulf') ||
      lowerFilename.includes('kuwait') ||
      lowerFilename.includes('kawaii') ||
      lowerFilename.includes('trio') ||
      lowerFilename.includes('weapon of choice')) {
    return 'unnatural-disasters';
  }

  // Power Play
  if (lowerFilename.includes('freedom') ||
      lowerFilename.includes('pleasure') ||
      lowerFilename.includes('raging sea') ||
      lowerFilename.includes('pink') && lowerFilename.includes('bomb') ||
      lowerFilename.includes('diamonds') ||
      lowerFilename.includes('between bridges') ||
      lowerFilename.includes('kowai')) {
    return 'power-play';
  }

  // Softcore War
  if (lowerFilename.includes('consume') ||
      lowerFilename.includes('replicant') ||
      lowerFilename.includes('dream') ||
      lowerFilename.includes('hope') &&lowerFilename.includes('waking') ||
      lowerFilename.includes('bones') ||
      lowerFilename.includes('lungs') ||
      lowerFilename.includes('softcore') ||
      lowerFilename.includes('closed system') ||
      lowerFilename.includes('plant')) {
    return 'softcore-war';
  }

  // Cruise Control
  if (lowerFilename.includes('cruise') || lowerFilename.includes('control')) {
    return 'cruise-control';
  }

  // Fall back to folder-based assignment
  const folderSeries = folderToSeries[folder];
  if (folderSeries && folderSeries !== 'unknown') {
    return folderSeries;
  }

  return 'unknown';
}

// Main
const allFiles = getImageFiles(importDir);
console.log(`Found ${allFiles.length} total images\n`);

const manifest = [];
const seenArtworkIds = new Map(); // Track artwork IDs to detect content duplicates

for (const file of allFiles) {
  const { exclude, reason } = shouldExclude(file.filename, file.folder);
  const series = determineSeries(file.folder, file.filename, file.subfolder);
  const title = filenameToTitle(file.filename, series);
  const artworkId = slugify(title);

  // Check for content duplicates (same artworkId from different sources)
  const existingEntry = seenArtworkIds.get(artworkId);
  let isDuplicate = false;
  let duplicateReason = null;

  if (existingEntry) {
    // Keep the one from the more specific folder (not wix-export)
    if (file.folder === 'wix-export' && existingEntry.folder !== 'wix-export') {
      isDuplicate = true;
      duplicateReason = 'duplicate-wix';
    } else if (file.folder !== 'wix-export' && existingEntry.folder === 'wix-export') {
      // Mark the existing one as duplicate
      existingEntry.entry.exclude = true;
      existingEntry.entry.excludeReason = 'duplicate-prefer-source';
    } else {
      // Same folder type - keep first encountered
      isDuplicate = true;
      duplicateReason = 'duplicate';
    }
  } else {
    seenArtworkIds.set(artworkId, { folder: file.folder, entry: null });
  }

  const entry = {
    filename: file.filename,
    relativePath: file.relativePath,
    folder: file.folder,
    series,
    artworkId,
    title,
    medium: '',
    year: null,
    exclude: exclude || isDuplicate,
    excludeReason: reason || duplicateReason,
  };

  // Update the tracking map with the actual entry reference
  if (!isDuplicate) {
    seenArtworkIds.get(artworkId).entry = entry;
  }

  manifest.push(entry);
}

// Sort by series, then by title
manifest.sort((a, b) => {
  if (a.series !== b.series) return a.series.localeCompare(b.series);
  return a.title.localeCompare(b.title);
});

// Write manifest
const outputPath = path.join(importDir, 'manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest written to: ${outputPath}`);

// Print summary
const summary = {};
for (const item of manifest) {
  if (!summary[item.series]) {
    summary[item.series] = { total: 0, included: 0, excluded: 0 };
  }
  summary[item.series].total++;
  if (item.exclude) {
    summary[item.series].excluded++;
  } else {
    summary[item.series].included++;
  }
}

console.log('\nSummary by series:');
for (const [series, counts] of Object.entries(summary).sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  ${series}: ${counts.included} included, ${counts.excluded} excluded (${counts.total} total)`);
}

// List unknown series items for review
const unknownItems = manifest.filter(item => item.series === 'unknown' && !item.exclude);
if (unknownItems.length > 0) {
  console.log('\n⚠️  Items needing manual categorization:');
  unknownItems.forEach(item => {
    console.log(`  - ${item.filename} (${item.folder})`);
  });
}
