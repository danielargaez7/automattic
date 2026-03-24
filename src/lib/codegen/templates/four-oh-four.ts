import type { ThemeSpec, Template } from '../../schemas/theme-spec';

export function generateFourOhFour(_spec: ThemeSpec, _template: Template): string {
  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained","contentSize":"600px"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80"}}}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--80);padding-bottom:var(--wp--preset--spacing--80)">

  <!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large"} -->
  <h1 class="wp-block-heading has-text-align-center has-xx-large-font-size">404</h1>
  <!-- /wp:heading -->

  <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
  <p class="has-text-align-center has-large-font-size">The page you are looking for does not exist. It may have been moved or deleted.</p>
  <!-- /wp:paragraph -->

  <!-- wp:search {"label":"Search","showLabel":false,"placeholder":"Search this site...","buttonText":"Search","buttonUseIcon":true,"align":"center"} /-->

</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
