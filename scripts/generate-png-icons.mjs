import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Table for fast CRC32 computation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const toCrc = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const c = crc32(toCrc);
  chunk.writeUInt32BE(c, 8 + len);
  return chunk;
}

function createPng(width, height, isMaskable = false) {
  // Generate RGBA pixel buffer
  // Format: height lines, each line starts with 1 filter byte (0 = none), followed by width * 4 RGBA bytes
  const lineSize = 1 + width * 4;
  const rawData = Buffer.alloc(height * lineSize);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    const lineOffset = y * lineSize;
    rawData[lineOffset] = 0; // Filter: None

    for (let x = 0; x < width; x++) {
      const pxOffset = lineOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background color: Deep midnight #001621 -> #022436
      let r = 0;
      let g = 22 + Math.floor((y / height) * 14);
      let b = 33 + Math.floor((y / height) * 21);
      let a = 255;

      // Brain silhouette & nodes
      if (dist < radius) {
        // Outer glow
        if (dist > radius - 6) {
          r = 56;
          g = 189;
          b = 248;
          a = 180;
        }

        // Left & right lobes
        const inLeftLobe = Math.hypot(x - (cx - width * 0.15), y - cy) < width * 0.28;
        const inRightLobe = Math.hypot(x - (cx + width * 0.15), y - cy) < width * 0.28;

        if (inLeftLobe || inRightLobe) {
          r = 2;
          g = 50;
          b = 78;
        }

        // Center spark (Orange Accent #ff4103)
        const centerDist = Math.hypot(dx, dy);
        if (centerDist < width * 0.12) {
          r = 255;
          g = 65;
          b = 3;
        } else if (centerDist < width * 0.18) {
          r = 255;
          g = 107;
          b = 61;
        }

        // Nodes (Cyan #38bdf8)
        const nodes = [
          [cx, cy - height * 0.24],
          [cx - width * 0.22, cy - height * 0.12],
          [cx + width * 0.22, cy - height * 0.12],
          [cx - width * 0.18, cy + height * 0.15],
          [cx + width * 0.18, cy + height * 0.15],
          [cx, cy + height * 0.26],
        ];

        for (const [nx, ny] of nodes) {
          const nd = Math.hypot(x - nx, y - ny);
          if (nd < width * 0.045) {
            r = 56;
            g = 189;
            b = 248;
            a = 255;
          } else if (nd < width * 0.055) {
            r = 255;
            g = 255;
            b = 255;
            a = 255;
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Header chunk IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression method
  ihdrData[11] = 0; // Filter method
  ihdrData[12] = 0; // Interlace method

  const ihdrChunk = makeChunk('IHDR', ihdrData);
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const pngSig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. pwa-192x192.png
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192));
console.log('Created pwa-192x192.png');

// 2. pwa-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512));
console.log('Created pwa-512x512.png');

// 3. pwa-maskable-512x512.png
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
console.log('Created pwa-maskable-512x512.png');

// 4. apple-touch-icon.png (180x180 for iOS)
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180));
console.log('Created apple-touch-icon.png');

// 5. favicon.ico
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64));
console.log('Created favicon.ico');

console.log('All PWA icons generated successfully.');
