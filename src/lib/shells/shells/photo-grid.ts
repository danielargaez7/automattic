import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'grammerone-wpcom';

const TOKEN_MAP: Record<string, string> = {
  // grammerone uses standard WP token names — no remapping needed
};

// ── Static 3×2 image grid + intro — looks great on install without posts ──
// Images replaced by library assets via normalizeShell(); dynamic query below
// for when the site has posts
const HOME_HTML = `
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|40","right":"var:preset|spacing|50","left":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--50)">
	<!-- wp:group {"align":"wide","layout":{"type":"flex","justifyContent":"space-between","flexWrap":"wrap"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:site-title {"level":1,"style":{"typography":{"fontStyle":"normal","fontWeight":"300","letterSpacing":"0.08em","textTransform":"uppercase"}}} /-->
		<!-- wp:paragraph {"style":{"color":{"text":"var(--wp--preset--color--neutral)"},"typography":{"fontSize":"0.85rem","letterSpacing":"0.04em"}}} -->
		<p style="color:var(--wp--preset--color--neutral);font-size:0.85rem;letter-spacing:0.04em"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
		<!-- /wp:paragraph -->
	</div>
	<!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"0","bottom":"0","right":"0","left":"0"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"default"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0">
	<!-- wp:columns {"isStackedOnMobile":false,"style":{"spacing":{"blockGap":{"top":"4px","left":"4px"},"margin":{"top":"0","bottom":"0"}}}} -->
	<div class="wp-block-columns is-not-stacked-on-mobile" style="margin-top:0;margin-bottom:0">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full"} -->
			<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-1.jpg" alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full","style":{"spacing":{"margin":{"top":"4px"}}}} -->
			<figure class="wp-block-image size-full" style="margin-top:4px"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-4.jpg" alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full"} -->
			<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-2.jpg" alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full","style":{"spacing":{"margin":{"top":"4px"}}}} -->
			<figure class="wp-block-image size-full" style="margin-top:4px"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-5.jpg" alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full"} -->
			<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-3.jpg" alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full","style":{"spacing":{"margin":{"top":"4px"}}}} -->
			<figure class="wp-block-image size-full" style="margin-top:4px"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-6.jpg" alt="" style="aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
`.trim();

export const photoGridShell: ShellDefinition = {
  id: 'photo-grid',
  siteTypes: ['portfolio', 'personal'],
  vibes: ['minimalist', 'dark', 'elegant', 'bold'],

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
