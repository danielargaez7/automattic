import { describe, it, expect } from 'vitest';
import { scoreAccessibility } from '@/lib/validators/accessibility';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';

const spec = ThemeSpecSchema.parse(photographySpec);

describe('scoreAccessibility', () => {
  it('returns a score between 0 and 100', () => {
    const result = scoreAccessibility(spec);
    expect(result.overall).toBeGreaterThanOrEqual(0);
    expect(result.overall).toBeLessThanOrEqual(100);
  });

  it('returns a valid grade', () => {
    const result = scoreAccessibility(spec);
    expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
  });

  it('includes multiple accessibility checks', () => {
    const result = scoreAccessibility(spec);
    expect(result.checks.length).toBeGreaterThanOrEqual(5);
  });

  it('checks have valid status values', () => {
    const result = scoreAccessibility(spec);
    for (const check of result.checks) {
      expect(['pass', 'warn', 'fail']).toContain(check.status);
      expect(check.name).toBeTruthy();
      expect(check.details).toBeTruthy();
    }
  });

  it('passes contrast check for photography spec (dark theme with light text)', () => {
    const result = scoreAccessibility(spec);
    const textContrast = result.checks.find((c) => c.name.includes('Text contrast'));
    expect(textContrast?.status).toBe('pass');
  });

  it('gives high score to well-designed spec', () => {
    const result = scoreAccessibility(spec);
    expect(result.overall).toBeGreaterThanOrEqual(60);
  });
});
