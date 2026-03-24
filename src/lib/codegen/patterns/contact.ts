import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateContactForm(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Contact Section',
    slug: `${slug}/contact-form`,
    categories: 'contact, text',
    keywords: 'contact, form, email, reach out',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained","contentSize":"720px"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Get in Touch', 'Contact heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size"><?php echo esc_html_x( 'Have a question or want to work together? We would love to hear from you.', 'Contact description', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns -->
<div class="wp-block-columns">

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-large-font-size"><?php echo esc_html_x( 'Email', 'Contact method', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p><?php echo esc_html_x( 'hello@example.com', 'Contact email', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-large-font-size"><?php echo esc_html_x( 'Location', 'Contact method', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph -->
    <p><?php echo esc_html_x( 'San Francisco, CA', 'Contact location', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:heading {"level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-large-font-size"><?php echo esc_html_x( 'Social', 'Contact method', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:social-links {"className":"is-style-logos-only"} -->
    <ul class="wp-block-social-links is-style-logos-only">
      <!-- wp:social-link {"url":"#","service":"twitter"} /-->
      <!-- wp:social-link {"url":"#","service":"instagram"} /-->
      <!-- wp:social-link {"url":"#","service":"linkedin"} /-->
    </ul>
    <!-- /wp:social-links -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
