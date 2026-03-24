import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateFaqAccordion(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'FAQ',
    slug: `${slug}/faq-accordion`,
    categories: 'text',
    keywords: 'faq, questions, answers, accordion',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained","contentSize":"720px"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Frequently Asked Questions', 'FAQ heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:details -->
<details class="wp-block-details">
  <summary><?php echo esc_html_x( 'How do I get started?', 'FAQ question', '${slug}' ); ?></summary>
  <!-- wp:paragraph -->
  <p><?php echo esc_html_x( 'Getting started is simple. Sign up for an account, choose your plan, and you can begin building right away. Our onboarding guide will walk you through every step.', 'FAQ answer', '${slug}' ); ?></p>
  <!-- /wp:paragraph -->
</details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details">
  <summary><?php echo esc_html_x( 'Can I change my plan later?', 'FAQ question', '${slug}' ); ?></summary>
  <!-- wp:paragraph -->
  <p><?php echo esc_html_x( 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.', 'FAQ answer', '${slug}' ); ?></p>
  <!-- /wp:paragraph -->
</details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details">
  <summary><?php echo esc_html_x( 'Is there a free trial?', 'FAQ question', '${slug}' ); ?></summary>
  <!-- wp:paragraph -->
  <p><?php echo esc_html_x( 'Yes, we offer a 14-day free trial on all plans. No credit card required. Explore all features before committing.', 'FAQ answer', '${slug}' ); ?></p>
  <!-- /wp:paragraph -->
</details>
<!-- /wp:details -->

<!-- wp:details -->
<details class="wp-block-details">
  <summary><?php echo esc_html_x( 'What kind of support do you offer?', 'FAQ question', '${slug}' ); ?></summary>
  <!-- wp:paragraph -->
  <p><?php echo esc_html_x( 'All plans include email support. Professional and Enterprise plans include priority support with faster response times and dedicated account managers.', 'FAQ answer', '${slug}' ); ?></p>
  <!-- /wp:paragraph -->
</details>
<!-- /wp:details -->

</div>
<!-- /wp:group -->`;
}
