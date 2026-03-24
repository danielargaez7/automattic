import { describe, it, expect } from 'vitest';
import { UserInputSchema } from '@/lib/schemas/user-input';
import photographyInput from '../../fixtures/sample-input-photography.json';
import businessInput from '../../fixtures/sample-input-business.json';
import blogInput from '../../fixtures/sample-input-blog.json';

describe('UserInputSchema', () => {
  it('validates photography input fixture', () => {
    const result = UserInputSchema.safeParse(photographyInput);
    expect(result.success).toBe(true);
  });

  it('validates business input fixture', () => {
    const result = UserInputSchema.safeParse(businessInput);
    expect(result.success).toBe(true);
  });

  it('validates blog input fixture', () => {
    const result = UserInputSchema.safeParse(blogInput);
    expect(result.success).toBe(true);
  });

  it('validates minimal input (description only)', () => {
    const result = UserInputSchema.safeParse({
      description: 'A simple blog theme with clean typography.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty description', () => {
    const result = UserInputSchema.safeParse({ description: '' });
    expect(result.success).toBe(false);
  });

  it('rejects description under 10 characters', () => {
    const result = UserInputSchema.safeParse({ description: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects description over 2000 characters', () => {
    const result = UserInputSchema.safeParse({ description: 'A'.repeat(2001) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid site type', () => {
    const result = UserInputSchema.safeParse({
      description: 'A valid description for testing.',
      siteType: 'spaceship',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid site types', () => {
    const siteTypes = ['blog', 'portfolio', 'business', 'ecommerce', 'personal', 'agency'];
    for (const siteType of siteTypes) {
      const result = UserInputSchema.safeParse({
        description: 'A valid description for testing.',
        siteType,
      });
      expect(result.success).toBe(true);
    }
  });

  it('accepts optional pages array', () => {
    const result = UserInputSchema.safeParse({
      description: 'A valid description for testing.',
      pages: ['home', 'about', 'blog', 'contact'],
    });
    expect(result.success).toBe(true);
  });
});
