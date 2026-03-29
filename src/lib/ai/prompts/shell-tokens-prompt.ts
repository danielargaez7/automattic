import type { UserInput } from '../../schemas/user-input';

/**
 * Lightweight prompt for shell-backed generation.
 * Only asks for design identity (colors, fonts, metadata, style variations).
 * Structural content comes from the shell + codegen — not the AI.
 */
export function buildShellTokensPrompt(
  input: UserInput,
  extractedColors?: string[],
): string {
  const parts: string[] = [];

  parts.push(
    `You are a senior brand designer. Based on the brief below, output ONLY a JSON object with the visual identity for this site. No full theme spec — just the design tokens, metadata, and two style variations.`,
  );

  parts.push(`\nBrief: ${input.description}`);
  if (input.vibe) parts.push(`Vibe: ${input.vibe}`);
  if (input.siteType) parts.push(`Site Type: ${input.siteType}`);
  if (input.colorPreferences) parts.push(`Color Preferences: ${input.colorPreferences}`);
  if (input.fontPreferences) parts.push(`Font Preferences: ${input.fontPreferences}`);

  if (extractedColors && extractedColors.length > 0) {
    parts.push(
      `\nExact pixel colors extracted from inspiration images — build the palette from these: ${extractedColors.join(', ')}`,
    );
  }

  if (input.extractedDesign) {
    parts.push(`Colors from reference URL: ${(input.extractedDesign.colors ?? []).join(', ')}`);
    parts.push(`Fonts from reference URL: ${(input.extractedDesign.fontFamilies ?? []).join(', ')}`);
  }

  parts.push(`
Output this exact JSON (nothing else, no markdown, no code fences):
{
  "siteName": string (2-6 word human name for the site),
  "slug": string (kebab-case, e.g. "atelier-studio"),
  "tagline": string (one evocative sentence),
  "tags": string[] (3-6 relevant tags),
  "colors": [
    { "slug": "primary",  "name": string, "hex": "#RRGGBB", "role": "primary" },
    { "slug": "secondary","name": string, "hex": "#RRGGBB", "role": "secondary" },
    { "slug": "accent",   "name": string, "hex": "#RRGGBB", "role": "accent" },
    { "slug": "base",     "name": string, "hex": "#RRGGBB", "role": "base" },
    { "slug": "contrast", "name": string, "hex": "#RRGGBB", "role": "contrast" },
    { "slug": "surface",  "name": string, "hex": "#RRGGBB", "role": "surface" },
    { "slug": "neutral",  "name": string, "hex": "#RRGGBB", "role": "neutral" }
  ],
  "headingFont": { "family": string (CSS font-family value), "googleFont": boolean },
  "bodyFont":    { "family": string (CSS font-family value), "googleFont": boolean },
  "headerStyle": "default" | "centered" | "minimal" | "transparent",
  "styleVariations": [
    { "slug": string, "title": string, "colors": [ ...same 7-color structure... ] }
  ]
}

Design rules:
- NEVER use generic blue/gray — make it distinctive and specific to the brief
- "base" is the page background, "contrast" is the main text — must have ≥4.5:1 contrast ratio
- "accent" drives buttons and links — should pop against "base"
- Choose a heading/body font pairing with real character (serif + sans is a strong combo)
- Include exactly 2 style variations (e.g. light + dark, or warm + cool)
- If inspiration colors were provided, use them as the palette foundation`);

  return parts.join('\n');
}
