import { list } from '@vercel/blob';

async function listBlobs() {
  try {
    const { blobs } = await list();
    console.log(`Found ${blobs.length} blobs:\n`);
    blobs.forEach(blob => {
      console.log(`- ${blob.pathname} (${blob.url})`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listBlobs();
