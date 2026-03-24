import type { ShellDefinition } from './types';
import { blogEditorialShell } from './shells/blog-editorial';
import { blogMinimalShell } from './shells/blog-minimal';
import { portfolioCvShell } from './shells/portfolio-cv';
import { businessBentoShell } from './shells/business-bento';
import { creativeGalleryShell } from './shells/creative-gallery';
import { photoGridShell } from './shells/photo-grid';
import { communityOrgShell } from './shells/community-org';
import { foodRestaurantShell } from './shells/food-restaurant';

export type { ShellDefinition } from './types';

/**
 * All registered shells, ordered from most specific to most general.
 * Shell selection scans this list and returns the first match.
 */
const SHELLS: ShellDefinition[] = [
  // Blog
  blogEditorialShell,     // blog + bold/dark/corporate  → spiel news grid
  blogMinimalShell,       // blog/personal + minimal/warm → substrata post loop

  // Portfolio
  portfolioCvShell,       // portfolio + minimal/elegant  → readymade CV/resume
  photoGridShell,         // portfolio + minimalist/dark  → grammer photo grid
  creativeGalleryShell,   // portfolio + bold/dark/playful → vueo masonry

  // Business / Org
  businessBentoShell,     // business + corporate/bold    → kentwood bento
  communityOrgShell,      // business + warm/organic      → koinonia nonprofit

  // Food / Lifestyle
  foodRestaurantShell,    // business/ecommerce + warm    → TT25 food layout
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
