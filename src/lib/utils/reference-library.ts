import fs from 'fs';
import path from 'path';

/**
 * Find the best matching reference image from the library for a given vibe + siteType.
 * Returns base64 data + mimeType, or null if no match found.
 */
export async function findReferenceImage(
  vibe?: string,
  siteType?: string
): Promise<{ data: string; mimeType: string } | null> {
  const libraryDir = path.join(process.cwd(), 'public', 'library');

  if (!vibe) return null;

  const vibeDir = path.join(libraryDir, vibe);
  if (!fs.existsSync(vibeDir)) return null;

  // Preference order: vibe-siteType.jpg > vibe-1.jpg > any jpg in folder
  const candidates = [
    siteType ? `${vibe}-${siteType}.jpg` : null,
    siteType ? `${vibe}-${siteType}.webp` : null,
    `${vibe}-1.jpg`,
    `${vibe}-1.webp`,
  ].filter(Boolean) as string[];

  let filePath: string | null = null;

  for (const candidate of candidates) {
    const full = path.join(vibeDir, candidate);
    if (fs.existsSync(full)) {
      filePath = full;
      break;
    }
  }

  // Fall back to any image in the folder
  if (!filePath) {
    const files = fs.readdirSync(vibeDir).filter((f) => /\.(jpg|jpeg|webp|png)$/i.test(f));
    if (files.length > 0) {
      filePath = path.join(vibeDir, files[0]);
    }
  }

  if (!filePath) return null;

  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

  return { data: buffer.toString('base64'), mimeType };
}
