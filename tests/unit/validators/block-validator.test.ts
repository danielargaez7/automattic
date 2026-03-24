import { describe, it, expect } from 'vitest';
import { validateBlocks } from '@/lib/validators/block-validator';
import type { ThemeSpec } from '@/lib/schemas/theme-spec';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';

function parseSpec(overrides: Record<string, unknown> = {}): ThemeSpec {
  return ThemeSpecSchema.parse({ ...photographySpec, ...overrides });
}

describe('validateBlocks', () => {
  it('passes for valid photography spec', () => {
    const spec = parseSpec();
    const errors = validateBlocks(spec);
    expect(errors).toHaveLength(0);
  });

  it('catches missing index template', () => {
    const spec = parseSpec({
      templates: [
        {
          slug: 'home',
          title: 'Homepage',
          sections: [{ type: 'hero-centered' }],
        },
      ],
    });
    const errors = validateBlocks(spec);
    expect(errors.some((e) => e.code === 'missing_index_template')).toBe(true);
  });

  it('passes when index template is present', () => {
    const spec = parseSpec();
    const errors = validateBlocks(spec);
    expect(errors.some((e) => e.code === 'missing_index_template')).toBe(false);
  });
});
