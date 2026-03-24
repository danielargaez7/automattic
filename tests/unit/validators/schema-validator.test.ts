import { describe, it, expect } from 'vitest';
import { validateSchema } from '@/lib/validators/schema-validator';
import photographySpec from '../../fixtures/sample-spec-photography.json';
import malformedSpec from '../../fixtures/malformed-spec.json';

describe('validateSchema', () => {
  it('returns valid for a correct spec', () => {
    const result = validateSchema(photographySpec);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBeDefined();
  });

  it('returns errors for malformed spec', () => {
    const result = validateSchema(malformedSpec);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.data).toBeUndefined();
  });

  it('returns structured error paths', () => {
    const result = validateSchema(malformedSpec);
    expect(result.errors.some((e) => e.path.length > 0)).toBe(true);
    expect(result.errors.every((e) => typeof e.message === 'string')).toBe(true);
    expect(result.errors.every((e) => typeof e.code === 'string')).toBe(true);
  });

  it('returns errors for completely invalid input', () => {
    const result = validateSchema('not an object');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('returns errors for null input', () => {
    const result = validateSchema(null);
    expect(result.valid).toBe(false);
  });

  it('rejects spec with invalid slug (uppercase)', () => {
    const result = validateSchema({ metadata: { slug: 'My-Theme' } });
    expect(result.valid).toBe(false);
  });

  it('rejects spec with invalid slug (spaces)', () => {
    const result = validateSchema({ metadata: { slug: 'my theme' } });
    expect(result.valid).toBe(false);
  });

  it('rejects spec with fewer than 5 colors', () => {
    const spec = JSON.parse(JSON.stringify(photographySpec));
    spec.designTokens.colors = spec.designTokens.colors.slice(0, 2);
    const result = validateSchema(spec);
    expect(result.valid).toBe(false);
  });

  it('rejects spec with invalid hex color', () => {
    const spec = JSON.parse(JSON.stringify(photographySpec));
    spec.designTokens.colors[0].hex = 'not-a-color';
    const result = validateSchema(spec);
    expect(result.valid).toBe(false);
  });
});
