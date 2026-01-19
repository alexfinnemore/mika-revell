import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const uploadResultsPath = 'importing-images/upload-results.json';
const artworksDir = 'src/content/artworks';
const worksDir = 'src/content/works';

// Read upload results
if (!fs.existsSync(uploadResultsPath)) {
  console.error('Upload results not found. Run upload-from-manifest.js first.');
  process.exit(1);
}

const uploadResults = JSON.parse(fs.readFileSync(uploadResultsPath, 'utf-8'));
console.log(`Processing ${uploadResults.length} uploaded images\n`);

// Ensure artworks directory exists
if (!fs.existsSync(artworksDir)) {
  fs.mkdirSync(artworksDir, { recursive: true });
}

// Group by series
const seriesArtworks = {};
for (const item of uploadResults) {
  if (!seriesArtworks[item.series]) {
    seriesArtworks[item.series] = [];
  }
  seriesArtworks[item.series].push(item);
}

// Generate artwork YAML files
let artworkCount = 0;
for (const item of uploadResults) {
  const artworkData = {
    id: item.artworkId,
    title: item.title,
    image: item.url,
  };

  // Add optional fields if present
  if (item.medium) artworkData.medium = item.medium;
  if (item.year) artworkData.year = item.year;

  const yamlContent = yaml.stringify(artworkData);
  const filePath = path.join(artworksDir, `${item.artworkId}.yaml`);
  fs.writeFileSync(filePath, yamlContent);
  artworkCount++;
}

console.log(`Created ${artworkCount} artwork YAML files in ${artworksDir}/\n`);

// Update works YAML files with artwork references
for (const [series, artworks] of Object.entries(seriesArtworks)) {
  const workFilePath = path.join(worksDir, `${series}.yaml`);

  if (!fs.existsSync(workFilePath)) {
    console.warn(`Warning: ${workFilePath} not found, skipping`);
    continue;
  }

  const workContent = fs.readFileSync(workFilePath, 'utf-8');
  const workData = yaml.parse(workContent);

  // Set cover image to first artwork's image
  if (artworks.length > 0) {
    workData.coverImage = artworks[0].url;
  }

  // Set artworks list (artwork IDs)
  workData.artworks = artworks.map(a => a.artworkId);

  const updatedYaml = yaml.stringify(workData);
  fs.writeFileSync(workFilePath, updatedYaml);

  console.log(`Updated ${series}.yaml: ${artworks.length} artworks, cover set`);
}

console.log('\n--- Content Generation Complete ---');
console.log(`Artwork files: ${artworkCount}`);
console.log(`Series updated: ${Object.keys(seriesArtworks).length}`);
