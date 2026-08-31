const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'icon-192.svg');
const outDir = path.join(__dirname, '..', 'public');

async function generate() {
  const sizes = [192, 512];
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }
}

generate().catch(console.error);
