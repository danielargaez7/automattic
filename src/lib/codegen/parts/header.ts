import type { ThemeSpec } from '../../schemas/theme-spec';

/**
 * Generate header.html template part from HeaderConfig.
 */
export function generateHeader(spec: ThemeSpec): string {
  const { header } = spec;
  const stickyClass = header.sticky ? ' is-position-sticky' : '';

  const siteTitle = '<!-- wp:site-title {"level":0} /-->';
  const navigation = '<!-- wp:navigation {"layout":{"type":"flex","justifyContent":"space-between"}} /-->';
  const search = header.hasSearch
    ? '\n\n<!-- wp:search {"label":"Search","showLabel":false,"buttonText":"Search","buttonUseIcon":true} /-->'
    : '';
  const socialLinks = header.hasSocialLinks
    ? `

<!-- wp:social-links {"iconColor":"contrast","className":"is-style-logos-only","layout":{"type":"flex"}} -->
<ul class="wp-block-social-links has-icon-color is-style-logos-only">
  <!-- wp:social-link {"url":"#","service":"twitter"} /-->
  <!-- wp:social-link {"url":"#","service":"instagram"} /-->
  <!-- wp:social-link {"url":"#","service":"linkedin"} /-->
</ul>
<!-- /wp:social-links -->`
    : '';

  if (header.style === 'centered') {
    return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"base","className":"${stickyClass.trim()}","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull${stickyClass}" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center"}} -->
<div class="wp-block-group">
  ${siteTitle}
  ${navigation}${search}${socialLinks}
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`;
  }

  if (header.style === 'minimal') {
    return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"base","className":"${stickyClass.trim()}","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull${stickyClass}" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group">
  ${siteTitle}

  <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
  <div class="wp-block-group">
    ${navigation}${search}${socialLinks}
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`;
  }

  if (header.style === 'transparent') {
    return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"className":"${stickyClass.trim()}","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull${stickyClass}" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group">
  ${siteTitle}
  ${navigation}${search}${socialLinks}
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`;
  }

  // Default style
  return `<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"base","className":"${stickyClass.trim()}","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull${stickyClass}" style="padding-top:var(--wp--preset--spacing--40);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group">
  ${siteTitle}

  <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
  <div class="wp-block-group">
    ${navigation}${search}${socialLinks}
  </div>
  <!-- /wp:group -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`;
}
