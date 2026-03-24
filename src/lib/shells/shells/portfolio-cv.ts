import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'readymade';

// Token map: readymade's non-standard tokens → our standard set
const TOKEN_MAP: Record<string, string> = {
  secondary: 'surface',
  tertiary: 'neutral',
};

// ── Raw block HTML from readymade/home.php ────────────────────────────────
const HOME_HTML = `
<!-- wp:group {"tagName":"main","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60"}}},"layout":{"type":"constrained"}} -->
<main class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60)">

	<!-- wp:group {"layout":{"type":"constrained"}} -->
	<div class="wp-block-group">
		<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}},"fontSize":"small"} -->
		<h2 class="wp-block-heading has-small-font-size" style="margin-bottom:var(--wp--preset--spacing--40);font-style:normal;font-weight:700">About</h2>
		<!-- /wp:heading -->
		<!-- wp:paragraph -->
		<p><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->

	<!-- wp:spacer {"height":"var:preset|spacing|70"} -->
	<div style="height:var(--wp--preset--spacing--70)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:group {"layout":{"type":"constrained"}} -->
	<div class="wp-block-group">
		<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}},"fontSize":"small"} -->
		<h2 class="wp-block-heading has-small-font-size" style="margin-bottom:var(--wp--preset--spacing--40);font-style:normal;font-weight:700">Latest Work</h2>
		<!-- /wp:heading -->

		<!-- wp:query {"queryId":9,"query":{"perPage":3,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","sticky":"","inherit":false}} -->
		<div class="wp-block-query">
			<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
				<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3","className":"no-arrow"} /-->
				<!-- wp:group {"style":{"spacing":{"blockGap":"0.25rem","margin":{"top":"var:preset|spacing|30"}}},"layout":{"type":"constrained"}} -->
				<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--30)">
					<!-- wp:post-title {"level":3,"isLink":true} /-->
					<!-- wp:post-date {"fontSize":"small"} /-->
				</div>
				<!-- /wp:group -->
			<!-- /wp:post-template -->
		</div>
		<!-- /wp:query -->
	</div>
	<!-- /wp:group -->

	<!-- wp:spacer {"height":"var:preset|spacing|70"} -->
	<div style="height:var(--wp--preset--spacing--70)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:group {"layout":{"type":"constrained"}} -->
	<div class="wp-block-group">
		<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}},"fontSize":"small"} -->
		<h2 class="wp-block-heading has-small-font-size" style="margin-bottom:var(--wp--preset--spacing--40);font-style:normal;font-weight:700">Experience</h2>
		<!-- /wp:heading -->

		<!-- wp:group {"layout":{"type":"constrained"}} -->
		<div class="wp-block-group">
			<!-- wp:columns -->
			<div class="wp-block-columns">
				<!-- wp:column {"width":"110px"} -->
				<div class="wp-block-column" style="flex-basis:110px">
					<!-- wp:paragraph {"metadata":{"name":"Date"}} -->
					<p>2020 — Now</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:column -->
				<!-- wp:column -->
				<div class="wp-block-column">
					<!-- wp:heading {"level":3,"fontSize":"medium"} -->
					<h3 class="wp-block-heading has-medium-font-size">Lead Designer</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>Crafting digital experiences that balance form and function for ambitious clients.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->
		</div>
		<!-- /wp:group -->

		<!-- wp:spacer {"height":"var:preset|spacing|50"} -->
		<div style="height:var(--wp--preset--spacing--50)" aria-hidden="true" class="wp-block-spacer"></div>
		<!-- /wp:spacer -->

		<!-- wp:group {"layout":{"type":"constrained"}} -->
		<div class="wp-block-group">
			<!-- wp:columns -->
			<div class="wp-block-columns">
				<!-- wp:column {"width":"110px"} -->
				<div class="wp-block-column" style="flex-basis:110px">
					<!-- wp:paragraph {"metadata":{"name":"Date"}} -->
					<p>2016 — 2020</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:column -->
				<!-- wp:column -->
				<div class="wp-block-column">
					<!-- wp:heading {"level":3,"fontSize":"medium"} -->
					<h3 class="wp-block-heading has-medium-font-size">Senior Creative</h3>
					<!-- /wp:heading -->
					<!-- wp:paragraph -->
					<p>Led visual identity projects and built design systems for growing startups.</p>
					<!-- /wp:paragraph -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->
		</div>
		<!-- /wp:group -->
	</div>
	<!-- /wp:group -->

	<!-- wp:spacer {"height":"var:preset|spacing|70"} -->
	<div style="height:var(--wp--preset--spacing--70)" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:group {"layout":{"type":"constrained"}} -->
	<div class="wp-block-group">
		<!-- wp:heading {"style":{"typography":{"fontStyle":"normal","fontWeight":"700"},"spacing":{"margin":{"bottom":"var:preset|spacing|40"}}},"fontSize":"small"} -->
		<h2 class="wp-block-heading has-small-font-size" style="margin-bottom:var(--wp--preset--spacing--40);font-style:normal;font-weight:700">Get in Touch</h2>
		<!-- /wp:heading -->
		<!-- wp:buttons -->
		<div class="wp-block-buttons">
			<!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
			<div class="wp-block-button">
				<a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php esc_html_e( 'Say Hello', 'readymade' ); ?></a>
			</div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->
	</div>
	<!-- /wp:group -->

</main>
<!-- /wp:group -->
`.trim();

export const portfolioCvShell: ShellDefinition = {
  id: 'portfolio-cv',
  siteTypes: ['portfolio', 'personal'],
  vibes: ['minimalist', 'elegant', 'corporate'],

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
          keywords: 'home, portfolio, cv, resume, about',
          html: norm(HOME_HTML),
        }),
      },
    ];
  },
};
