import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateStatsCounter(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Stats Counter',
    slug: `${slug}/stats-counter`,
    categories: 'about, text',
    keywords: 'stats, numbers, counter, metrics',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph {"align":"center","fontSize":"xx-large","textColor":"accent"} -->
    <p class="has-text-align-center has-accent-color has-text-color has-xx-large-font-size"><?php echo esc_html_x( '500+', 'Stat number', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Projects Completed', 'Stat label', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph {"align":"center","fontSize":"xx-large","textColor":"accent"} -->
    <p class="has-text-align-center has-accent-color has-text-color has-xx-large-font-size"><?php echo esc_html_x( '98%', 'Stat number', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Client Satisfaction', 'Stat label', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph {"align":"center","fontSize":"xx-large","textColor":"accent"} -->
    <p class="has-text-align-center has-accent-color has-text-color has-xx-large-font-size"><?php echo esc_html_x( '24/7', 'Stat number', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Support Available', 'Stat label', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:paragraph {"align":"center","fontSize":"xx-large","textColor":"accent"} -->
    <p class="has-text-align-center has-accent-color has-text-color has-xx-large-font-size"><?php echo esc_html_x( '10+', 'Stat number', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Years Experience', 'Stat label', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
