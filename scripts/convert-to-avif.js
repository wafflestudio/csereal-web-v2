import { readdir } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

const imageDirs = [
  'app/components/ui/assets',
  'app/routes/about/assets',
  'app/routes/about/overview/assets',
  'app/routes/main/assets',
];

const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

async function convertToAvif(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!imageExtensions.includes(ext)) {
    return;
  }

  const dir = dirname(filePath);
  const name = basename(filePath, ext);
  const outputPath = join(dir, `${name}.avif`);

  console.log(`Converting ${filePath} → ${outputPath}`);

  await sharp(filePath).avif({ quality: 80, effort: 6 }).toFile(outputPath);

  const originalStats = await sharp(filePath).metadata();
  const avifStats = await sharp(outputPath).metadata();

  console.log(`  Original: ${originalStats.size} bytes`);
  console.log(`  AVIF: ${avifStats.size} bytes`);
  console.log(
    `  Savings: ${((1 - avifStats.size / originalStats.size) * 100).toFixed(1)}%\n`,
  );
}

async function processDirectory(dirPath) {
  const fullPath = join(projectRoot, dirPath);
  console.log(`\nProcessing ${dirPath}...`);

  try {
    const files = await readdir(fullPath);

    for (const file of files) {
      const filePath = join(fullPath, file);
      await convertToAvif(filePath);
    }
  } catch (error) {
    console.error(`Error processing ${dirPath}:`, error.message);
  }
}

async function main() {
  console.log('Converting images to AVIF format...\n');

  for (const dir of imageDirs) {
    await processDirectory(dir);
  }

  console.log('✓ Conversion complete!');
}

main().catch(console.error);
