import { describe, it, expect } from 'vitest';
import { generateThemeJson } from '@/lib/codegen/theme-json';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';

const spec = ThemeSpecSchema.parse(photographySpec);

describe('generateThemeJson', () => {
  const themeJson = generateThemeJson(spec);

  it('produces valid JSON', () => {
    expect(() => JSON.stringify(themeJson)).not.toThrow();
  });

  it('uses schema version 3', () => {
    expect(themeJson.version).toBe(3);
  });

  it('includes $schema reference', () => {
    expect(themeJson.$schema).toBe('https://schemas.wp.org/trunk/theme.json');
  });

  it('maps colors from spec', () => {
    const settings = themeJson.settings as Record<string, unknown>;
    const color = settings.color as Record<string, unknown>;
    const palette = color.palette as Array<{ slug: string; color: string }>;
    expect(palette).toHaveLength(6);
    expect(palette[0].slug).toBe('primary');
    expect(palette[0].color).toBe('#E2E8F0');
  });

  it('maps font families from spec', () => {
    const settings = themeJson.settings as Record<string, unknown>;
    const typography = settings.typography as Record<string, unknown>;
    const fontFamilies = typography.fontFamilies as Array<{ slug: string }>;
    expect(fontFamilies).toHaveLength(2);
    expect(fontFamilies[0].slug).toBe('heading');
    expect(fontFamilies[1].slug).toBe('body');
  });

  it('maps font sizes from spec', () => {
    const settings = themeJson.settings as Record<string, unknown>;
    const typography = settings.typography as Record<string, unknown>;
    const fontSizes = typography.fontSizes as Array<{ slug: string }>;
    expect(fontSizes).toHaveLength(5);
  });

  it('maps layout sizes from spec', () => {
    const settings = themeJson.settings as Record<string, unknown>;
    const layout = settings.layout as Record<string, string>;
    expect(layout.contentSize).toBe('720px');
    expect(layout.wideSize).toBe('1200px');
  });

  it('includes template parts definitions', () => {
    const parts = themeJson.templateParts as Array<{ name: string; area: string }>;
    expect(parts).toHaveLength(2);
    expect(parts[0]).toEqual({ name: 'header', title: 'Header', area: 'header' });
    expect(parts[1]).toEqual({ name: 'footer', title: 'Footer', area: 'footer' });
  });

  it('sets base as background and contrast as text in styles', () => {
    const styles = themeJson.styles as Record<string, unknown>;
    const color = styles.color as Record<string, string>;
    expect(color.background).toBe('var(--wp--preset--color--base)');
    expect(color.text).toBe('var(--wp--preset--color--contrast)');
  });
});
