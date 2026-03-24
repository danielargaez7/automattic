import { NextRequest, NextResponse } from 'next/server';

interface ExtractedDesign {
  url: string;
  colors: string[];
  fontFamilies: string[];
  mood: string;
}

/**
 * POST /api/extract-design
 * Fetches a URL and extracts design tokens (colors, fonts, mood).
 */
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Fetch the page
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DreamBuilder/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${response.status})` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const design = extractDesignFromHtml(html, parsedUrl.toString());

    return NextResponse.json(design);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to extract design';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function extractDesignFromHtml(html: string, url: string): ExtractedDesign {
  const colors = new Set<string>();
  const fontFamilies = new Set<string>();

  // Extract hex colors from inline styles and CSS
  const hexMatches = html.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  for (const hex of hexMatches) {
    // Normalize to 6-digit hex
    if (hex.length === 4) {
      const expanded = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
      colors.add(expanded.toUpperCase());
    } else if (hex.length === 7) {
      colors.add(hex.toUpperCase());
    }
  }

  // Extract rgb/rgba colors
  const rgbMatches = html.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g) || [];
  for (const rgb of rgbMatches) {
    const parts = rgb.match(/(\d+)/g);
    if (parts && parts.length >= 3) {
      const hex = `#${parseInt(parts[0]).toString(16).padStart(2, '0')}${parseInt(parts[1]).toString(16).padStart(2, '0')}${parseInt(parts[2]).toString(16).padStart(2, '0')}`;
      colors.add(hex.toUpperCase());
    }
  }

  // Extract CSS custom properties that look like colors
  const cssVarMatches = html.match(/--[\w-]+:\s*#[0-9a-fA-F]{3,8}/g) || [];
  for (const match of cssVarMatches) {
    const hex = match.match(/#[0-9a-fA-F]{3,8}/)?.[0];
    if (hex && hex.length === 7) {
      colors.add(hex.toUpperCase());
    }
  }

  // Extract font families
  const fontMatches =
    html.match(/font-family\s*:\s*([^;}"]+)/g) || [];
  for (const match of fontMatches) {
    const family = match
      .replace(/font-family\s*:\s*/, '')
      .split(',')[0]
      .replace(/['"]/g, '')
      .trim();
    if (family && !family.startsWith('var(') && family.length < 50) {
      fontFamilies.add(family);
    }
  }

  // Extract Google Fonts from link tags
  const googleFontMatches =
    html.match(/fonts\.googleapis\.com\/css2?\?family=([^"&]+)/g) || [];
  for (const match of googleFontMatches) {
    const families = match
      .replace(/fonts\.googleapis\.com\/css2?\?family=/, '')
      .split('&family=');
    for (const f of families) {
      const name = decodeURIComponent(f.split(':')[0]).replace(/\+/g, ' ');
      fontFamilies.add(name);
    }
  }

  // Extract meta theme-color
  const themeColorMatch = html.match(/meta\s+name="theme-color"\s+content="([^"]+)"/i);
  if (themeColorMatch && themeColorMatch[1].startsWith('#')) {
    colors.add(themeColorMatch[1].toUpperCase());
  }

  // Deduplicate and filter out very common/boring colors
  const boring = new Set(['#FFFFFF', '#000000', '#FFF', '#000', '#TRANSPARENT']);
  const uniqueColors = [...colors]
    .filter((c) => !boring.has(c) && c.length === 7)
    .slice(0, 12);

  const uniqueFonts = [...fontFamilies]
    .filter((f) => !['inherit', 'initial', 'sans-serif', 'serif', 'monospace'].includes(f.toLowerCase()))
    .slice(0, 6);

  // Infer mood from color palette
  const mood = inferMood(uniqueColors);

  return {
    url,
    colors: uniqueColors,
    fontFamilies: uniqueFonts,
    mood,
  };
}

function inferMood(colors: string[]): string {
  if (colors.length === 0) return 'neutral';

  let darkCount = 0;
  let warmCount = 0;
  let coolCount = 0;
  let saturatedCount = 0;

  for (const hex of colors) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const avg = (r + g + b) / 3;

    if (avg < 80) darkCount++;
    if (r > b + 30) warmCount++;
    if (b > r + 30) coolCount++;

    // Saturation check (rough)
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 80) saturatedCount++;
  }

  const total = colors.length;
  const parts: string[] = [];

  if (darkCount > total * 0.5) parts.push('dark');
  if (warmCount > coolCount + 1) parts.push('warm');
  else if (coolCount > warmCount + 1) parts.push('cool');
  if (saturatedCount > total * 0.4) parts.push('vibrant');
  else if (saturatedCount < total * 0.2) parts.push('muted');

  return parts.length > 0 ? parts.join(', ') : 'balanced';
}
