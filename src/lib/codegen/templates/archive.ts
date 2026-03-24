import type { ThemeSpec, Template } from '../../schemas/theme-spec';

export function generateArchive(_spec: ThemeSpec, _template: Template): string {
  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">

  <!-- wp:spacer {"height":"var:preset|spacing|60"} -->
  <div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:query-title {"type":"archive","fontSize":"xx-large"} /-->

  <!-- wp:term-description {"fontSize":"medium"} /-->

  <!-- wp:spacer {"height":"var:preset|spacing|40"} -->
  <div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:query {"queryId":1,"query":{"perPage":10,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":true}} -->
  <div class="wp-block-query">
    <!-- wp:post-template {"layout":{"type":"grid","columnCount":2}} -->
      <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /-->
      <!-- wp:post-title {"isLink":true,"fontSize":"large"} /-->
      <!-- wp:post-excerpt {"excerptLength":20} /-->
      <!-- wp:post-date {"fontSize":"small"} /-->
    <!-- /wp:post-template -->

    <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
      <!-- wp:query-pagination-previous /-->
      <!-- wp:query-pagination-numbers /-->
      <!-- wp:query-pagination-next /-->
    <!-- /wp:query-pagination -->

    <!-- wp:query-no-results -->
      <!-- wp:paragraph {"align":"center"} -->
      <p class="has-text-align-center">No posts found.</p>
      <!-- /wp:paragraph -->
    <!-- /wp:query-no-results -->
  </div>
  <!-- /wp:query -->

</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
