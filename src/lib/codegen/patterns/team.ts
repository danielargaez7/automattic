import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateTeamGrid(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Team Grid',
    slug: `${slug}/team-grid`,
    categories: 'team, about',
    keywords: 'team, members, people, grid',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Meet the Team', 'Team heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"medium"} -->
<p class="has-text-align-center has-medium-font-size"><?php echo esc_html_x( 'The people behind the product.', 'Team subheading', '${slug}' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:image {"align":"center","sizeSlug":"medium","className":"is-style-rounded"} -->
    <figure class="wp-block-image aligncenter size-medium is-style-rounded"><img src="" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html_x( 'Alex Morgan', 'Team member name', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Founder & CEO', 'Team member role', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:image {"align":"center","sizeSlug":"medium","className":"is-style-rounded"} -->
    <figure class="wp-block-image aligncenter size-medium is-style-rounded"><img src="" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html_x( 'Sam Taylor', 'Team member name', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Lead Designer', 'Team member role', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column -->
  <div class="wp-block-column">
    <!-- wp:image {"align":"center","sizeSlug":"medium","className":"is-style-rounded"} -->
    <figure class="wp-block-image aligncenter size-medium is-style-rounded"><img src="" alt=""/></figure>
    <!-- /wp:image -->
    <!-- wp:heading {"textAlign":"center","level":3,"fontSize":"large"} -->
    <h3 class="wp-block-heading has-text-align-center has-large-font-size"><?php echo esc_html_x( 'Jordan Lee', 'Team member name', '${slug}' ); ?></h3>
    <!-- /wp:heading -->
    <!-- wp:paragraph {"align":"center","fontSize":"small","textColor":"secondary"} -->
    <p class="has-text-align-center has-secondary-color has-text-color has-small-font-size"><?php echo esc_html_x( 'Lead Engineer', 'Team member role', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}
