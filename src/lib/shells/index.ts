import type { ShellDefinition } from './types';
import { blogEditorialShell } from './shells/blog-editorial';
import { blogMinimalShell } from './shells/blog-minimal';
import { portfolioCvShell } from './shells/portfolio-cv';
import { businessBentoShell } from './shells/business-bento';

export type { ShellDefinition } from './types';

/**
 * All registered shells, ordered from most specific to most general.
 * Shell selection scans this list and returns the first match.
 */
const SHELLS: ShellDefinition[] = [
  blogEditorialShell,   // blog + bold/dark/corporate
  blogMinimalShell,     // blog + minimal/warm/organic
  portfolioCvShell,     // portfolio + minimal/elegant
  businessBentoShell,   // business/agency + corporate/bold
];

/**
 * Select the best shell for a given siteType + vibe combination.
 * Returns null if no shell matches (falls back to codegen).
 */
export function selectShell(
  siteType: string | undefined,
  vibe: string | undefined,
): ShellDefinition | null {
  if (!siteType) return null;

  // First pass: match on both siteType AND vibe
  if (vibe) {
    for (const shell of SHELLS) {
      if (
        shell.siteTypes.includes(siteType) &&
        shell.vibes.includes(vibe)
      ) {
        return shell;
      }
    }
  }

  // Second pass: match on siteType only (first registered shell for that type)
  for (const shell of SHELLS) {
    if (shell.siteTypes.includes(siteType)) {
      return shell;
    }
  }

  return null;
}
