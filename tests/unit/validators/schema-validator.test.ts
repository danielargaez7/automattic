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
});
