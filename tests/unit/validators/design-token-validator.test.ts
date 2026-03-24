import { describe, it, expect } from 'vitest';
import { validateDesignTokens, contrastRatio } from '@/lib/validators/design-token-validator';
import type { ThemeSpec } from '@/lib/schemas/theme-spec';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';

function parseSpec(overrides: Record<string, unknown> = {}): ThemeSpec {
  return ThemeSpecSchema.parse({ ...photographySpec, ...overrides });
}

describe('contrastRatio', () => {
  it('returns 21:1 for black on white', () => {
    const ratio = contrastRatio('#FFFFFF', '#000000');
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('returns 1:1 for same colors', () => {
    const ratio = contrastRatio('#FF0000', '#FF0000');
    expect(ratio).toBeCloseTo(1, 1);
  });
});

describe('validateDesignTokens', () => {
  it('passes for valid photography spec', () => {
    const spec = parseSpec();
    const errors = validateDesignTokens(spec);
    expect(errors).toHaveLength(0);
  });

  it('catches low contrast between text and background', () => {
    const spec = parseSpec({
      designTokens: {
        ...photographySpec.designTokens,
        colors: [
          { slug: 'primary', name: 'Primary', hex: '#F0F0F0', role: 'primary' },
          { slug: 'secondary', name: 'Secondary', hex: '#E0E0E0', role: 'secondary' },
          { slug: 'accent', name: 'Accent', hex: '#D0D0D0', role: 'accent' },
          { slug: 'base', name: 'Base', hex: '#FAFAFA', role: 'base' },
          { slug: 'contrast', name: 'Contrast', hex: '#F5F5F5', role: 'contrast' },
        ],
      },
    });
    const errors = validateDesignTokens(spec);
    expect(errors.some((e) => e.code === 'contrast_ratio')).toBe(true);
  });

  it('catches font sizes below 12px', () => {
    const spec = parseSpec({
      designTokens: {
        ...photographySpec.designTokens,
        typography: {
          ...photographySpec.designTokens.typography,
          fontSizes: [
            { slug: 'tiny', name: 'Tiny', size: '8px' },
            { slug: 'small', name: 'Small', size: '0.875rem' },
            { slug: 'medium', name: 'Medium', size: '1rem' },
            { slug: 'large', name: 'Large', size: '1.25rem' },
            { slug: 'x-large', name: 'Extra Large', size: '1.75rem' },
          ],
        },
      },
    });
    const errors = validateDesignTokens(spec);
    expect(errors.some((e) => e.code === 'font_size_too_small')).toBe(true);
  });

  it('catches font sizes above 96px', () => {
    const spec = parseSpec({
      designTokens: {
        ...photographySpec.designTokens,
        typography: {
          ...photographySpec.designTokens.typography,
          fontSizes: [
            { slug: 'small', name: 'Small', size: '0.875rem' },
            { slug: 'medium', name: 'Medium', size: '1rem' },
            { slug: 'large', name: 'Large', size: '1.25rem' },
            { slug: 'x-large', name: 'Extra Large', size: '1.75rem' },
            { slug: 'massive', name: 'Massive', size: '120px' },
          ],
        },
      },
    });
    const errors = validateDesignTokens(spec);
    expect(errors.some((e) => e.code === 'font_size_too_large')).toBe(true);
  });

  it('catches non-monotonic spacing scale', () => {
    const spec = parseSpec({
      designTokens: {
        ...photographySpec.designTokens,
        spacing: [
          { slug: '20', name: '2', size: '0.5rem' },
          { slug: '30', name: '3', size: '0.75rem' },
          { slug: '40', name: '4', size: '1rem' },
          { slug: '50', name: '5', size: '0.5rem' }, // goes backwards
          { slug: '60', name: '6', size: '2rem' },
        ],
      },
    });
    const errors = validateDesignTokens(spec);
    expect(errors.some((e) => e.code === 'spacing_not_monotonic')).toBe(true);
  });
});
