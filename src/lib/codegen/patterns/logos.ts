import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateLogosGrid(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Logos Grid',
    slug: `${slug}/logos-grid`,
    categories: 'about, featured',
    keywords: 'logos, brands, partners, clients, trust',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
<p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Trusted by leading companies worldwide', 'Logos section label', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"20px"} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:group {"align":"wide","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center"}} -->
<div class="wp-block-group alignwide">
  <!-- wp:image {"width":"120px","sizeSlug":"medium"} -->
  <figure class="wp-block-image size-medium is-resized"><img src="" alt="" style="width:120px"/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"width":"120px","sizeSlug":"medium"} -->
  <figure class="wp-block-image size-medium is-resized"><img src="" alt="" style="width:120px"/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"width":"120px","sizeSlug":"medium"} -->
  <figure class="wp-block-image size-medium is-resized"><img src="" alt="" style="width:120px"/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"width":"120px","sizeSlug":"medium"} -->
  <figure class="wp-block-image size-medium is-resized"><img src="" alt="" style="width:120px"/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"width":"120px","sizeSlug":"medium"} -->
  <figure class="wp-block-image size-medium is-resized"><img src="" alt="" style="width:120px"/></figure>
  <!-- /wp:image -->
</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->`;
}
