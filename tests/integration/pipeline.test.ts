import { describe, it, expect } from 'vitest';
import { packageTheme } from '@/lib/packager/zip';
import { validateThemeSpec } from '@/lib/validators/pipeline';
import { ThemeSpecSchema } from '@/lib/schemas/theme-spec';
import photographySpec from '../fixtures/sample-spec-photography.json';

describe('Full pipeline (spec → validate → codegen → package)', () => {
  it('produces a valid theme ZIP from the photography fixture', async () => {
    // Step 1: Parse and validate spec
    const spec = ThemeSpecSchema.parse(photographySpec);
    const validation = validateThemeSpec(spec);
    expect(validation.valid).toBe(true);

    // Step 2: Package
    const result = await packageTheme(spec);
    expect(result.integrity.valid).toBe(true);
    expect(result.buffer.length).toBeGreaterThan(0);

    // Step 3: Verify file structure
    expect(result.files).toContain('style.css');
    expect(result.files).toContain('theme.json');
    expect(result.files).toContain('functions.php');
    expect(result.files).toContain('templates/index.html');
    expect(result.files).toContain('templates/home.html');
    expect(result.files).toContain('parts/header.html');
    expect(result.files).toContain('parts/footer.html');
  });

  it('rejects a malformed spec before packaging', () => {
    const validation = validateThemeSpec({
      metadata: { name: '', slug: 'bad slug' },
    });
    expect(validation.valid).toBe(false);
    expect(validation.errors.length).toBeGreaterThan(0);
  });
});
