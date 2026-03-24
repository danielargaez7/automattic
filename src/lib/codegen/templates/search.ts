import type { ThemeSpec, Template } from '../../schemas/theme-spec';

export function generateSearch(_spec: ThemeSpec, _template: Template): string {
  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">

  <!-- wp:spacer {"height":"var:preset|spacing|60"} -->
  <div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:query-title {"type":"search","fontSize":"xx-large"} /-->

  <!-- wp:spacer {"height":"var:preset|spacing|40"} -->
  <div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:search {"label":"Search","showLabel":false,"placeholder":"Search...","buttonText":"Search"} /-->

  <!-- wp:spacer {"height":"var:preset|spacing|40"} -->
  <div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:query {"queryId":1,"query":{"perPage":10,"offset":0,"postType":"post","order":"desc","orderBy":"relevance","inherit":true}} -->
  <div class="wp-block-query">
    <!-- wp:post-template -->
      <!-- wp:post-title {"isLink":true,"fontSize":"large"} /-->
      <!-- wp:post-excerpt {"excerptLength":30} /-->
      <!-- wp:post-date {"fontSize":"small"} /-->
      <!-- wp:spacer {"height":"var:preset|spacing|40"} -->
      <div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
      <!-- /wp:spacer -->
    <!-- /wp:post-template -->

    <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
      <!-- wp:query-pagination-previous /-->
      <!-- wp:query-pagination-numbers /-->
      <!-- wp:query-pagination-next /-->
    <!-- /wp:query-pagination -->

    <!-- wp:query-no-results -->
      <!-- wp:paragraph {"align":"center"} -->
      <p class="has-text-align-center">No results found. Try a different search term.</p>
      <!-- /wp:paragraph -->
    <!-- /wp:query-no-results -->
  </div>
  <!-- /wp:query -->

</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
