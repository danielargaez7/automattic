import { z } from 'zod';

// ── Color with semantic role ──
export const ColorTokenSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  role: z.enum(['primary', 'secondary', 'accent', 'base', 'contrast', 'neutral', 'surface']),
});

// ── Typography token ──
export const FontFaceSchema = z.object({
  fontWeight: z.string(),
  fontStyle: z.enum(['normal', 'italic']).default('normal'),
  src: z.string().optional(),
});

export const FontFamilySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  fontFamily: z.string(),
  category: z.enum(['heading', 'body']),
  googleFont: z.boolean().default(false),
  fontFace: z.array(FontFaceSchema).optional(),
});

export const FontSizeSchema = z.object({
  slug: z.string(),
  name: z.string(),
  size: z.string(),
  fluid: z
    .object({
      min: z.string(),
      max: z.string(),
    })
    .optional(),
});

export const TypographyScaleSchema = z.object({
  fontFamilies: z.array(FontFamilySchema).min(2).max(4),
  fontSizes: z.array(FontSizeSchema).min(5),
});

// ── Spacing scale ──
export const SpacingStepSchema = z.object({
  slug: z.string(),
  name: z.string(),
  size: z.string(),
});

export const SpacingScaleSchema = z.array(SpacingStepSchema).min(5);

// ── Layout ──
export const LayoutSchema = z.object({
  contentSize: z.string(),
  wideSize: z.string(),
});

// ── Pattern reference ──
export const PATTERN_TYPES = [
  'hero-centered',
  'hero-split',
  'hero-fullwidth-image',
  'features-grid',
  'features-alternating',
  'testimonials-cards',
  'testimonials-carousel',
  'pricing-table',
  'cta-centered',
  'cta-split',
  'faq-accordion',
  'team-grid',
  'contact-form',
  'gallery-grid',
  'gallery-masonry',
  'stats-counter',
  'newsletter-signup',
  'blog-latest-posts',
  'text-with-image',
  'logos-grid',
] as const;

export const PatternRefSchema = z.object({
  type: z.enum(PATTERN_TYPES),
  config: z.record(z.string(), z.any()).optional(),
});

// ── Template definition ──
export const TEMPLATE_SLUGS = [
  'index',
  'home',
  'single',
  'page',
  'archive',
  '404',
  'search',
] as const;

export const TemplateSchema = z.object({
  slug: z.enum(TEMPLATE_SLUGS),
  title: z.string(),
  sections: z.array(PatternRefSchema),
});

// ── Template part configs ──
export const HeaderConfigSchema = z.object({
  style: z.enum(['default', 'centered', 'minimal', 'transparent']),
  sticky: z.boolean().default(false),
  hasSearch: z.boolean().default(false),
  hasSocialLinks: z.boolean().default(false),
});

export const FooterConfigSchema = z.object({
  columns: z.number().min(1).max(4).default(3),
  hasNewsletter: z.boolean().default(false),
  hasSocialLinks: z.boolean().default(true),
  hasCopyright: z.boolean().default(true),
});

// ── Style variation ──
export const StyleVariationSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  colors: z.array(ColorTokenSchema).optional(),
  fontFamilies: z.array(FontFamilySchema).optional(),
});

// ── Border radius ──
export const BorderRadiusSchema = z
  .object({
    small: z.string().default('4px'),
    medium: z.string().default('8px'),
    large: z.string().default('16px'),
    full: z.string().default('9999px'),
  })
  .optional();

// ── Shadow ──
export const ShadowSchema = z.object({
  slug: z.string(),
  name: z.string(),
  shadow: z.string(),
});

// ══════════════════════════════════════════════
// THE COMPLETE THEME SPEC
// ══════════════════════════════════════════════
export const ThemeSpecSchema = z.object({
  metadata: z.object({
    name: z.string().min(1).max(100),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    description: z.string().max(500),
    author: z.string().default('BlockForge'),
    version: z.string().default('1.0.0'),
    tags: z.array(z.string()).max(10),
  }),

  designTokens: z.object({
    colors: z.array(ColorTokenSchema).min(5),
    typography: TypographyScaleSchema,
    spacing: SpacingScaleSchema,
    borderRadius: BorderRadiusSchema,
    shadows: z.array(ShadowSchema).optional(),
  }),

  layout: LayoutSchema,

  header: HeaderConfigSchema,
  footer: FooterConfigSchema,

  templates: z.array(TemplateSchema).min(1),

  styleVariations: z.array(StyleVariationSchema).min(1).max(5).optional(),
});

export type ThemeSpec = z.infer<typeof ThemeSpecSchema>;
export type ColorToken = z.infer<typeof ColorTokenSchema>;
export type FontFamily = z.infer<typeof FontFamilySchema>;
export type FontSize = z.infer<typeof FontSizeSchema>;
export type PatternRef = z.infer<typeof PatternRefSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type HeaderConfig = z.infer<typeof HeaderConfigSchema>;
export type FooterConfig = z.infer<typeof FooterConfigSchema>;
export type StyleVariation = z.infer<typeof StyleVariationSchema>;
