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

/* ── Entry Animations ──────────────────────────────────────────── */
@keyframes bf-fade-up {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bf-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes bf-scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

/* Hero inner elements: stagger automatically */
.wp-block-cover__inner-container > :nth-child(1) {
  animation: bf-fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.wp-block-cover__inner-container > :nth-child(2) {
  animation: bf-fade-up 0.7s 0.12s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.wp-block-cover__inner-container > :nth-child(3) {
  animation: bf-fade-up 0.7s 0.24s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.wp-block-cover__inner-container > :nth-child(4) {
  animation: bf-fade-up 0.7s 0.36s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Gallery images: stagger scale-in */
.wp-block-gallery .wp-block-image { animation: bf-scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
.wp-block-gallery .wp-block-image:nth-child(1) { animation-delay: 0s; }
.wp-block-gallery .wp-block-image:nth-child(2) { animation-delay: 0.07s; }
.wp-block-gallery .wp-block-image:nth-child(3) { animation-delay: 0.14s; }
.wp-block-gallery .wp-block-image:nth-child(4) { animation-delay: 0.21s; }
.wp-block-gallery .wp-block-image:nth-child(5) { animation-delay: 0.28s; }
.wp-block-gallery .wp-block-image:nth-child(6) { animation-delay: 0.35s; }

/* Feature + text-image blocks: fade up */
.bf-fade-up { animation: bf-fade-up 0.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
.bf-fade-up.bf-delay-1 { animation-delay: 0.1s; }
.bf-fade-up.bf-delay-2 { animation-delay: 0.2s; }
.bf-fade-up.bf-delay-3 { animation-delay: 0.3s; }

/* Image blocks: scale in on load */
.wp-block-image img { animation: bf-scale-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* Buttons: subtle lift on hover */
.wp-element-button {
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}
.wp-element-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18) !important;
}
`;
}
