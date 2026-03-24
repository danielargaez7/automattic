import { describe, it, expect } from 'vitest';
import { packageTheme } from '@/lib/packager/zip';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../../fixtures/sample-spec-photography.json';

const spec = ThemeSpecSchema.parse(photographySpec);

describe('packageTheme', () => {
  it('produces a non-empty ZIP buffer', async () => {
    const result = await packageTheme(spec);
    expect(result.buffer).toBeInstanceOf(Buffer);
    expect(result.buffer.length).toBeGreaterThan(0);
  });

  it('ZIP starts with PK signature', async () => {
    const result = await packageTheme(spec);
    expect(result.buffer[0]).toBe(0x50); // P
    expect(result.buffer[1]).toBe(0x4b); // K
  });

  it('passes integrity checks', async () => {
    const result = await packageTheme(spec);
    expect(result.integrity.valid).toBe(true);
    expect(result.integrity.errors).toHaveLength(0);
  });

  it('includes all required files', async () => {
    const result = await packageTheme(spec);
    expect(result.files).toContain('style.css');
    expect(result.files).toContain('theme.json');
    expect(result.files).toContain('functions.php');
    expect(result.files).toContain('templates/index.html');
    expect(result.files).toContain('parts/header.html');
    expect(result.files).toContain('parts/footer.html');
  });

  it('includes pattern files for used patterns', async () => {
    const result = await packageTheme(spec);
    // Photography spec home template uses hero-fullwidth-image, gallery-masonry, text-with-image, cta-centered
    expect(result.files).toContain('patterns/hero-fullwidth-image.php');
    expect(result.files).toContain('patterns/gallery-masonry.php');
    expect(result.files).toContain('patterns/text-with-image.php');
    expect(result.files).toContain('patterns/cta-centered.php');
  });

  it('includes style variation files', async () => {
    const result = await packageTheme(spec);
    expect(result.files).toContain('styles/warm-light.json');
  });

  it('generates correct number of template files', async () => {
    const result = await packageTheme(spec);
    const templates = result.files.filter((f) => f.startsWith('templates/'));
    expect(templates).toHaveLength(spec.templates.length);
  });
});
