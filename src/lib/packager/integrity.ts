import type { ThemeSpec } from '../schemas/theme-spec';

export interface IntegrityError {
  file: string;
  message: string;
}

export interface IntegrityResult {
  valid: boolean;
  errors: IntegrityError[];
}

/**
 * Post-packaging integrity checks.
 */
export function validateIntegrity(
  files: Map<string, string>,
  spec: ThemeSpec
): IntegrityResult {
  const errors: IntegrityError[] = [];

  // Required files must exist
  const requiredFiles = ['style.css', 'theme.json'];
  for (const required of requiredFiles) {
    if (!files.has(required)) {
      errors.push({ file: required, message: `Required file "${required}" is missing.` });
    }
  }

  // style.css must have theme name in header
  const styleCss = files.get('style.css');
  if (styleCss && !styleCss.includes('Theme Name:')) {
    errors.push({
      file: 'style.css',
      message: 'style.css is missing the "Theme Name:" header.',
    });
  }

  // theme.json must be valid JSON
  const themeJson = files.get('theme.json');
  if (themeJson) {
    try {
      JSON.parse(themeJson);
    } catch {
      errors.push({ file: 'theme.json', message: 'theme.json contains invalid JSON.' });
    }
  }

  // Template parts referenced in templates must exist
  const hasHeader = files.has('parts/header.html');
  const hasFooter = files.has('parts/footer.html');
  if (!hasHeader) {
    errors.push({ file: 'parts/header.html', message: 'Header template part is missing.' });
  }
  if (!hasFooter) {
    errors.push({ file: 'parts/footer.html', message: 'Footer template part is missing.' });
  }

  // Required index template
  if (!files.has('templates/index.html')) {
    errors.push({
      file: 'templates/index.html',
      message: 'Required "index.html" template is missing.',
    });
  }

  // Pattern files referenced in templates should exist
  for (const template of spec.templates) {
    for (const section of template.sections) {
      const patternFile = `patterns/${section.type}.php`;
      if (!files.has(patternFile)) {
        errors.push({
          file: patternFile,
          message: `Pattern "${section.type}" is referenced in template "${template.slug}" but the file is missing.`,
        });
      }
    }
  }

  // Pattern PHP files must have valid headers
  for (const [path, content] of files) {
    if (path.startsWith('patterns/') && path.endsWith('.php')) {
      if (!content.includes('Title:') || !content.includes('Slug:')) {
        errors.push({
          file: path,
          message: `Pattern file "${path}" is missing required header fields (Title, Slug).`,
        });
      }
    }
  }

  // No empty required files
  for (const [path, content] of files) {
    if (content.trim().length === 0 && !path.startsWith('styles/')) {
      errors.push({
        file: path,
        message: `File "${path}" is empty.`,
      });
    }
  }

  // No Custom HTML blocks anywhere
  for (const [path, content] of files) {
    if (content.includes('<!-- wp:html -->') || content.includes('<!-- wp:html ')) {
      errors.push({
        file: path,
        message: `File "${path}" contains a forbidden Custom HTML block (<!-- wp:html -->).`,
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
