/**
 * Normalize a shell pattern's block HTML so it works with any generated theme:
 * - Swap source theme slug → target slug
 * - Remap non-standard color tokens → our standard set
 * - Replace bundled image paths → theme image assets
 * - Fix get_stylesheet_directory_uri() → get_template_directory_uri()
 */
export function normalizeShell(
  html: string,
  sourceSlug: string,
  targetSlug: string,
  tokenMap: Record<string, string>,
  imageUris: string[],
): string {
  let out = html;

  // ── Slug references ──────────────────────────────────────────────────────
  // Pattern slug prefixes: "sourceSlug/some-pattern" → "targetSlug/some-pattern"
  out = out.replaceAll(`"${sourceSlug}/`, `"${targetSlug}/`);
  // i18n text-domain: 'sourceSlug' → 'targetSlug'
  out = out.replaceAll(`'${sourceSlug}'`, `'${targetSlug}'`);

  // ── Directory URI ────────────────────────────────────────────────────────
  out = out.replaceAll('get_stylesheet_directory_uri()', 'get_template_directory_uri()');

  // ── Color token remapping ────────────────────────────────────────────────
  // Process longer token names first to avoid partial replacements
  const sortedEntries = Object.entries(tokenMap).sort(
    ([a], [b]) => b.length - a.length,
  );
  for (const [from, to] of sortedEntries) {
    if (from === to) continue;
    // JSON attribute values: "backgroundColor":"secondary" → "backgroundColor":"surface"
    out = out.replaceAll(`:"${from}"`, `:"${to}"`);
    // CSS classes
    out = out.replaceAll(`has-${from}-background-color`, `has-${to}-background-color`);
    out = out.replaceAll(`has-${from}-color`, `has-${to}-color`);
    out = out.replaceAll(`has-${from}-border-color`, `has-${to}-border-color`);
    // CSS custom property vars (two formats WP uses)
    out = out.replaceAll(`var:preset|color|${from}`, `var:preset|color|${to}`);
    out = out.replaceAll(`--wp--preset--color--${from}`, `--wp--preset--color--${to}`);
    // Gradient slugs
    out = out.replaceAll(`var:preset|gradient|${from}`, `var:preset|gradient|${to}`);
    out = out.replaceAll(`--wp--preset--gradient--${from}`, `--wp--preset--gradient--${to}`);
    out = out.replaceAll(`"gradient":"${from}"`, `"gradient":"${to}"`);
    out = out.replaceAll(`has-${from}-gradient-background`, `has-${to}-gradient-background`);
  }

  // ── Image path replacement ───────────────────────────────────────────────
  // Replace any <?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/...
  // with our theme image paths sequentially
  if (imageUris.length > 0) {
    let imgIndex = 0;
    out = out.replace(
      /\<\?php echo esc_url\( get_template_directory_uri\(\) \); \?>\/?assets\/images\/[^\s"]+/g,
      () => {
        const uri = imageUris[imgIndex % imageUris.length];
        imgIndex++;
        return `<?php echo esc_url( get_template_directory_uri() . '/${uri}' ); ?>`;
      },
    );
    // Also replace get_stylesheet_directory_uri() variants that might remain
    out = out.replace(
      /\<\?php echo esc_url\( get_stylesheet_directory_uri\(\) \); \?>\/?assets\/images\/[^\s"]+/g,
      () => {
        const uri = imageUris[imgIndex % imageUris.length];
        imgIndex++;
        return `<?php echo esc_url( get_template_directory_uri() . '/${uri}' ); ?>`;
      },
    );
  }

  return out;
}

/** Wrap normalized block HTML in a WordPress pattern PHP header */
export function wrapPatternHeader(opts: {
  title: string;
  slug: string;
  categories?: string;
  keywords?: string;
  blockTypes?: string;
  html: string;
}): string {
  const lines = [
    `<?php`,
    `/**`,
    ` * Title: ${opts.title}`,
    ` * Slug: ${opts.slug}`,
    ...(opts.categories ? [` * Categories: ${opts.categories}`] : []),
    ...(opts.keywords ? [` * Keywords: ${opts.keywords}`] : []),
    ...(opts.blockTypes ? [` * Block Types: ${opts.blockTypes}`] : []),
    ` */`,
    `?>`,
    ``,
    opts.html.trim(),
  ];
  return lines.join('\n');
}
