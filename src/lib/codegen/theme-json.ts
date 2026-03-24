import type { ThemeSpec } from '../schemas/theme-spec';

/**
 * Compile a ThemeSpec into a valid WordPress theme.json v3 object.
 */
export function generateThemeJson(spec: ThemeSpec): Record<string, unknown> {
  return {
    $schema: 'https://schemas.wp.org/trunk/theme.json',
    version: 3,

    settings: {
      appearanceTools: true,
      useRootPaddingAwareAlignments: true,

      color: {
        palette: spec.designTokens.colors.map((c) => ({
          slug: c.slug,
          name: c.name,
          color: c.hex,
        })),
        gradients: [
          {
            slug: 'primary-to-accent',
            name: 'Primary to Accent',
            gradient: 'linear-gradient(135deg, var(--wp--preset--color--primary) 0%, var(--wp--preset--color--accent) 100%)',
          },
          {
            slug: 'accent-to-primary',
            name: 'Accent to Primary',
            gradient: 'linear-gradient(135deg, var(--wp--preset--color--accent) 0%, var(--wp--preset--color--primary) 100%)',
          },
          {
            slug: 'base-to-surface',
            name: 'Base to Surface',
            gradient: 'linear-gradient(180deg, var(--wp--preset--color--base) 0%, var(--wp--preset--color--surface) 100%)',
          },
          {
            slug: 'primary-diagonal',
            name: 'Primary Diagonal',
            gradient: 'linear-gradient(135deg, var(--wp--preset--color--primary) 0%, var(--wp--preset--color--neutral) 100%)',
          },
        ],
        defaultPalette: false,
        defaultGradients: false,
      },

      typography: {
        fontFamilies: spec.designTokens.typography.fontFamilies.map((f) => ({
          slug: f.slug,
          name: f.name,
          fontFamily: f.fontFamily,
          ...(f.fontFace && f.fontFace.length > 0
            ? {
                fontFace: f.fontFace.map((face) => ({
                  fontFamily: f.fontFamily.split(',')[0].replace(/'/g, '').trim(),
                  fontWeight: face.fontWeight,
                  fontStyle: face.fontStyle || 'normal',
                  ...(face.src ? { src: [face.src] } : {}),
                })),
              }
            : {}),
        })),
        fontSizes: spec.designTokens.typography.fontSizes.map((s) => ({
          slug: s.slug,
          name: s.name,
          size: s.size,
          ...(s.fluid ? { fluid: s.fluid } : {}),
        })),
        defaultFontSizes: false,
      },

      spacing: {
        spacingSizes: spec.designTokens.spacing.map((s) => ({
          slug: s.slug,
          name: s.name,
          size: s.size,
        })),
        units: ['px', 'em', 'rem', 'vh', 'vw', '%'],
      },

      layout: {
        contentSize: spec.layout.contentSize,
        wideSize: spec.layout.wideSize,
      },

      border: {
        color: true,
        radius: true,
        style: true,
        width: true,
      },

      shadow: {
        defaultPresets: true,
        presets: spec.designTokens.shadows
          ? spec.designTokens.shadows.map((s) => ({
              slug: s.slug,
              name: s.name,
              shadow: s.shadow,
            }))
          : [],
      },
    },

    styles: {
      color: {
        background: 'var(--wp--preset--color--base)',
        text: 'var(--wp--preset--color--contrast)',
      },
      typography: {
        fontFamily: 'var(--wp--preset--font-family--body)',
        fontSize: 'var(--wp--preset--font-size--medium)',
        lineHeight: '1.6',
      },
      spacing: {
        padding: {
          top: '0',
          right: 'var(--wp--preset--spacing--50)',
          bottom: '0',
          left: 'var(--wp--preset--spacing--50)',
        },
        blockGap: 'var(--wp--preset--spacing--50)',
      },
      elements: {
        heading: {
          typography: {
            fontFamily: 'var(--wp--preset--font-family--heading)',
            fontWeight: '700',
            lineHeight: '1.2',
          },
          color: {
            text: 'var(--wp--preset--color--primary)',
          },
        },
        h1: {
          typography: { fontSize: 'var(--wp--preset--font-size--xx-large)' },
        },
        h2: {
          typography: { fontSize: 'var(--wp--preset--font-size--x-large)' },
        },
        h3: {
          typography: { fontSize: 'var(--wp--preset--font-size--large)' },
        },
        link: {
          color: { text: 'var(--wp--preset--color--accent)' },
          ':hover': { color: { text: 'var(--wp--preset--color--primary)' } },
        },
        button: {
          color: {
            background: 'var(--wp--preset--color--accent)',
            text: 'var(--wp--preset--color--contrast)',
          },
          typography: { fontWeight: '600' },
          border: {
            radius: spec.designTokens.borderRadius?.medium || '8px',
          },
        },
      },
      blocks: {
        'core/search': {
          border: {
            radius: spec.designTokens.borderRadius?.medium || '8px',
          },
        },
      },
    },

    templateParts: [
      { name: 'header', title: 'Header', area: 'header' },
      { name: 'footer', title: 'Footer', area: 'footer' },
    ],

    customTemplates: [],
  };
}
