import type { ThemeSpec, StyleVariation } from '../schemas/theme-spec';

/**
 * Generate style variation JSON files from the ThemeSpec.
 */
export function generateStyleVariations(
  spec: ThemeSpec
): Array<{ filename: string; content: string }> {
  if (!spec.styleVariations || spec.styleVariations.length === 0) {
    return [];
  }

  return spec.styleVariations.map((variation) => ({
    filename: `${variation.slug}.json`,
    content: JSON.stringify(buildStyleVariationJson(spec, variation), null, 2),
  }));
}

function buildStyleVariationJson(
  spec: ThemeSpec,
  variation: StyleVariation
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    version: 3,
    title: variation.title,
    settings: {},
    styles: {},
  };

  // Override colors if provided
  if (variation.colors && variation.colors.length > 0) {
    const baseColor = variation.colors.find((c) => c.role === 'base');
    const contrastColor = variation.colors.find((c) => c.role === 'contrast');
    const primaryColor = variation.colors.find((c) => c.role === 'primary');
    const accentColor = variation.colors.find((c) => c.role === 'accent');

    (result.settings as Record<string, unknown>).color = {
      palette: variation.colors.map((c) => ({
        slug: c.slug,
        name: c.name,
        color: c.hex,
      })),
    };

    (result.styles as Record<string, unknown>).color = {
      background: baseColor
        ? `var(--wp--preset--color--${baseColor.slug})`
        : 'var(--wp--preset--color--base)',
      text: contrastColor
        ? `var(--wp--preset--color--${contrastColor.slug})`
        : 'var(--wp--preset--color--contrast)',
    };

    (result.styles as Record<string, unknown>).elements = {
      heading: {
        color: {
          text: primaryColor
            ? `var(--wp--preset--color--${primaryColor.slug})`
            : 'var(--wp--preset--color--primary)',
        },
      },
      link: {
        color: {
          text: accentColor
            ? `var(--wp--preset--color--${accentColor.slug})`
            : 'var(--wp--preset--color--accent)',
        },
      },
      button: {
        color: {
          background: accentColor
            ? `var(--wp--preset--color--${accentColor.slug})`
            : 'var(--wp--preset--color--accent)',
          text: contrastColor
            ? `var(--wp--preset--color--${contrastColor.slug})`
            : 'var(--wp--preset--color--contrast)',
        },
      },
    };
  }

  // Override fonts if provided
  if (variation.fontFamilies && variation.fontFamilies.length > 0) {
    const existingSettings = (result.settings as Record<string, unknown>) || {};
    existingSettings.typography = {
      fontFamilies: variation.fontFamilies.map((f) => ({
        slug: f.slug,
        name: f.name,
        fontFamily: f.fontFamily,
      })),
    };
  }

  return result;
}
