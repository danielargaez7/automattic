import type { UserInput } from '../../schemas/user-input';

export function buildDesignTokensPrompt(input: UserInput, extractedColors?: string[]): string {
  const parts: string[] = [];

  parts.push(`You are a visual designer. Based on the following brief, output ONLY a JSON object with design tokens. No full theme spec — just colors, fonts, and mood.`);
  parts.push(`\nBrief: ${input.description}`);
  if (input.vibe) parts.push(`Vibe: ${input.vibe}`);
  if (input.siteType) parts.push(`Site Type: ${input.siteType}`);
  if (input.colorPreferences) parts.push(`Color Preferences: ${input.colorPreferences}`);
  if (input.fontPreferences) parts.push(`Font Preferences: ${input.fontPreferences}`);

  if (extractedColors && extractedColors.length > 0) {
    parts.push(`\nExact colors extracted from inspiration images — use these: ${extractedColors.join(', ')}`);
  }

  if (input.extractedDesign) {
    parts.push(`Colors from reference URL: ${(input.extractedDesign.colors ?? []).join(', ')}`);
    parts.push(`Fonts from reference URL: ${(input.extractedDesign.fontFamilies ?? []).join(', ')}`);
  }

  parts.push(`
Output this exact JSON shape (nothing else, no markdown):
{
  "colors": [
    { "slug": "primary", "name": string, "hex": "#RRGGBB", "role": "primary" },
    { "slug": "secondary", "name": string, "hex": "#RRGGBB", "role": "secondary" },
    { "slug": "accent", "name": string, "hex": "#RRGGBB", "role": "accent" },
    { "slug": "base", "name": string, "hex": "#RRGGBB", "role": "base" },
    { "slug": "contrast", "name": string, "hex": "#RRGGBB", "role": "contrast" },
    { "slug": "surface", "name": string, "hex": "#RRGGBB", "role": "surface" }
  ],
  "headingFont": { "family": string (CSS value), "googleFont": boolean },
  "bodyFont": { "family": string (CSS value), "googleFont": boolean },
  "mood": string (one sentence describing the visual feel)
}

Rules:
- base and contrast must have at least 4.5:1 contrast ratio
- Colors must be distinctive and match the brief — no generic blue/gray
- If inspiration colors were provided, use them as the palette foundation`);

  return parts.join('\n');
}
