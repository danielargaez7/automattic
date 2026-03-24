import type { ThemeSpec, PatternRef } from '../../schemas/theme-spec';
import { generateHeroCentered, generateHeroSplit, generateHeroFullwidth } from './hero';
import { generateFeaturesGrid, generateFeaturesAlternating } from './features';
import { generateTestimonialsCards, generateTestimonialsCarousel } from './testimonials';
import { generatePricingTable } from './pricing';
import { generateCtaCentered, generateCtaSplit } from './cta';
import { generateFaqAccordion } from './faq';
import { generateTeamGrid } from './team';
import { generateContactForm } from './contact';
import { generateGalleryGrid, generateGalleryMasonry } from './gallery';
import { generateStatsCounter } from './stats';
import { generateNewsletterSignup } from './newsletter';
import { generateBlogLatestPosts } from './blog';
import { generateTextWithImage } from './text-image';
import { generateLogosGrid } from './logos';

type PatternGenerator = (spec: ThemeSpec, imageUris: string[]) => string;

const PATTERN_GENERATORS: Record<string, PatternGenerator> = {
  'hero-centered': generateHeroCentered,
  'hero-split': generateHeroSplit,
  'hero-fullwidth-image': generateHeroFullwidth,
  'features-grid': generateFeaturesGrid,
  'features-alternating': generateFeaturesAlternating,
  'testimonials-cards': generateTestimonialsCards,
  'testimonials-carousel': generateTestimonialsCarousel,
  'pricing-table': generatePricingTable,
  'cta-centered': generateCtaCentered,
  'cta-split': generateCtaSplit,
  'faq-accordion': generateFaqAccordion,
  'team-grid': generateTeamGrid,
  'contact-form': generateContactForm,
  'gallery-grid': generateGalleryGrid,
  'gallery-masonry': generateGalleryMasonry,
  'stats-counter': generateStatsCounter,
  'newsletter-signup': generateNewsletterSignup,
  'blog-latest-posts': generateBlogLatestPosts,
  'text-with-image': generateTextWithImage,
  'logos-grid': generateLogosGrid,
};

/**
 * Generate a pattern PHP file for a given pattern reference.
 */
export function generatePatternFile(spec: ThemeSpec, patternRef: PatternRef, imageUris: string[] = []): string {
  const generator = PATTERN_GENERATORS[patternRef.type];
  if (!generator) {
    throw new Error(`No generator found for pattern type: ${patternRef.type}`);
  }
  return generator(spec, imageUris);
}

/**
 * Collect all unique patterns used across templates and generate their PHP files.
 */
export function generateAllPatterns(
  spec: ThemeSpec,
  imageUris: string[] = [],
): Array<{ filename: string; content: string }> {
  const usedTypes = new Set<string>();

  for (const template of spec.templates) {
    for (const section of template.sections) {
      usedTypes.add(section.type);
    }
  }

  return [...usedTypes].map((type) => ({
    filename: `${type}.php`,
    content: generatePatternFile(spec, { type: type as PatternRef['type'] }, imageUris),
  }));
}
