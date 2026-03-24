import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'spiel';

// Token map: spiel's non-standard tokens → our standard set
const TOKEN_MAP: Record<string, string> = {
  secondary: 'surface',
  tertiary: 'neutral',
  black: 'contrast',
};

// ── Raw block HTML from spiel/featured-posts.php ──────────────────────────
const FEATURED_POSTS_HTML = `
<!-- wp:group {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide" style="margin-top:var(--wp--preset--spacing--70);margin-bottom:var(--wp--preset--spacing--70)">
	<!-- wp:group {"align":"wide","style":{"border":{"bottom":{"color":"var:preset|color|contrast","style":"solid","width":"3px"}},"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
	<div class="wp-block-group alignwide" style="border-bottom-color:var(--wp--preset--color--contrast);border-bottom-style:solid;border-bottom-width:3px;margin-bottom:var(--wp--preset--spacing--50)">
		<!-- wp:heading {"style":{"typography":{"textTransform":"uppercase"}},"fontSize":"medium"} -->
		<h2 class="wp-block-heading has-medium-font-size" style="text-transform:uppercase">Trending</h2>
		<!-- /wp:heading -->
	</div>
	<!-- /wp:group -->

	<!-- wp:query {"queryId":2,"query":{"perPage":"4","pages":0,"offset":"0","postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"exclude","inherit":false},"align":"wide"} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"layout":{"type":"grid","columnCount":4}} -->
			<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/2","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} /-->
			<!-- wp:group {"style":{"spacing":{"blockGap":"0.25rem"}},"layout":{"type":"constrained"}} -->
			<div class="wp-block-group">
				<!-- wp:post-terms {"term":"category"} /-->
				<!-- wp:post-title {"isLink":true,"fontSize":"medium"} /-->
				<!-- wp:post-author-name {"isLink":true} /-->
			</div>
			<!-- /wp:group -->
		<!-- /wp:post-template -->
	</div>
	<!-- /wp:query -->
</div>
<!-- /wp:group -->
`.trim();

// ── Raw block HTML from spiel/latest-posts.php ────────────────────────────
const LATEST_POSTS_HTML = `
<!-- wp:group {"align":"wide","style":{"spacing":{"margin":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide" style="margin-top:var(--wp--preset--spacing--70);margin-bottom:var(--wp--preset--spacing--70)">
	<!-- wp:group {"align":"wide","style":{"border":{"bottom":{"color":"var:preset|color|contrast","style":"solid","width":"3px"},"top":[],"right":[],"left":[]},"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
	<div class="wp-block-group alignwide" style="border-bottom-color:var(--wp--preset--color--contrast);border-bottom-style:solid;border-bottom-width:3px;margin-bottom:var(--wp--preset--spacing--50)">
		<!-- wp:heading {"style":{"typography":{"textTransform":"uppercase"}},"fontSize":"medium"} -->
		<h2 class="wp-block-heading has-medium-font-size" style="text-transform:uppercase">Latest</h2>
		<!-- /wp:heading -->
	</div>
	<!-- /wp:group -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:query {"query":{"perPage":"1","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"only","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"default"}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/2","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} /-->
					<!-- wp:group {"style":{"spacing":{"blockGap":"0.5rem"}},"layout":{"type":"constrained"}} -->
					<div class="wp-block-group">
						<!-- wp:post-terms {"term":"category","textColor":"contrast"} /-->
						<!-- wp:post-title {"isLink":true,"textColor":"contrast","fontSize":"x-large"} /-->
						<!-- wp:post-excerpt {"style":{"typography":{"lineHeight":"1.5"}},"fontSize":"small"} /-->
						<!-- wp:post-author-name {"isLink":true} /-->
					</div>
					<!-- /wp:group -->
				<!-- /wp:post-template -->
			</div>
			<!-- /wp:query -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:query {"query":{"perPage":"4","pages":0,"offset":"0","postType":"post","order":"desc","orderBy":"date","sticky":"exclude","inherit":false}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"layout":{"type":"grid","columnCount":2}} -->
					<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/2","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}}} /-->
					<!-- wp:group {"style":{"spacing":{"blockGap":"0.25rem"}},"layout":{"type":"constrained"}} -->
					<div class="wp-block-group">
						<!-- wp:post-terms {"term":"category"} /-->
						<!-- wp:post-title {"isLink":true,"fontSize":"medium"} /-->
						<!-- wp:post-author-name {"isLink":true,"fontSize":"x-small"} /-->
					</div>
					<!-- /wp:group -->
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

export const blogEditorialShell: ShellDefinition = {
  id: 'blog-editorial',
  siteTypes: ['blog'],
  vibes: ['bold', 'dark', 'corporate'],

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
          keywords: 'home, blog, editorial, posts, news',
          html: norm(FEATURED_POSTS_HTML + '\n\n' + LATEST_POSTS_HTML),
        }),
      },
    ];
  },
};
