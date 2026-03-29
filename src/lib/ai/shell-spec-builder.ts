import type { ThemeSpec, ColorToken, FontFamily } from '../schemas/theme-spec';

export interface ShellTokens {
  siteName: string;
  slug: string;
  tagline: string;
  tags: string[];
  colors: ColorToken[];
  headingFont: { family: string; googleFont: boolean };
  bodyFont: { family: string; googleFont: boolean };
  headerStyle: 'default' | 'centered' | 'minimal' | 'transparent';
  styleVariations: Array<{
    slug: string;
    title: string;
    colors: ColorToken[];
  }>;
}

// Standard font size scale — same across all shell-backed themes
const FONT_SIZES = [
  { slug: 'small',    name: 'Small',            size: '0.875rem', fluid: { min: '0.875rem', max: '1rem' } },
  { slug: 'medium',   name: 'Medium',           size: '1rem' },
  { slug: 'large',    name: 'Large',            size: '1.25rem',  fluid: { min: '1.125rem', max: '1.5rem' } },
  { slug: 'x-large',  name: 'Extra Large',      size: '1.75rem',  fluid: { min: '1.5rem',   max: '2.25rem' } },
  { slug: 'xx-large', name: 'Extra Extra Large', size: '2.5rem',  fluid: { min: '2rem',     max: '3.25rem' } },
];

// Standard spacing scale
const SPACING = [
  { slug: '20', name: 'XS',   size: '0.5rem' },
  { slug: '30', name: 'S',    size: '1rem' },
  { slug: '40', name: 'M',    size: '1.5rem' },
  { slug: '50', name: 'L',    size: '2rem' },
  { slug: '60', name: 'XL',   size: '3rem' },
  { slug: '70', name: 'XXL',  size: '4rem' },
  { slug: '80', name: 'XXXL', size: '5rem' },
];

function makeFontFamilies(
  heading: { family: string; googleFont: boolean },
  body: { family: string; googleFont: boolean },
): FontFamily[] {
  const headingName = heading.family.split(',')[0].trim();
  const bodyName = body.family.split(',')[0].trim();

  // Use kebab-case slug from the first font name
  const toSlug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  return [
    {
      slug: toSlug(headingName) || 'heading',
      name: headingName,
      fontFamily: heading.family,
      category: 'heading',
      googleFont: heading.googleFont,
      fontFace: [{ fontWeight: '300 700', fontStyle: 'normal' }],
    },
    {
      slug: toSlug(bodyName) || 'body',
      name: bodyName,
      fontFamily: body.family,
      category: 'body',
      googleFont: body.googleFont,
      fontFace: [{ fontWeight: '400 600', fontStyle: 'normal' }],
    },
  ];
}

/**
 * Normalize color slugs to match their role.
 * The AI often invents descriptive slugs (e.g. "dark-earth") instead of
 * the required semantic slugs (e.g. "primary"). Since everything in codegen
 * and shell patterns references --wp--preset--color--primary etc., the slug
 * MUST equal the role. We use the role field (which AI fills correctly) to fix it.
 * Also applied to style variation colors.
 */
function normalizeColorSlugs(colors: ColorToken[]): ColorToken[] {
  return colors.map((c) => ({ ...c, slug: c.role }));
}

/**
 * Construct a full ThemeSpec from minimal AI-returned tokens.
 * All structural defaults (font sizes, spacing, layout, templates) are hardcoded —
 * only the design identity (colors, fonts, metadata) comes from the AI.
 */
export function buildShellThemeSpec(tokens: ShellTokens): ThemeSpec {
  const fontFamilies = makeFontFamilies(tokens.headingFont, tokens.bodyFont);

  return {
    metadata: {
      name: tokens.siteName,
      slug: tokens.slug,
      description: tokens.tagline,
      author: 'BlockForge',
      version: '1.0.0',
      tags: tokens.tags,
    },

    designTokens: {
      colors: normalizeColorSlugs(tokens.colors),
      typography: {
        fontFamilies,
        fontSizes: FONT_SIZES,
      },
      spacing: SPACING,
      borderRadius: {
        small: '4px',
        medium: '8px',
        large: '16px',
        full: '9999px',
      },
    },

    layout: {
      contentSize: '760px',
      wideSize: '1200px',
    },

    header: {
      style: tokens.headerStyle ?? 'minimal',
      sticky: false,
      hasSearch: false,
      hasSocialLinks: false,
    },

    footer: {
      columns: 2,
      hasNewsletter: false,
      hasSocialLinks: true,
      hasCopyright: true,
    },

    // Templates are present to satisfy the schema + generate non-home template files.
    // The home template gets overridden by the shell in the packager.
    templates: [
      { slug: 'index',   title: 'Index',        sections: [{ type: 'blog-latest-posts' }] },
      { slug: 'home',    title: 'Home',          sections: [] },
      { slug: 'single',  title: 'Single Post',   sections: [] },
      { slug: 'page',    title: 'Page',          sections: [] },
      { slug: 'archive', title: 'Archive',       sections: [] },
    ],

    styleVariations: tokens.styleVariations.map((v) => ({
      slug: v.slug,
      title: v.title,
      colors: v.colors ? normalizeColorSlugs(v.colors) : undefined,
    })),
  };
}

/**
 * Basic validation of the AI response — much simpler than full ThemeSpec validation.
 * Returns null if valid, or an error string if not.
 */
export function validateShellTokens(raw: unknown): ShellTokens | null {
  if (!raw || typeof raw !== 'object') return null;
  const t = raw as Record<string, unknown>;

  if (typeof t.siteName !== 'string' || !t.siteName) return null;
  if (typeof t.slug !== 'string' || !/^[a-z0-9-]+$/.test(t.slug)) return null;
  if (!Array.isArray(t.colors) || t.colors.length < 5) return null;
  if (!t.headingFont || typeof (t.headingFont as Record<string, unknown>).family !== 'string') return null;
  if (!t.bodyFont || typeof (t.bodyFont as Record<string, unknown>).family !== 'string') return null;

  // Ensure colors have required fields
  for (const c of t.colors as unknown[]) {
    const color = c as Record<string, unknown>;
    if (!color.slug || !color.hex || !color.role) return null;
    if (!/^#[0-9a-fA-F]{6}$/.test(color.hex as string)) return null;
  }

  return {
    siteName: t.siteName as string,
    slug: t.slug as string,
    tagline: (t.tagline as string) || '',
    tags: Array.isArray(t.tags) ? (t.tags as string[]) : [],
    colors: t.colors as ColorToken[],
    headingFont: t.headingFont as { family: string; googleFont: boolean },
    bodyFont: t.bodyFont as { family: string; googleFont: boolean },
    headerStyle: (t.headerStyle as ShellTokens['headerStyle']) ?? 'minimal',
    styleVariations: Array.isArray(t.styleVariations)
      ? (t.styleVariations as ShellTokens['styleVariations'])
      : [],
  };
}
