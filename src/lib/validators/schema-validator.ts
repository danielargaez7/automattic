import { ThemeSpecSchema, type ThemeSpec } from '../schemas/theme-spec';

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface SchemaValidationResult {
  valid: boolean;
  errors: ValidationError[];
  data?: ThemeSpec;
}

export function validateSchema(input: unknown): SchemaValidationResult {
  const result = ThemeSpecSchema.safeParse(input);

  if (result.success) {
    return { valid: true, errors: [], data: result.data };
  }

  const errors: ValidationError[] = result.error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));

  return { valid: false, errors };
}
