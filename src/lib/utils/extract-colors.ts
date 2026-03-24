import sharp from 'sharp';

interface RGB { r: number; g: number; b: number }

function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function quantize(value: number, step = 24): number {
  return Math.round(value / step) * step;
}

/**
 * Extract the top N dominant colors from a base64-encoded image.
 * Uses sharp to resize + get raw pixels, then buckets by quantized RGB.
 */
export async function extractDominantColors(
  base64: string,
  mimeType: string,
  count = 6
): Promise<string[]> {
  const buffer = Buffer.from(base64, 'base64');

  // Resize small for speed, remove alpha
  const { data, info } = await sharp(buffer)
    .resize(64, 64, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Count color buckets
  const buckets = new Map<string, { color: RGB; count: number }>();

  for (let i = 0; i < data.length; i += 3) {
    const r = quantize(data[i]);
    const g = quantize(data[i + 1]);
    const b = quantize(data[i + 2]);

    // Skip near-white and near-black (usually backgrounds/shadows)
    const brightness = (r + g + b) / 3;
    if (brightness > 240 || brightness < 15) continue;

    const key = `${r},${g},${b}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.count++;
    } else {
      buckets.set(key, { color: { r, g, b }, count: 1 });
    }
  }

  // Sort by frequency
  const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);

  // Pick top colors that are visually distinct from each other
  const picked: RGB[] = [];
  for (const { color } of sorted) {
    if (picked.length >= count) break;
    const tooClose = picked.some(p => colorDistance(p, color) < 60);
    if (!tooClose) picked.push(color);
  }

  return picked.map(rgbToHex);
}
