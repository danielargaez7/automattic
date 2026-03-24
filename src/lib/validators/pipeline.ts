import { validateSchema, type ValidationError, type SchemaValidationResult } from './schema-validator';
import { validateDesignTokens } from './design-token-validator';
import { validateBlocks } from './block-validator';
import type { ThemeSpec } from '../schemas/theme-spec';

export interface PipelineValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: ThemeSpec;
}

/**
 * Run the full validation pipeline: schema → design tokens → block constraints.
 * Returns all errors from all stages.
 */
export function validateThemeSpec(input: unknown): PipelineValidationResult {
  // Stage 1: Schema validation (must pass before other validators run)
  const schemaResult: SchemaValidationResult = validateSchema(input);

  if (!schemaResult.valid || !schemaResult.data) {
    return {
      valid: false,
      errors: schemaResult.errors,
    };
  }

  const spec = schemaResult.data;

  // Stage 2 & 3: Run design token + block validators in parallel (both use the parsed spec)
  const designTokenErrors = validateDesignTokens(spec);
  const blockErrors = validateBlocks(spec);

  const allErrors = [...designTokenErrors, ...blockErrors];

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    data: spec,
  };
}
