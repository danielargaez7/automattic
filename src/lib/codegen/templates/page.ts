import type { ThemeSpec, Template } from '../../schemas/theme-spec';

export function generatePage(_spec: ThemeSpec, _template: Template): string {
  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">

  <!-- wp:spacer {"height":"var:preset|spacing|60"} -->
  <div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

  <!-- wp:post-title {"level":1,"fontSize":"xx-large"} /-->

  <!-- wp:post-content {"layout":{"type":"constrained"}} /-->

  <!-- wp:spacer {"height":"var:preset|spacing|60"} -->
  <div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
  <!-- /wp:spacer -->

</div>
<!-- /wp:group -->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
