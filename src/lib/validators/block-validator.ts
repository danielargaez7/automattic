import type { ThemeSpec } from '../schemas/theme-spec';
import { PATTERN_TYPES, TEMPLATE_SLUGS } from '../schemas/theme-spec';
import type { ValidationError } from './schema-validator';

/**
 * Validate block-level constraints on the Theme Spec.
 */
export function validateBlocks(spec: ThemeSpec): ValidationError[] {
  const errors: ValidationError[] = [];
  const validPatternTypes = new Set<string>(PATTERN_TYPES);
  const validTemplateSlugs = new Set<string>(TEMPLATE_SLUGS);

  // ── Check all pattern references are valid ──
  for (let i = 0; i < spec.templates.length; i++) {
    const template = spec.templates[i];

    // Verify template slug
    if (!validTemplateSlugs.has(template.slug)) {
      errors.push({
        path: `templates[${i}].slug`,
        message: `Template slug "${template.slug}" is not a valid WordPress template slug. Valid slugs: ${[...validTemplateSlugs].join(', ')}.`,
        code: 'invalid_template_slug',
      });
    }

    // Verify pattern types in sections
    for (let j = 0; j < template.sections.length; j++) {
      const section = template.sections[j];
      if (!validPatternTypes.has(section.type)) {
        errors.push({
          path: `templates[${i}].sections[${j}].type`,
          message: `Pattern type "${section.type}" is not valid. Valid types: ${[...validPatternTypes].join(', ')}.`,
          code: 'invalid_pattern_type',
        });
      }
    }
  }

  // ── Check that 'index' template exists (required by WordPress) ──
  const hasIndex = spec.templates.some((t) => t.slug === 'index');
  if (!hasIndex) {
    errors.push({
      path: 'templates',
      message: 'Theme must include an "index" template (required WordPress fallback).',
      code: 'missing_index_template',
    });
  }

  // ── Check style variations reference valid color roles ──
  const validRoles = new Set(spec.designTokens.colors.map((c) => c.role));
  if (spec.styleVariations) {
    for (let i = 0; i < spec.styleVariations.length; i++) {
      const variation = spec.styleVariations[i];
      if (variation.colors) {
        for (const color of variation.colors) {
          if (!validRoles.has(color.role)) {
            errors.push({
              path: `styleVariations[${i}].colors`,
              message: `Style variation "${variation.slug}" uses color role "${color.role}" which is not present in the base palette.`,
              code: 'invalid_style_variation_role',
            });
          }
        }
      }
    }
  }

  return errors;
}
