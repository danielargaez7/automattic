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
    parts.push(`Visual Vibe: ${input.vibe} — let this vibe drive every design decision`);
  }

  if (input.colorPreferences) {
    parts.push(`Color Preferences (user-specified, take these seriously): ${input.colorPreferences}`);
  }

  if (input.fontPreferences) {
    parts.push(`Font Preferences (user-specified): ${input.fontPreferences}`);
  }

  if (input.pages && input.pages.length > 0) {
    parts.push(`Pages to include: ${input.pages.join(', ')}`);
  }

  if (input.inspirationImages && input.inspirationImages.length > 0) {
    parts.push(
      `\nIMPORTANT — Inspiration images were provided above. You MUST:\n` +
      `1. Visually analyze each image carefully\n` +
      `2. Extract the exact dominant hex color values you see (backgrounds, buttons, text, accents)\n` +
      `3. Use those extracted colors as your color palette — do NOT invent different colors\n` +
      `4. Match the typography mood (serif vs sans, weight, formality) visible in the images\n` +
      `5. Mirror the overall layout density and visual style you observe`
    );
  }

  if (input.extractedDesign) {
    parts.push(
      `\nDesign system extracted from reference URL:\n` +
      `Colors found: ${(input.extractedDesign.colors ?? []).join(', ')}\n` +
      `Fonts found: ${(input.extractedDesign.fontFamilies ?? []).join(', ')}\n` +
      `Mood: ${input.extractedDesign.mood}\n` +
      `Use these colors and fonts as your primary palette.`
    );
  }

  parts.push(
    `\nDesign brief: Create something DISTINCTIVE and BEAUTIFUL. Rich color palette, expressive typography, patterns that bring the site to life. Think senior agency designer, not generic template.\n` +
    `\nOutput ONLY the raw JSON object. No code fences. No explanations. Ensure high contrast between "base" (background) and "contrast" (text) colors — minimum 4.5:1 ratio.`
  );

  return parts.join('\n');
}
