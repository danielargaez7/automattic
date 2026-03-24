import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader } from './utils';

export function generateBlogLatestPosts(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  return `${patternHeader({
    title: 'Latest Posts',
    slug: `${slug}/blog-latest-posts`,
    categories: 'featured, text',
    keywords: 'blog, posts, latest, grid, query',
    blockTypes: 'core/query',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:heading {"textAlign":"center","fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size"><?php echo esc_html_x( 'Latest Posts', 'Blog heading', '${slug}' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:spacer {"height":"40px"} -->
<div style="height:40px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:query {"queryId":1,"query":{"perPage":6,"offset":0,"postType":"post","order":"desc","orderBy":"date"},"align":"wide"} -->
<div class="wp-block-query alignwide">
  <!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
    <!-- wp:post-featured-image {"isLink":true,"aspectRatio":"16/9"} /-->
    <!-- wp:post-title {"isLink":true,"fontSize":"large"} /-->
    <!-- wp:post-excerpt {"excerptLength":20} /-->
    <!-- wp:post-date {"fontSize":"small"} /-->
  <!-- /wp:post-template -->

  <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
    <!-- wp:query-pagination-previous /-->
    <!-- wp:query-pagination-numbers /-->
    <!-- wp:query-pagination-next /-->
  <!-- /wp:query-pagination -->

  <!-- wp:query-no-results -->
    <!-- wp:paragraph {"align":"center"} -->
    <p class="has-text-align-center"><?php echo esc_html_x( 'No posts found.', 'No results message', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->
  <!-- /wp:query-no-results -->
</div>
<!-- /wp:query -->

</div>
<!-- /wp:group -->`;
}
