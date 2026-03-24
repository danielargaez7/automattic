/**
 * Return a PHP expression that resolves a bundled theme image URL.
 * Falls back to '' if the index is out of range.
 */
export function themeImgUrl(imageUris: string[], index: number): string {
  const uri = imageUris[index];
  if (!uri) return '';
  return `<?php echo esc_url( get_template_directory_uri() . '/${uri}' ); ?>`;
}

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
