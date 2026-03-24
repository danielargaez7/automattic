import type { ThemeSpec } from '../../schemas/theme-spec';

/**
 * Generate footer.html template part from FooterConfig.
 */
export function generateFooter(spec: ThemeSpec): string {
  const { footer, metadata } = spec;
  const columns = footer.columns;

  const socialLinks = footer.hasSocialLinks
    ? `<!-- wp:social-links {"iconColor":"secondary","className":"is-style-logos-only","layout":{"type":"flex","justifyContent":"center"}} -->
<ul class="wp-block-social-links has-icon-color is-style-logos-only">
  <!-- wp:social-link {"url":"#","service":"twitter"} /-->
  <!-- wp:social-link {"url":"#","service":"instagram"} /-->
  <!-- wp:social-link {"url":"#","service":"linkedin"} /-->
  <!-- wp:social-link {"url":"#","service":"github"} /-->
</ul>
<!-- /wp:social-links -->`
    : '';

  const copyright = footer.hasCopyright
    ? `<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
<p class="has-text-align-center has-small-font-size">&copy; ${new Date().getFullYear()} ${metadata.name}. All rights reserved.</p>
<!-- /wp:paragraph -->`
    : '';

  const newsletter = footer.hasNewsletter
    ? `<!-- wp:heading {"level":3,"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Stay Updated</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Subscribe to our newsletter for the latest updates.</p>
<!-- /wp:paragraph -->`
    : '';

  // Build column content
  const columnBlocks: string[] = [];

  // Column 1: Site info
  columnBlocks.push(`<!-- wp:column -->
<div class="wp-block-column">
  <!-- wp:site-title {"level":3} /-->

  <!-- wp:paragraph {"fontSize":"small"} -->
  <p class="has-small-font-size">${metadata.description}</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:column -->`);

  // Column 2: Navigation
  if (columns >= 2) {
    columnBlocks.push(`<!-- wp:column -->
<div class="wp-block-column">
  <!-- wp:heading {"level":3,"fontSize":"medium"} -->
  <h3 class="wp-block-heading has-medium-font-size">Navigation</h3>
  <!-- /wp:heading -->

  <!-- wp:navigation {"layout":{"type":"flex","orientation":"vertical"}} /-->
</div>
<!-- /wp:column -->`);
  }

  // Column 3: Newsletter or social
  if (columns >= 3) {
    columnBlocks.push(`<!-- wp:column -->
<div class="wp-block-column">
  ${newsletter || socialLinks}
</div>
<!-- /wp:column -->`);
  }

  // Column 4: Extra
  if (columns >= 4) {
    columnBlocks.push(`<!-- wp:column -->
<div class="wp-block-column">
  <!-- wp:heading {"level":3,"fontSize":"medium"} -->
  <h3 class="wp-block-heading has-medium-font-size">Contact</h3>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"fontSize":"small"} -->
  <p class="has-small-font-size">Get in touch with us for any inquiries.</p>
  <!-- /wp:paragraph -->
</div>
<!-- /wp:column -->`);
  }

  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">
${columnBlocks.join('\n\n')}
</div>
<!-- /wp:columns -->

<!-- wp:separator {"align":"wide","className":"is-style-wide"} -->
<hr class="wp-block-separator alignwide has-alpha-channel-opacity is-style-wide"/>
<!-- /wp:separator -->

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
<div class="wp-block-group">
  ${footer.hasSocialLinks && columns < 3 ? socialLinks : ''}
  ${copyright}
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`;
}
