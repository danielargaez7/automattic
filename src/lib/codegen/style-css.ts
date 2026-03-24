import type { ThemeSpec } from '../schemas/theme-spec';

/**
 * Generate the style.css theme metadata header.
 * This file contains ONLY the header comment — no actual CSS.
 */
export function generateStyleCss(spec: ThemeSpec): string {
  const tags = [
    'block-patterns',
    'full-site-editing',
    'custom-colors',
    'custom-fonts',
    ...spec.metadata.tags,
  ];
  const uniqueTags = [...new Set(tags)].slice(0, 15);

  return `/*
Theme Name: ${spec.metadata.name}
Theme URI: https://github.com/blockforge/${spec.metadata.slug}
Author: ${spec.metadata.author}
Author URI: https://blockforge.dev
Description: ${spec.metadata.description}
Version: ${spec.metadata.version}
Requires at least: 6.4
Tested up to: 6.7
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: ${spec.metadata.slug}
Tags: ${uniqueTags.join(', ')}
*/
`;
}
