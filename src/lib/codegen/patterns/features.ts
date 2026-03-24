import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateFeaturesGrid(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Features Grid',
    slug: `${slug}/features-grid`,
    categories: 'services, text',
    keywords: 'features, grid, services, benefits',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Why Choose Us', 'Features heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size"><?php echo esc_html_x( 'Everything you need to succeed, all in one place.', 'Features subheading', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-large-font-size"><?php echo esc_html_x( 'Lightning Fast', 'Feature title', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p><?php echo esc_html_x( 'Optimized for speed and performance, ensuring your visitors get the best experience possible.', 'Feature description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-large-font-size"><?php echo esc_html_x( 'Fully Responsive', 'Feature title', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p><?php echo esc_html_x( 'Looks beautiful on every device, from desktop to mobile. No compromises on design or usability.', 'Feature description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-large-font-size"><?php echo esc_html_x( 'Easy to Customize', 'Feature title', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p><?php echo esc_html_x( 'Built with the WordPress Site Editor in mind. Change colors, fonts, and layouts with a few clicks.', 'Feature description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}

export function generateFeaturesAlternating(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Features Alternating',
    slug: `${slug}/features-alternating`,
    categories: 'services, text',
    keywords: 'features, alternating, zigzag, services',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide">
  <!-- wp:column {"verticalAlignment":"center","width":"50%"} -->
  <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:50%">
    <!-- wp:heading {"fontSize":"x-large"} -->
    <h2 class="wp-block-heading has-x-large-font-size"><?php echo esc_html_x( 'Designed for Creators', 'Feature heading', '${slug}' ); ?></h2>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"fontSize":"medium"} -->
    <p class="has-medium-font-size"><?php echo esc_html_x( 'Every detail has been carefully crafted to help you express your unique vision and connect with your audience.', 'Feature description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide">
  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:image {"sizeSlug":"large"} -->
    <figure class="wp-block-image size-large"><img src="" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->
  <!-- wp:column {"verticalAlignment":"center","width":"50%"} -->
  <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:50%">
    <!-- wp:heading {"fontSize":"x-large"} -->
    <h2 class="wp-block-heading has-x-large-font-size"><?php echo esc_html_x( 'Built for Performance', 'Feature heading', '${slug}' ); ?></h2>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"fontSize":"medium"} -->
    <p class="has-medium-font-size"><?php echo esc_html_x( 'Fast load times and optimized assets ensure your site performs beautifully under any conditions.', 'Feature description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->
</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
