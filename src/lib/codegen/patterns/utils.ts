/**
 * Generate the PHP header comment block required for WordPress pattern files.
 */
export function patternHeader(opts: {
  title: string;
  slug: string;
  categories: string;
  keywords: string;
  blockTypes?: string;
}): string {
  return `<?php
/**
 * Title: ${opts.title}
 * Slug: ${opts.slug}
 * Categories: ${opts.categories}
 * Keywords: ${opts.keywords}${opts.blockTypes ? `\n * Block Types: ${opts.blockTypes}` : ''}
 */
?>`;
}
