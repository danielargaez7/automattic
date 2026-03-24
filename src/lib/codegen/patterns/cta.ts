import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateCtaCentered(spec: ThemeSpec, _imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Call to Action Centered',
    slug: `${slug}/cta-centered`,
    categories: 'call-to-action, featured',
    keywords: 'cta, call to action, banner, centered',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"gradient":"primary-to-accent","layout":{"type":"constrained","contentSize":"720px"}} -->
<div class="wp-block-group alignfull has-primary-to-accent-gradient-background has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large","style":{"color":{"text":"#ffffff"}}} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size" style="color:#ffffff"><?php echo esc_html_x( 'Ready to Get Started?', 'CTA heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium","style":{"color":{"text":"rgba(255,255,255,0.85)"}}} -->
<p class="has-text-align-center has-medium-font-size" style="color:rgba(255,255,255,0.85)"><?php echo esc_html_x( 'Join thousands of satisfied users and take the next step today.', 'CTA description', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
  <!-- wp:button {"style":{"color":{"background":"#ffffff","text":"var(--wp--preset--color--primary)"}}} -->
  <div class="wp-block-button"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#ffffff;color:var(--wp--preset--color--primary)"><?php echo esc_html_x( 'Start Now', 'CTA button', '${slug}' ); ?></a></div>
  <!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->`;
}

export function generateCtaSplit(spec: ThemeSpec, _imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Call to Action Split',
    slug: `${slug}/cta-split`,
    categories: 'call-to-action, featured',
    keywords: 'cta, call to action, split, two-column',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"gradient":"base-to-surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-to-surface-gradient-background has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:columns {"align":"wide","verticalAlignment":"center"} -->
<div class="wp-block-columns alignwide are-vertically-aligned-center">

  <!-- wp:column {"verticalAlignment":"center"} -->
  <div class="wp-block-column is-vertically-aligned-center">
    <!-- wp:heading {"fontSize":"x-large"} -->
    <h2 class="wp-block-heading has-x-large-font-size"><?php echo esc_html_x( 'Let\\'s Build Something Great Together', 'CTA heading', '${slug}' ); ?></h2>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"fontSize":"medium"} -->
    <p class="has-medium-font-size"><?php echo esc_html_x( 'Have a project in mind? We would love to hear from you and help bring your vision to life.', 'CTA description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"verticalAlignment":"center"} -->
  <div class="wp-block-column is-vertically-aligned-center">
    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
      <!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php echo esc_html_x( 'Get in Touch', 'CTA button', '${slug}' ); ?></a></div>
      <!-- /wp:button -->
      <!-- wp:button {"className":"is-style-outline"} -->
      <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button"><?php echo esc_html_x( 'View Our Work', 'CTA button', '${slug}' ); ?></a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
