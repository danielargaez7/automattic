import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

// Vueo theme's internal name is "mural"
const SOURCE_SLUG = 'mural';

const TOKEN_MAP: Record<string, string> = {
  // mural uses standard WP token names — minimal remapping needed
};

// ── Adapted from vueo/mural parts/home-work-default.html ─────────────────
// Staggered 3-column masonry query grid — each column queries with offset
// so posts fill the columns in a visual masonry style
const HOME_HTML = `
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"right":"var:preset|spacing|50","left":"var:preset|spacing|50","top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)">

	<!-- wp:group {"align":"wide","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|60"}}},"layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
	<div class="wp-block-group alignwide" style="margin-bottom:var(--wp--preset--spacing--60)">
		<!-- wp:site-title {"level":0} /-->
		<!-- wp:paragraph {"fontSize":"small"} -->
		<p class="has-small-font-size"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"1rem","left":"1rem"},"margin":{"top":"0","bottom":"0"}}}} -->
	<div class="wp-block-columns alignwide" style="margin-top:0;margin-bottom:0">

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:query {"queryId":0,"query":{"perPage":"1","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":1}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/4","style":{"spacing":{"margin":{"bottom":"1rem"}}}} /-->
					<!-- wp:group {"style":{"spacing":{"blockGap":"0rem"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
					<div class="wp-block-group">
						<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"small"} /-->
						<!-- wp:post-terms {"term":"category","fontSize":"x-small"} /-->
					</div>
					<!-- /wp:group -->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
			<!-- wp:query {"queryId":1,"query":{"perPage":"1","pages":0,"offset":3,"postType":"post","order":"desc","orderBy":"date","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":1}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}}} /-->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:query {"queryId":2,"query":{"perPage":"1","pages":0,"offset":1,"postType":"post","order":"desc","orderBy":"date","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":1}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","style":{"spacing":{"margin":{"top":"3rem","bottom":"1rem"}}}} /-->
					<!-- wp:group {"style":{"spacing":{"blockGap":"0rem"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
					<div class="wp-block-group">
						<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"small"} /-->
						<!-- wp:post-terms {"term":"category","fontSize":"x-small"} /-->
					</div>
					<!-- /wp:group -->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
			<!-- wp:query {"queryId":3,"query":{"perPage":"1","pages":0,"offset":4,"postType":"post","order":"desc","orderBy":"date","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":1}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/4","style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}}} /-->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:query {"queryId":4,"query":{"perPage":"1","pages":0,"offset":2,"postType":"post","order":"desc","orderBy":"date","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":1}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/4","style":{"spacing":{"margin":{"bottom":"1rem"}}}} /-->
					<!-- wp:group {"style":{"spacing":{"blockGap":"0rem"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
					<div class="wp-block-group">
						<!-- wp:post-title {"level":3,"isLink":true,"fontSize":"small"} /-->
						<!-- wp:post-terms {"term":"category","fontSize":"x-small"} /-->
					</div>
					<!-- /wp:group -->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
			<!-- wp:query {"queryId":5,"query":{"perPage":"1","pages":0,"offset":5,"postType":"post","order":"desc","orderBy":"date","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":1}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","style":{"spacing":{"margin":{"top":"1rem","bottom":"1rem"}}}} /-->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
		</div>
		<!-- /wp:column -->

	</div>
	<!-- /wp:columns -->

</div>
<!-- /wp:group -->
`.trim();

export const creativeGalleryShell: ShellDefinition = {
  id: 'creative-gallery',
  siteTypes: ['portfolio'],
  vibes: ['bold', 'dark', 'playful', 'organic'],

  buildPatterns(slug, imageUris) {
    const norm = (html: string) =>
      normalizeShell(html, SOURCE_SLUG, slug, TOKEN_MAP, imageUris);

    return [
      {
        filename: 'home.php',
        content: wrapPatternHeader({
          title: 'Home',
          slug: `${slug}/home`,
          categories: 'featured',
          keywords: 'home, gallery, art, creative, masonry, portfolio',
          html: norm(HOME_HTML),
        }),
      },
    ];
  },
};
