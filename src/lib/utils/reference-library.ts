import fs from 'fs';
import path from 'path';

// ── Keyword → category mapping ──
// Scans the user's description for subject matter keywords to find the
// most relevant reference image — beyond just matching on vibe.
const KEYWORD_CATEGORIES: Array<{ category: string; keywords: string[] }> = [
  {
    category: 'nature',
    keywords: [
      'garden', 'plant', 'flower', 'floral', 'botanical', 'green', 'nature',
      'outdoor', 'organic', 'farm', 'agriculture', 'forest', 'hiking', 'wildlife',
      'landscape', 'environmental', 'eco', 'herb', 'leaf', 'tree',
    ],
  },
  {
    category: 'food',
    keywords: [
      'food', 'restaurant', 'cafe', 'coffee', 'cooking', 'recipe', 'bakery',
      'chef', 'dining', 'eat', 'drink', 'culinary', 'kitchen', 'menu', 'bar',
      'brewery', 'winery', 'catering', 'baking', 'pastry',
    ],
  },
  {
    category: 'architecture',
    keywords: [
      'architecture', 'interior', 'real estate', 'home', 'house', 'property',
      'construction', 'design studio', 'space', 'building', 'renovation',
      'decor', 'furniture', 'housing', 'apartment', 'office',
    ],
  },
  {
    category: 'art',
    keywords: [
      'art', 'gallery', 'museum', 'creative', 'illustration', 'painting',
      'artist', 'craft', 'handmade', 'pottery', 'sculpture', 'exhibit',
      'canvas', 'studio', 'drawing', 'graphic', 'print',
    ],
  },
  {
    category: 'fashion',
    keywords: [
      'fashion', 'clothing', 'style', 'beauty', 'makeup', 'lifestyle',
      'boutique', 'apparel', 'wear', 'model', 'brand', 'jewelry', 'accessories',
      'hair', 'skincare', 'cosmetic', 'wardrobe',
    ],
  },
  {
    category: 'tech',
    keywords: [
      'tech', 'software', 'app', 'startup', 'saas', 'developer', 'digital',
      'ai', 'artificial intelligence', 'code', 'programming', 'product',
      'tool', 'platform', 'analytics', 'data', 'cloud', 'web',
    ],
  },
  {
    category: 'business',
    keywords: [
      'business', 'corporate', 'professional', 'consulting', 'agency',
      'law', 'finance', 'marketing', 'firm', 'company', 'service', 'brand',
      'enterprise', 'b2b', 'management', 'strategy', 'accounting',
    ],
  },
  {
    category: 'travel',
    keywords: [
      'travel', 'adventure', 'explore', 'tourism', 'hotel', 'destination',
      'trip', 'journey', 'vacation', 'tour', 'guide', 'wanderlust',
      'photography', 'landscape', 'city', 'world',
    ],
  },
  {
    category: 'dark-moody',
    keywords: [
      'dark', 'moody', 'music', 'band', 'nightclub', 'bar', 'dramatic',
      'noir', 'night', 'club', 'gothic', 'edgy', 'metal', 'tattoo',
      'underground', 'punk', 'minimal dark',
    ],
  },
  {
    category: 'vibrant',
    keywords: [
      'vibrant', 'colorful', 'bold', 'fun', 'playful', 'festival', 'event',
      'entertainment', 'kids', 'children', 'creative agency', 'energetic',
      'bright', 'lively', 'dynamic',
    ],
  },
  {
    category: 'minimal',
    keywords: [
      'minimal', 'minimalist', 'clean', 'simple', 'zen', 'spa', 'wellness',
      'yoga', 'meditation', 'white space', 'calm', 'breathe', 'mindful',
      'pure', 'elegant', 'refined', 'luxury',
    ],
  },
  {
    category: 'warm',
    keywords: [
      'warm', 'cozy', 'homey', 'family', 'personal', 'blog', 'lifestyle',
      'comfort', 'rustic', 'cottage', 'cabin', 'hygge', 'inviting',
      'community', 'friendly', 'local',
    ],
  },
];

// Vibe → best-fit category fallback (when no keyword match found)
const VIBE_CATEGORY_MAP: Record<string, string> = {
  minimalist: 'minimal',
  bold:       'vibrant',
  elegant:    'minimal',
  playful:    'vibrant',
  corporate:  'business',
  organic:    'nature',
  dark:       'dark-moody',
  warm:       'warm',
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectCategory(description: string, siteType?: string): string | null {
  const text = `${description} ${siteType || ''}`.toLowerCase();

  // Score each category by keyword matches
  const scores = KEYWORD_CATEGORIES.map(({ category, keywords }) => ({
    category,
    score: keywords.filter((kw) => text.includes(kw)).length,
  }));

  const best = scores.sort((a, b) => b.score - a.score)[0];
  return best.score > 0 ? best.category : null;
}

/**
 * Find the best matching reference image from the library.
 * Priority: keyword match on description → vibe fallback → any available image.
 * Returns base64 + mimeType, or null if library is empty.
 */
export async function findReferenceImage(
  vibe?: string,
  siteType?: string,
  description?: string,
): Promise<{ data: string; mimeType: string; category: string } | null> {
  const libraryDir = path.join(process.cwd(), 'public', 'library');

  // 1. Try keyword match on description
  let category: string | null = description
    ? detectCategory(description, siteType)
    : null;

  // 2. Fall back to vibe → category map
  if (!category && vibe) {
    category = VIBE_CATEGORY_MAP[vibe] ?? null;
  }

  // 3. Try the matched category
  if (category) {
    const image = pickImageFromCategory(libraryDir, category);
    if (image) return { ...image, category };
  }

  // 4. Last resort — any image from any category
  const allCategories = fs.readdirSync(libraryDir).filter((f) => {
    const full = path.join(libraryDir, f);
    return fs.statSync(full).isDirectory();
  });

  for (const cat of allCategories) {
    const image = pickImageFromCategory(libraryDir, cat);
    if (image) return { ...image, category: cat };
  }

  return null;
}

function pickImageFromCategory(
  libraryDir: string,
  category: string,
): { data: string; mimeType: string } | null {
  const catDir = path.join(libraryDir, category);
  if (!fs.existsSync(catDir)) return null;

  const files = fs.readdirSync(catDir).filter((f) =>
    /\.(jpg|jpeg|webp|png)$/i.test(f)
  );
  if (files.length === 0) return null;

  const file = pickRandom(files);
  const filePath = path.join(catDir, file);
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(file).toLowerCase();
  const mimeType =
    ext === '.webp' ? 'image/webp' : ext === '.png' ? 'image/png' : 'image/jpeg';

  return { data: buffer.toString('base64'), mimeType };
}
