import type { ThemeSpec } from '../schemas/theme-spec';
import type { UserInput } from '../schemas/user-input';

export interface GenerationResult {
  spec: ThemeSpec;
  model: string;
  promptVersion: string;
  tokensUsed: number;
  repairAttempts: number;
}

export interface ThemeGenerationProvider {
  generateThemeSpec(input: UserInput): Promise<GenerationResult>;
  readonly name: string;
}
