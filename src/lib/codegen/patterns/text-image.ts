import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateTextWithImage(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Text with Image',
    slug: `${slug}/text-with-image`,
    categories: 'text, about',
    keywords: 'text, image, about, media',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column {"verticalAlignment":"center","width":"55%"} -->
  <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:55%">
    <!-- wp:heading {"fontSize":"x-large"} -->
    <h2 class="wp-block-heading has-x-large-font-size"><?php echo esc_html_x( 'Our Story', 'Section heading', '${slug}' ); ?></h2>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"fontSize":"medium"} -->
    <p class="has-medium-font-size"><?php echo esc_html_x( 'We started with a simple idea: make beautiful things accessible to everyone. What began as a small project has grown into something we are truly proud of.', 'Section text', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->

    <!-- wp:paragraph {"fontSize":"medium"} -->
    <p class="has-medium-font-size"><?php echo esc_html_x( 'Every decision we make is guided by our commitment to quality, simplicity, and the belief that great design should be available to all.', 'Section text', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"45%"} -->
  <div class="wp-block-column" style="flex-basis:45%">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
