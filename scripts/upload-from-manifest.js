import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

const importDir = 'importing-images';
const manifestPath = path.join(importDir, 'manifest.json');

// Read manifest
if (!fs.existsSync(manifestPath)) {
  console.error('Manifest not found. Run create-manifest.js first.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

// Filter to included images only
const imagesToUpload = manifest.filter(item => !item.exclude);
console.log(`Found ${imagesToUpload.length} images to upload\n`);

// Get extension from filename
function getExtension(filename) {
  return path.extname(filename).toLowerCase();
}

// Create clean blob name: series-slug--artwork-id.ext
function createBlobName(item) {
  const ext = getExtension(item.filename);
  return `${item.series}--${item.artworkId}${ext}`;
}

async function uploadImages() {
  const results = [];
  const errors = [];

  let uploaded = 0;
  const total = imagesToUpload.length;

  for (const item of imagesToUpload) {
    const filePath = path.join(importDir, item.relativePath);
    const blobName = createBlobName(item);

    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const fileBuffer = fs.readFileSync(filePath);
      const { url } = await put(blobName, fileBuffer, {
        access: 'public',
      });

      uploaded++;
      console.log(`[${uploaded}/${total}] ${item.filename} → ${url}`);

      results.push({
        ...item,
        blobName,
        url,
      });
    } catch (error) {
      console.error(`[ERROR] ${item.filename}: ${error.message}`);
      errors.push({
        ...item,
        error: error.message,
      });
    }
  }

  // Write results
  const outputPath = path.join(importDir, 'upload-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n--- Upload Complete ---`);
  console.log(`Uploaded: ${results.length}/${total}`);
  console.log(`Errors: ${errors.length}`);
  console.log(`\nResults saved to: ${outputPath}`);

  // Write errors if any
  if (errors.length > 0) {
    const errorPath = path.join(importDir, 'upload-errors.json');
    fs.writeFileSync(errorPath, JSON.stringify(errors, null, 2));
    console.log(`Errors saved to: ${errorPath}`);
  }

  // Print summary by series
  const summary = {};
  for (const item of results) {
    if (!summary[item.series]) {
      summary[item.series] = 0;
    }
    summary[item.series]++;
  }

  console.log('\nUploaded by series:');
  for (const [series, count] of Object.entries(summary).sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${series}: ${count}`);
  }
}

uploadImages().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
