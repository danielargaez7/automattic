import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generatePricingTable(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Pricing Table',
    slug: `${slug}/pricing-table`,
    categories: 'services, text',
    keywords: 'pricing, plans, table, subscription',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Simple, Transparent Pricing', 'Pricing heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size"><?php echo esc_html_x( 'Choose the plan that works best for you.', 'Pricing subheading', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px","width":"1px"}},"borderColor":"secondary"} -->
    <div class="wp-block-group has-border-color has-secondary-border-color" style="border-width:1px;border-radius:8px;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)">
      <!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
      <h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html_x( 'Starter', 'Pricing plan name', '${slug}' ); ?></h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"align":"center","fontSize":"xx-large"} -->
      <p class="has-text-align-center has-xx-large-font-size"><?php echo esc_html_x( '$9/mo', 'Pricing amount', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:list -->
      <ul class="wp-block-list">
        <li><?php echo esc_html_x( '1 Project', 'Pricing feature', '${slug}' ); ?></li>
        <li><?php echo esc_html_x( 'Basic Support', 'Pricing feature', '${slug}' ); ?></li>
        <li><?php echo esc_html_x( '5GB Storage', 'Pricing feature', '${slug}' ); ?></li>
      </ul>
      <!-- /wp:list -->
      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-buttons">
        <!-- wp:button {"width":100,"className":"is-style-outline"} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-outline"><a class="wp-block-button__link wp-element-button"><?php echo esc_html_x( 'Get Started', 'Pricing button', '${slug}' ); ?></a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"accent"} -->
    <div class="wp-block-group has-accent-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)">
      <!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large","textColor":"contrast"} -->
      <h3 class="wp-block-heading has-text-align-center has-contrast-color has-text-color has-large-font-size"><?php echo esc_html_x( 'Professional', 'Pricing plan name', '${slug}' ); ?></h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"align":"center","fontSize":"xx-large","textColor":"contrast"} -->
      <p class="has-text-align-center has-contrast-color has-text-color has-xx-large-font-size"><?php echo esc_html_x( '$29/mo', 'Pricing amount', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:list {"textColor":"contrast"} -->
      <ul class="wp-block-list has-contrast-color has-text-color">
        <li><?php echo esc_html_x( 'Unlimited Projects', 'Pricing feature', '${slug}' ); ?></li>
        <li><?php echo esc_html_x( 'Priority Support', 'Pricing feature', '${slug}' ); ?></li>
        <li><?php echo esc_html_x( '50GB Storage', 'Pricing feature', '${slug}' ); ?></li>
      </ul>
      <!-- /wp:list -->
      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-buttons">
        <!-- wp:button {"width":100,"backgroundColor":"contrast","textColor":"accent"} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-100"><a class="wp-block-button__link has-contrast-background-color has-accent-color has-text-color has-background wp-element-button"><?php echo esc_html_x( 'Get Started', 'Pricing button', '${slug}' ); ?></a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px","width":"1px"}},"borderColor":"secondary"} -->
    <div class="wp-block-group has-border-color has-secondary-border-color" style="border-width:1px;border-radius:8px;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)">
      <!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
      <h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html_x( 'Enterprise', 'Pricing plan name', '${slug}' ); ?></h3>
      <!-- /wp:heading -->
      <!-- wp:paragraph {"align":"center","fontSize":"xx-large"} -->
      <p class="has-text-align-center has-xx-large-font-size"><?php echo esc_html_x( '$99/mo', 'Pricing amount', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:list -->
      <ul class="wp-block-list">
        <li><?php echo esc_html_x( 'Everything in Pro', 'Pricing feature', '${slug}' ); ?></li>
        <li><?php echo esc_html_x( 'Dedicated Support', 'Pricing feature', '${slug}' ); ?></li>
        <li><?php echo esc_html_x( 'Unlimited Storage', 'Pricing feature', '${slug}' ); ?></li>
      </ul>
      <!-- /wp:list -->
      <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
      <div class="wp-block-buttons">
        <!-- wp:button {"width":100,"className":"is-style-outline"} -->
        <div class="wp-block-button has-custom-width wp-block-button__width-100 is-style-outline"><a class="wp-block-button__link wp-element-button"><?php echo esc_html_x( 'Contact Sales', 'Pricing button', '${slug}' ); ?></a></div>
        <!-- /wp:button -->
      </div>
      <!-- /wp:buttons -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
