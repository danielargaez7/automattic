import { describe, it, expect } from 'vitest';
import { generateAllPatterns, generatePatternFile } from '@/lib/codegen/patterns/index';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';

const spec = ThemeSpecSchema.parse(photographySpec);

describe('generateAllPatterns', () => {
  it('generates patterns for all used types', () => {
    const patterns = generateAllPatterns(spec);
    // Photography spec uses: blog-latest-posts, hero-fullwidth-image, gallery-masonry, text-with-image, cta-centered
    expect(patterns.length).toBeGreaterThanOrEqual(5);
  });

  it('generates PHP files with valid headers', () => {
    const patterns = generateAllPatterns(spec);
    for (const p of patterns) {
      expect(p.filename).toMatch(/\.php$/);
      expect(p.content).toContain('<?php');
      expect(p.content).toContain('Title:');
      expect(p.content).toContain('Slug:');
      expect(p.content).toContain('Categories:');
    }
  });

  it('uses i18n-safe strings in patterns', () => {
    const patterns = generateAllPatterns(spec);
    for (const p of patterns) {
      expect(p.content).toContain('esc_html_x');
    }
  });

  it('uses design token preset classes, not hardcoded values', () => {
    const patterns = generateAllPatterns(spec);
    for (const p of patterns) {
      // Should reference preset slugs
      expect(p.content).not.toContain('style="color:#');
      expect(p.content).not.toContain('style="background-color:#');
    }
  });

  it('never uses the Custom HTML block', () => {
    const patterns = generateAllPatterns(spec);
    for (const p of patterns) {
      expect(p.content).not.toContain('<!-- wp:html');
    }
  });
});

describe('generatePatternFile', () => {
  it('throws for unknown pattern type', () => {
    expect(() =>
      generatePatternFile(spec, { type: 'nonexistent' as never })
    ).toThrow('No generator found');
  });

  it('generates hero-centered pattern', () => {
    const content = generatePatternFile(spec, { type: 'hero-centered' });
    expect(content).toContain('Hero Centered');
    expect(content).toContain('wp:cover');
    expect(content).toContain(spec.metadata.slug);
  });

  it('generates features-grid pattern', () => {
    const content = generatePatternFile(spec, { type: 'features-grid' });
    expect(content).toContain('Features Grid');
    expect(content).toContain('wp:columns');
  });

  it('generates blog-latest-posts pattern with query loop', () => {
    const content = generatePatternFile(spec, { type: 'blog-latest-posts' });
    expect(content).toContain('wp:query');
    expect(content).toContain('wp:post-template');
  });
});
