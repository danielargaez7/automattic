import type { UserInput } from '../../schemas/user-input';

export const PROMPT_VERSION = 'v1';

export function buildUserPrompt(input: UserInput): string {
  const parts: string[] = [];

  parts.push(`Generate a WordPress Block Theme spec for the following site:`);
  parts.push(`\nDescription: ${input.description}`);

  if (input.siteType) {
    parts.push(`Site Type: ${input.siteType}`);
  }

  if (input.vibe) {
    parts.push(`Visual Vibe: ${input.vibe}`);
  }

  if (input.colorPreferences) {
    parts.push(`Color Preferences: ${input.colorPreferences}`);
  }

  if (input.fontPreferences) {
    parts.push(`Font Preferences: ${input.fontPreferences}`);
  }

  if (input.pages && input.pages.length > 0) {
    parts.push(`Pages to include: ${input.pages.join(', ')}`);
  }

  parts.push(
    `\nRemember: Output ONLY the raw JSON object. No code fences. No explanations. The "base" color is the background; "contrast" is the main text color. Ensure high contrast between them.`
  );

  return parts.join('\n');
}
