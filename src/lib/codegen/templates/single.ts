import type { ThemeSpec, Template } from '../../schemas/theme-spec';

export function generateSingle(_spec: ThemeSpec, _template: Template): string {
  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">

  <!-- wp:spacer {"height":"var:preset|spacing|60"} -->
  <div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:post-title {"level":1,"fontSize":"xx-large"} /-->

  <!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"},"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"fontSize":"small"} -->
  <div class="wp-block-group has-small-font-size">
    <!-- wp:post-date /-->
    <!-- wp:paragraph -->
    <p>·</p>
    <!-- /wp:paragraph -->
    <!-- wp:post-author {"showAvatar":false} /-->
  </div>
  <!-- /wp:group -->

  <!-- wp:post-featured-image {"align":"wide"} /-->

  <!-- wp:spacer {"height":"var:preset|spacing|40"} -->
  <div style="height:var(--wp--preset--spacing--40)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:post-content {"layout":{"type":"constrained"}} /-->

  <!-- wp:spacer {"height":"var:preset|spacing|60"} -->
  <div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:separator {"align":"wide","className":"is-style-wide"} -->
  <hr class="wp-block-separator alignwide has-alpha-channel-opacity is-style-wide"/>
  <!-- /wp:separator -->

  <!-- wp:post-navigation-link {"type":"previous","label":"Previous Post"} /-->
  <!-- wp:post-navigation-link {"label":"Next Post"} /-->

</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
