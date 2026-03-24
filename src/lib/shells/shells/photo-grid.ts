import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'grammerone-wpcom';

const TOKEN_MAP: Record<string, string> = {
  // grammerone uses standard WP token names — no remapping needed
};

// ── Adapted from grammer/grammerone-wpcom/templates/home.html ─────────────
// Ultra-clean 3-column square image grid — the photography portfolio look
const HOME_HTML = `
<!-- wp:group {"tagName":"main","style":{"spacing":{"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
<main class="wp-block-group" style="margin-top:0;margin-bottom:0">

	<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|20","right":"var:preset|spacing|50","left":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--20);padding-left:var(--wp--preset--spacing--50)">
		<!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
		<div class="wp-block-group alignwide">
			<!-- wp:site-title {"level":0,"isLink":true} /-->
			<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","justifyContent":"right","flexWrap":"nowrap"}} /-->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:query {"queryId":8,"query":{"perPage":12,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"","inherit":true},"align":"wide","layout":{"type":"constrained"}} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"align":"wide","style":{"spacing":{"blockGap":"0"}},"layout":{"type":"grid","columnCount":3}} -->
			<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"1","style":{"spacing":{"margin":{"bottom":"0"}}}} /-->
		<!-- /wp:post-template -->

		<!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50"}}}} -->
			<!-- wp:query-pagination-previous /-->
			<!-- wp:query-pagination-numbers /-->
			<!-- wp:query-pagination-next /-->
		<!-- /wp:query-pagination -->
	</div>
	<!-- /wp:query -->

</main>
<!-- /wp:group -->
`.trim();

export const photoGridShell: ShellDefinition = {
  id: 'photo-grid',
  siteTypes: ['portfolio', 'personal'],
  vibes: ['minimalist', 'dark', 'elegant'],

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
          keywords: 'home, photography, portfolio, grid, square, images',
          html: norm(HOME_HTML),
        }),
      },
    ];
  },
};
