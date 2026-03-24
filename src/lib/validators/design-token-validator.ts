import type { ThemeSpec, ColorToken } from '../schemas/theme-spec';
import type { ValidationError } from './schema-validator';

/**
 * Parse a hex color string to RGB components.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const val = parseInt(hex.slice(1), 16);
  return {
    r: (val >> 16) & 255,
    g: (val >> 8) & 255,
    b: val & 255,
  };
}

/**
 * Calculate relative luminance per WCAG 2.1.
 */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two hex colors.
 */
export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse a CSS size value to pixels (approximate, for range checking).
 */
function parseSizeToPx(size: string): number | null {
  const match = size.match(/^([\d.]+)(px|rem|em)$/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  const unit = match[2];
  if (unit === 'px') return value;
  if (unit === 'rem' || unit === 'em') return value * 16;
  return null;
}

/**
 * Validate design tokens for accessibility and quality.
 */
export function validateDesignTokens(spec: ThemeSpec): ValidationError[] {
  const errors: ValidationError[] = [];

  // ── Color contrast checks ──
  const colorMap = new Map<string, ColorToken>();
  for (const color of spec.designTokens.colors) {
    colorMap.set(color.role, color);
  }

  const baseColor = colorMap.get('base');
  const contrastColor = colorMap.get('contrast');
  const primaryColor = colorMap.get('primary');
  const surfaceColor = colorMap.get('surface');

  // Text on background contrast checks (WCAG AA ≥ 4.5:1)
  const contrastPairs: [string, ColorToken | undefined, ColorToken | undefined][] = [
    ['contrast on base', contrastColor, baseColor],
    ['primary on base', primaryColor, baseColor],
  ];

  if (surfaceColor && contrastColor) {
    contrastPairs.push(['contrast on surface', contrastColor, surfaceColor]);
  }

  for (const [label, fg, bg] of contrastPairs) {
    if (fg && bg) {
      const ratio = contrastRatio(fg.hex, bg.hex);
      if (ratio < 4.5) {
        errors.push({
          path: 'designTokens.colors',
          message: `Color pair "${label}" has contrast ratio ${ratio.toFixed(2)}:1, which fails WCAG AA (minimum 4.5:1). Foreground: ${fg.slug} (${fg.hex}), Background: ${bg.slug} (${bg.hex}).`,
          code: 'contrast_ratio',
        });
      }
    }
  }

  // ── Font size range checks ──
  for (const fontSize of spec.designTokens.typography.fontSizes) {
    const px = parseSizeToPx(fontSize.size);
    if (px !== null) {
      if (px < 12) {
        errors.push({
          path: `designTokens.typography.fontSizes.${fontSize.slug}`,
          message: `Font size "${fontSize.slug}" (${fontSize.size}) is below 12px minimum.`,
          code: 'font_size_too_small',
        });
      }
      if (px > 96) {
        errors.push({
          path: `designTokens.typography.fontSizes.${fontSize.slug}`,
          message: `Font size "${fontSize.slug}" (${fontSize.size}) exceeds 96px maximum.`,
          code: 'font_size_too_large',
        });
      }
    }
  }

  // ── Spacing scale monotonicity ──
  const spacingSizes = spec.designTokens.spacing
    .map((s) => ({ slug: s.slug, px: parseSizeToPx(s.size) }))
    .filter((s): s is { slug: string; px: number } => s.px !== null);

  for (let i = 1; i < spacingSizes.length; i++) {
    if (spacingSizes[i].px <= spacingSizes[i - 1].px) {
      errors.push({
        path: `designTokens.spacing`,
        message: `Spacing scale is not monotonic: "${spacingSizes[i].slug}" (${spacingSizes[i].px}px) is not larger than "${spacingSizes[i - 1].slug}" (${spacingSizes[i - 1].px}px).`,
        code: 'spacing_not_monotonic',
      });
    }
  }

  return errors;
}
