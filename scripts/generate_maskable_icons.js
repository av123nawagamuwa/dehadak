import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generate compliant maskable icons for Dehadak.lk PWA
 * - Solid luxury theme background: #1c100c (R: 28, G: 16, B: 12, A: 255)
 * - Logo scaled to ~70% to guarantee it stays strictly inside the 80% safe zone circle
 * - Bilinear interpolation for smooth anti-aliased scaling
 */
function createMaskableIcon(srcPath, destPath, targetSize, scaleRatio = 0.70) {
  const srcBuffer = fs.readFileSync(srcPath);
  const srcPng = PNG.sync.read(srcBuffer);

  const destPng = new PNG({
    width: targetSize,
    height: targetSize,
    fill: false,
  });

  const bgR = 28;  // #1c
  const bgG = 16;  // #10
  const bgB = 12;  // #0c
  const bgA = 255;

  // Fill canvas with solid background
  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const idx = (targetSize * y + x) << 2;
      destPng.data[idx] = bgR;
      destPng.data[idx + 1] = bgG;
      destPng.data[idx + 2] = bgB;
      destPng.data[idx + 3] = bgA;
    }
  }

  // Calculate scaled logo bounding box inside safe zone
  const scaledWidth = Math.round(targetSize * scaleRatio);
  const scaledHeight = Math.round(targetSize * scaleRatio);
  const offsetX = Math.round((targetSize - scaledWidth) / 2);
  const offsetY = Math.round((targetSize - scaledHeight) / 2);

  // Bilinear sampling from srcPng
  for (let destY = 0; destY < scaledHeight; destY++) {
    const srcY = (destY / scaledHeight) * (srcPng.height - 1);
    const y0 = Math.floor(srcY);
    const y1 = Math.min(y0 + 1, srcPng.height - 1);
    const dy = srcY - y0;

    for (let destX = 0; destX < scaledWidth; destX++) {
      const srcX = (destX / scaledWidth) * (srcPng.width - 1);
      const x0 = Math.floor(srcX);
      const x1 = Math.min(x0 + 1, srcPng.width - 1);
      const dx = srcX - x0;

      // Sample 4 neighbor pixels
      const idx00 = (srcPng.width * y0 + x0) << 2;
      const idx10 = (srcPng.width * y0 + x1) << 2;
      const idx01 = (srcPng.width * y1 + x0) << 2;
      const idx11 = (srcPng.width * y1 + x1) << 2;

      // Interpolate RGBA
      const r = (1 - dy) * ((1 - dx) * srcPng.data[idx00] + dx * srcPng.data[idx10]) +
                dy * ((1 - dx) * srcPng.data[idx01] + dx * srcPng.data[idx11]);
      const g = (1 - dy) * ((1 - dx) * srcPng.data[idx00 + 1] + dx * srcPng.data[idx10 + 1]) +
                dy * ((1 - dx) * srcPng.data[idx01 + 1] + dx * srcPng.data[idx11 + 1]);
      const b = (1 - dy) * ((1 - dx) * srcPng.data[idx00 + 2] + dx * srcPng.data[idx10 + 2]) +
                dy * ((1 - dx) * srcPng.data[idx01 + 2] + dx * srcPng.data[idx11 + 2]);
      const a = (1 - dy) * ((1 - dx) * srcPng.data[idx00 + 3] + dx * srcPng.data[idx10 + 3]) +
                dy * ((1 - dx) * srcPng.data[idx01 + 3] + dx * srcPng.data[idx11 + 3]);

      const targetIdx = (targetSize * (destY + offsetY) + (destX + offsetX)) << 2;

      // Alpha compositing over solid background
      const normA = a / 255;
      destPng.data[targetIdx] = Math.round(r * normA + bgR * (1 - normA));
      destPng.data[targetIdx + 1] = Math.round(g * normA + bgG * (1 - normA));
      destPng.data[targetIdx + 2] = Math.round(b * normA + bgB * (1 - normA));
      destPng.data[targetIdx + 3] = 255;
    }
  }

  const outBuffer = PNG.sync.write(destPng);
  fs.writeFileSync(destPath, outBuffer);
  console.log(`Generated maskable icon: ${destPath} (${targetSize}x${targetSize})`);
}

const iconsDir = path.join(__dirname, '../public/icons');
const baseLogo = path.join(__dirname, '../public/logo.png');

createMaskableIcon(baseLogo, path.join(iconsDir, 'maskable-icon-192x192.png'), 192, 0.70);
createMaskableIcon(baseLogo, path.join(iconsDir, 'maskable-icon-512x512.png'), 512, 0.70);

console.log('Maskable icons generated successfully with safe zone compliance.');
