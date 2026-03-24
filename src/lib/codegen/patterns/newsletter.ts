import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateNewsletterSignup(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Newsletter Signup',
    slug: `${slug}/newsletter-signup`,
    categories: 'call-to-action, featured',
    keywords: 'newsletter, signup, email, subscribe',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"surface","layout":{"type":"constrained","contentSize":"600px"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Stay in the Loop', 'Newsletter heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size"><?php echo esc_html_x( 'Subscribe to our newsletter and never miss an update. No spam, just the good stuff.', 'Newsletter description', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons">
  <!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
  <div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php echo esc_html_x( 'Subscribe Now', 'Newsletter button', '${slug}' ); ?></a></div>
  <!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->`;
}
