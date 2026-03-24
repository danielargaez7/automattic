import type { ValidationError } from '../validators/schema-validator';

/**
 * Build a repair prompt from validation errors and the original spec.
 */
export function buildRepairPrompt(errors: ValidationError[], originalSpec: string): string {
  const errorList = errors
    .map((e) => `- ${e.path}: ${e.message}`)
    .join('\n');

  return `The Theme Spec you generated has validation errors. Fix ONLY the errors listed below.
Return the complete, corrected Theme Spec JSON. No explanations, no code fences.

ERRORS:
${errorList}

ORIGINAL SPEC:
${originalSpec}`;
}
