import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader, themeImgUrl } from './utils';

export function generateGalleryGrid(spec: ThemeSpec, imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  // Cycle through available images (modulo so we never leave blank slots)
  const img = (i: number) => themeImgUrl(imageUris, imageUris.length ? i % imageUris.length : 0);
  return `${patternHeader({
    title: 'Gallery Grid',
    slug: `${slug}/gallery-grid`,
    categories: 'gallery, portfolio',
    keywords: 'gallery, grid, images, portfolio',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Our Work', 'Gallery heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:gallery {"columns":3,"linkTo":"none","align":"wide"} -->
<figure class="wp-block-gallery alignwide has-nested-images columns-3 is-cropped">
  <!-- wp:image {"sizeSlug":"large"} -->
  <figure class="wp-block-image size-large"><img src="${img(0)}" alt=""/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"sizeSlug":"large"} -->
  <figure class="wp-block-image size-large"><img src="${img(1)}" alt=""/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"sizeSlug":"large"} -->
  <figure class="wp-block-image size-large"><img src="${img(2)}" alt=""/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"sizeSlug":"large"} -->
  <figure class="wp-block-image size-large"><img src="${img(3)}" alt=""/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"sizeSlug":"large"} -->
  <figure class="wp-block-image size-large"><img src="${img(4)}" alt=""/></figure>
  <!-- /wp:image -->
  <!-- wp:image {"sizeSlug":"large"} -->
  <figure class="wp-block-image size-large"><img src="${img(5)}" alt=""/></figure>
  <!-- /wp:image -->
</figure>
<!-- /wp:gallery -->

</div>
<!-- /wp:group -->`;
}

export function generateGalleryMasonry(spec: ThemeSpec, imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  const img = (i: number) => themeImgUrl(imageUris, imageUris.length ? i % imageUris.length : 0);
  return `${patternHeader({
    title: 'Gallery Masonry',
    slug: `${slug}/gallery-masonry`,
    categories: 'gallery, portfolio',
    keywords: 'gallery, masonry, images, portfolio',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Gallery', 'Gallery heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(0)}" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(3)}" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(1)}" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(4)}" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(2)}" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->
  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(5)}" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="${img(0)}" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
