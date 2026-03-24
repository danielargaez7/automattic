import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

// TwentyTwentyFive — the theme inside the brewcommerce blueprint
const SOURCE_SLUG = 'twentytwentyfive';

const TOKEN_MAP: Record<string, string> = {
  // TT25 uses standard WP token names — minimal remapping
};

// ── Hero + menu highlights + about section + CTA ─────────────────────────
// Inspired by TT25 hero-full-width-image.php — adapted for food/restaurant
const HOME_HTML = `
<!-- wp:cover {"dimRatio":40,"isUserOverlayColor":true,"minHeight":840,"minHeightUnit":"px","contentPosition":"bottom center","align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|50","bottom":"var:preset|spacing|50","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull has-custom-content-position is-position-bottom-center" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--50);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--50);padding-left:var(--wp--preset--spacing--50);min-height:840px">
	<span aria-hidden="true" class="wp-block-cover__background has-background-dim-40 has-background-dim"></span>
	<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-hero.jpg" data-object-fit="cover"/>
	<div class="wp-block-cover__inner-container">
		<!-- wp:group {"align":"wide","layout":{"type":"constrained","justifyContent":"left"}} -->
		<div class="wp-block-group alignwide">
			<!-- wp:heading {"textAlign":"left","fontSize":"xx-large","style":{"color":{"text":"#ffffff"}}} -->
			<h2 class="wp-block-heading has-text-align-left has-xx-large-font-size" style="color:#ffffff"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h2>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"style":{"color":{"text":"rgba(255,255,255,0.9)"}}} -->
			<p style="color:rgba(255,255,255,0.9)"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
			<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--50)">
				<!-- wp:button {"style":{"color":{"background":"#ffffff","text":"var(--wp--preset--color--primary)"}}} -->
				<div class="wp-block-button"><a class="wp-block-button__link has-background wp-element-button" style="background-color:#ffffff;color:var(--wp--preset--color--primary)"><?php esc_html_e( 'View Menu', 'twentytwentyfive' ); ?></a></div>
				<!-- /wp:button -->
				<!-- wp:button {"className":"is-style-outline","style":{"color":{"text":"#ffffff","background":"transparent"},"border":{"color":"#ffffff","width":"2px"}}} -->
				<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" style="color:#ffffff;background-color:transparent;border-color:#ffffff;border-width:2px"><?php esc_html_e( 'Reserve a Table', 'twentytwentyfive' ); ?></a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:group -->
	</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","right":"var:preset|spacing|50","left":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

	<!-- wp:heading {"textAlign":"center","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|60"}}}} -->
	<h2 class="wp-block-heading has-text-align-center" style="margin-bottom:var(--wp--preset--spacing--60)"><?php esc_html_e( 'Our Highlights', 'twentytwentyfive' ); ?></h2>
	<!-- /wp:heading -->

	<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|50"}}}} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","style":{"border":{"radius":"12px"}}} -->
			<figure class="wp-block-image size-full has-custom-border"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-1.jpg" alt="" style="border-radius:12px;aspect-ratio:4/3;object-fit:cover"/></figure>
			<!-- /wp:image -->
			<!-- wp:heading {"level":3,"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
			<h3 class="wp-block-heading" style="margin-top:var(--wp--preset--spacing--40)"><?php esc_html_e( 'Seasonal Menu', 'twentytwentyfive' ); ?></h3>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"fontSize":"small"} -->
			<p class="has-small-font-size"><?php esc_html_e( 'Crafted from locally sourced ingredients at the peak of their season — fresh, vibrant, and full of flavour.', 'twentytwentyfive' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","style":{"border":{"radius":"12px"}}} -->
			<figure class="wp-block-image size-full has-custom-border"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-2.jpg" alt="" style="border-radius:12px;aspect-ratio:4/3;object-fit:cover"/></figure>
			<!-- /wp:image -->
			<!-- wp:heading {"level":3,"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
			<h3 class="wp-block-heading" style="margin-top:var(--wp--preset--spacing--40)"><?php esc_html_e( 'Craft Drinks', 'twentytwentyfive' ); ?></h3>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"fontSize":"small"} -->
			<p class="has-small-font-size"><?php esc_html_e( 'From single-origin espresso to artisanal cocktails — every sip is a considered choice.', 'twentytwentyfive' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","style":{"border":{"radius":"12px"}}} -->
			<figure class="wp-block-image size-full has-custom-border"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-3.jpg" alt="" style="border-radius:12px;aspect-ratio:4/3;object-fit:cover"/></figure>
			<!-- /wp:image -->
			<!-- wp:heading {"level":3,"style":{"spacing":{"margin":{"top":"var:preset|spacing|40"}}}} -->
			<h3 class="wp-block-heading" style="margin-top:var(--wp--preset--spacing--40)"><?php esc_html_e( 'Private Events', 'twentytwentyfive' ); ?></h3>
			<!-- /wp:heading -->
			<!-- wp:paragraph {"fontSize":"small"} -->
			<p class="has-small-font-size"><?php esc_html_e( 'Host your next celebration in our private dining room. We handle every detail so you can enjoy every moment.', 'twentytwentyfive' ); ?></p>
			<!-- /wp:paragraph -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

</div>
<!-- /wp:group -->

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","right":"var:preset|spacing|50","left":"var:preset|spacing|50"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"surface","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-surface-background-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">
	<!-- wp:columns {"verticalAlignment":"center","align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
	<div class="wp-block-columns alignwide are-vertically-aligned-center">
		<!-- wp:column {"width":"55%"} -->
		<div class="wp-block-column" style="flex-basis:55%">
			<!-- wp:image {"aspectRatio":"4/3","scale":"cover","sizeSlug":"full","style":{"border":{"radius":"16px"}}} -->
			<figure class="wp-block-image size-full has-custom-border"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-about.jpg" alt="" style="border-radius:16px;aspect-ratio:4/3;object-fit:cover"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column {"width":"45%","verticalAlignment":"center"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:45%">
			<!-- wp:heading {"level":2} -->
			<h2 class="wp-block-heading"><?php esc_html_e( 'Our Story', 'twentytwentyfive' ); ?></h2>
			<!-- /wp:heading -->
			<!-- wp:paragraph -->
			<p><?php esc_html_e( 'We started with a simple belief: great food brings people together. From our first day, every dish has been crafted with care, every guest welcomed like family.', 'twentytwentyfive' ); ?></p>
			<!-- /wp:paragraph -->
			<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
			<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--50)">
				<!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
				<div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php esc_html_e( 'Reserve a Table', 'twentytwentyfive' ); ?></a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
`.trim();

export const foodRestaurantShell: ShellDefinition = {
  id: 'food-restaurant',
  siteTypes: ['business', 'ecommerce'],
  vibes: ['warm', 'organic', 'elegant', 'bold'],

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
          keywords: 'home, food, restaurant, cafe, menu, hero',
          html: norm(HOME_HTML),
        }),
      },
    ];
  },
};
