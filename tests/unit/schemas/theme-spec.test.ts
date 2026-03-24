import { describe, it, expect } from 'vitest';
import { ThemeSpecSchema, ColorTokenSchema, TemplateSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';
import malformedSpec from '../../fixtures/malformed-spec.json';

describe('ThemeSpecSchema', () => {
  it('validates a well-formed photography portfolio spec', () => {
    const result = ThemeSpecSchema.safeParse(photographySpec);
    expect(result.success).toBe(true);
  });

  it('rejects a spec with empty name', () => {
    const result = ThemeSpecSchema.safeParse(malformedSpec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with invalid slug (spaces/uppercase)', () => {
    const spec = { ...photographySpec, metadata: { ...photographySpec.metadata, slug: 'BAD SLUG' } };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with too few colors (minimum 5)', () => {
    const spec = {
      ...photographySpec,
      designTokens: {
        ...photographySpec.designTokens,
        colors: photographySpec.designTokens.colors.slice(0, 2),
      },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with too few font families (minimum 2)', () => {
    const spec = {
      ...photographySpec,
      designTokens: {
        ...photographySpec.designTokens,
        typography: {
          ...photographySpec.designTokens.typography,
          fontFamilies: [photographySpec.designTokens.typography.fontFamilies[0]],
        },
      },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with too few font sizes (minimum 5)', () => {
    const spec = {
      ...photographySpec,
      designTokens: {
        ...photographySpec.designTokens,
        typography: {
          ...photographySpec.designTokens.typography,
          fontSizes: [photographySpec.designTokens.typography.fontSizes[0]],
        },
      },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with too few spacing steps (minimum 5)', () => {
    const spec = {
      ...photographySpec,
      designTokens: {
        ...photographySpec.designTokens,
        spacing: photographySpec.designTokens.spacing.slice(0, 2),
      },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with no templates', () => {
    const spec = { ...photographySpec, templates: [] };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects a spec with too many tags (max 10)', () => {
    const spec = {
      ...photographySpec,
      metadata: {
        ...photographySpec.metadata,
        tags: Array.from({ length: 11 }, (_, i) => `tag-${i}`),
      },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });

  it('rejects invalid hex color format', () => {
    const result = ColorTokenSchema.safeParse({
      slug: 'primary',
      name: 'Primary',
      hex: 'not-a-color',
      role: 'primary',
    });
    expect(result.success).toBe(false);
  });

  it('rejects 3-digit hex colors (must be 6-digit)', () => {
    const result = ColorTokenSchema.safeParse({
      slug: 'primary',
      name: 'Primary',
      hex: '#FFF',
      role: 'primary',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid pattern type in a template', () => {
    const result = TemplateSchema.safeParse({
      slug: 'home',
      title: 'Homepage',
      sections: [{ type: 'hero-banner' }], // not a valid pattern type
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid template slug', () => {
    const result = TemplateSchema.safeParse({
      slug: 'custom-page', // not in allowed list
      title: 'Custom',
      sections: [],
    });
    expect(result.success).toBe(false);
  });

  it('applies defaults for optional fields', () => {
    const result = ThemeSpecSchema.safeParse(photographySpec);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.metadata.author).toBe('BlockForge');
      expect(result.data.metadata.version).toBe('1.0.0');
    }
  });

  it('accepts description up to 500 characters', () => {
    const spec = {
      ...photographySpec,
      metadata: { ...photographySpec.metadata, description: 'A'.repeat(500) },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(true);
  });

  it('rejects description over 500 characters', () => {
    const spec = {
      ...photographySpec,
      metadata: { ...photographySpec.metadata, description: 'A'.repeat(501) },
    };
    const result = ThemeSpecSchema.safeParse(spec);
    expect(result.success).toBe(false);
  });
});
