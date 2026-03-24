import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateTestimonialsCards(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Testimonials Cards',
    slug: `${slug}/testimonials-cards`,
    categories: 'testimonials, text',
    keywords: 'testimonials, reviews, cards, quotes',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'What People Say', 'Testimonials heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"base"} -->
    <div class="wp-block-group has-base-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)">
      <!-- wp:paragraph {"fontSize":"medium"} -->
      <p class="has-medium-font-size"><?php echo esc_html_x( '"This completely transformed how we present ourselves online. The design is stunning and the experience is seamless."', 'Testimonial quote', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph {"fontSize":"small","textColor":"secondary"} -->
      <p class="has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( '— Sarah Chen, Designer', 'Testimonial author', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"base"} -->
    <div class="wp-block-group has-base-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)">
      <!-- wp:paragraph {"fontSize":"medium"} -->
      <p class="has-medium-font-size"><?php echo esc_html_x( '"The attention to detail is remarkable. Every element feels intentional and purposeful. Highly recommended."', 'Testimonial quote', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph {"fontSize":"small","textColor":"secondary"} -->
      <p class="has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( '— Marcus Rivera, Founder', 'Testimonial author', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}},"border":{"radius":"8px"}},"backgroundColor":"base"} -->
    <div class="wp-block-group has-base-background-color has-background" style="border-radius:8px;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50)">
      <!-- wp:paragraph {"fontSize":"medium"} -->
      <p class="has-medium-font-size"><?php echo esc_html_x( '"Simple, elegant, and effective. Exactly what we needed to elevate our brand presence online."', 'Testimonial quote', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
      <!-- wp:paragraph {"fontSize":"small","textColor":"secondary"} -->
      <p class="has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( '— Aisha Patel, Director', 'Testimonial author', '${slug}' ); ?></p>
      <!-- /wp:paragraph -->
    </div>
    <!-- /wp:group -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}

export function generateTestimonialsCarousel(spec: ThemeSpec): string {
  // WordPress doesn't have a native carousel block, so we use a centered single-testimonial layout
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Testimonial Featured',
    slug: `${slug}/testimonials-carousel`,
    categories: 'testimonials, text',
    keywords: 'testimonial, quote, featured, review',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"surface","layout":{"type":"constrained","contentSize":"720px"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:paragraph {"align":"center","fontSize":"xx-large"} -->
<p class="has-text-align-center has-xx-large-font-size">&ldquo;</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center","fontSize":"x-large"} -->
<p class="has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Working with this team has been an absolute game-changer for our business. The results speak for themselves.', 'Testimonial quote', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"20px"} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:paragraph {"align":"center","fontSize":"medium","textColor":"secondary"} -->
<p class="has-text-align-center has-secondary-color has-text-color has-medium-font-size"><?php echo esc_html_x( 'Jordan Blake, CEO at TechFlow', 'Testimonial attribution', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

</div>
<!-- /wp:group -->`;
}
