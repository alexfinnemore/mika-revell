import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Get folder from command line args
const folder = process.argv[2];
if (!folder) {
  console.error('Usage: node scripts/upload-images.js <folder>');
  console.error('Example: node scripts/upload-images.js importing-images/wix-export');
  process.exit(1);
}

// Supported image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Slugify filename for clean URLs
function slugify(filename) {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

async function uploadImages() {
  const folderPath = path.resolve(folder);

  if (!fs.existsSync(folderPath)) {
    console.error(`Folder not found: ${folderPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(f =>
    imageExtensions.includes(path.extname(f).toLowerCase())
  );

  console.log(`Found ${imageFiles.length} images in ${folder}\n`);

  const results = [];

  for (const filename of imageFiles) {
    const filePath = path.join(folderPath, filename);
    const sluggedName = slugify(filename);

    try {
      const fileBuffer = fs.readFileSync(filePath);
      const { url } = await put(sluggedName, fileBuffer, {
        access: 'public',
      });

      console.log(`✓ ${filename} → ${url}`);
      results.push({ original: filename, slug: sluggedName, url });
    } catch (error) {
      console.error(`✗ ${filename}: ${error.message}`);
    }
  }

  // Output summary
  console.log(`\n--- Upload Complete ---`);
  console.log(`Uploaded: ${results.length}/${imageFiles.length}`);

  // Write mapping file
  const mappingFile = `upload-mapping-${Date.now()}.json`;
  fs.writeFileSync(mappingFile, JSON.stringify(results, null, 2));
  console.log(`\nMapping saved to: ${mappingFile}`);
}

uploadImages();
