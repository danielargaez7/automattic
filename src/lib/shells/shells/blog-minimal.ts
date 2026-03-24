import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'substrata';

// Token map: substrata's non-standard tokens → our standard set
const TOKEN_MAP: Record<string, string> = {
  secondary: 'surface',
  tertiary: 'neutral',
  quaternary: 'base',
  'smooth-gradient': 'primary-to-accent',
};

// ── Raw block HTML from substrata/home.php ────────────────────────────────
// Stripped down to the main content section (header/footer are template parts)
const HOME_HTML = `
<!-- wp:group {"tagName":"main","align":"full","style":{"spacing":{"margin":{"top":"0"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group alignfull" style="margin-top:0">

	<!-- wp:group {"align":"full","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"gradient":"primary-to-accent","layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignfull has-primary-to-accent-gradient-background has-background">
		<!-- wp:columns {"align":"wide"} -->
		<div class="wp-block-columns alignwide">
			<!-- wp:column -->
			<div class="wp-block-column"></div>
			<!-- /wp:column -->
			<!-- wp:column -->
			<div class="wp-block-column">
				<!-- wp:heading {"level":1,"style":{"spacing":{"margin":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|50"}}}} -->
				<h1 class="wp-block-heading"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h1>
				<!-- /wp:heading -->
				<!-- wp:paragraph {"fontSize":"large"} -->
				<p class="has-large-font-size"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
				<!-- /wp:paragraph -->
				<!-- wp:spacer {"height":"var:preset|spacing|60"} -->
				<div style="height:var(--wp--preset--spacing--60)" aria-hidden="true" class="wp-block-spacer"></div>
				<!-- /wp:spacer -->
			</div>
			<!-- /wp:column -->
		</div>
		<!-- /wp:columns -->
	</div>
	<!-- /wp:group -->

	<!-- wp:spacer {"height":"var:preset|spacing|70"} -->
	<div style="height:var(--wp--preset--spacing--70)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column"></div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:query {"queryId":0,"query":{"perPage":5,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"","inherit":false},"enhancedPagination":true,"layout":{"type":"constrained","justifyContent":"center"}} -->
			<div class="wp-block-query">
				<!-- wp:post-template {"align":"wide","layout":{"type":"constrained"}} -->
					<!-- wp:group {"layout":{"type":"constrained"}} -->
					<div class="wp-block-group">
						<!-- wp:columns {"verticalAlignment":"top","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|40"}}}} -->
						<div class="wp-block-columns are-vertically-aligned-top">
							<!-- wp:column {"verticalAlignment":"top"} -->
							<div class="wp-block-column is-vertically-aligned-top">
								<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|20"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
								<div class="wp-block-group">
									<!-- wp:post-date {"format":"M Y","isLink":true} /-->
									<!-- wp:post-title {"isLink":true} /-->
								</div>
								<!-- /wp:group -->
								<!-- wp:read-more {"content":"|   More   |"} /-->
							</div>
							<!-- /wp:column -->
							<!-- wp:column {"verticalAlignment":"top"} -->
							<div class="wp-block-column is-vertically-aligned-top">
								<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","style":{"border":{"width":"4px"}},"borderColor":"neutral"} /-->
							</div>
							<!-- /wp:column -->
						</div>
						<!-- /wp:columns -->
					</div>
					<!-- /wp:group -->
				<!-- /wp:post-template -->

				<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|40"}}},"layout":{"type":"default"}} -->
				<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--40)">
					<!-- wp:query-pagination -->
						<!-- wp:query-pagination-previous /-->
						<!-- wp:query-pagination-numbers /-->
						<!-- wp:query-pagination-next /-->
					<!-- /wp:query-pagination -->
				</div>
				<!-- /wp:group -->
			</div>
			<!-- /wp:query -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

</main>
<!-- /wp:group -->
`.trim();

export const blogMinimalShell: ShellDefinition = {
  id: 'blog-minimal',
  siteTypes: ['blog', 'personal'],
  vibes: ['minimalist', 'elegant', 'warm', 'organic'],

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
          keywords: 'home, blog, minimal, personal, posts',
          html: norm(HOME_HTML),
        }),
      },
    ];
  },
};
