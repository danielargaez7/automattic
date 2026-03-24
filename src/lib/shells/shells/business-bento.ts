import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'kentwood';

// Token map: kentwood's non-standard tokens → our standard set
const TOKEN_MAP: Record<string, string> = {
  secondary: 'surface',
  tertiary: 'neutral',
};

// ── Raw block HTML: kentwood intro + bento grid ───────────────────────────
const INTRO_HTML = `
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"right":"var:preset|spacing|50","left":"var:preset|spacing|50","top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0","bottom":"0"}}},"backgroundColor":"neutral","textColor":"primary","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-primary-color has-neutral-background-color has-text-color has-background" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)">
	<!-- wp:paragraph {"align":"center","fontSize":"x-large"} -->
	<p class="has-text-align-center has-x-large-font-size"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
	<!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
`.trim();

// Adapted from kentwood/bento.php — image paths will be substituted by normalizeShell
const BENTO_HTML = `
<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"right":"var:preset|spacing|50","left":"var:preset|spacing|50","top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"},"margin":{"top":"0","bottom":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull" style="margin-top:0;margin-bottom:0;padding-top:var(--wp--preset--spacing--70);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--70);padding-left:var(--wp--preset--spacing--50)">

	<!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"constrained"}} -->
	<div class="wp-block-group alignwide">
		<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|40"}}}} -->
		<div class="wp-block-columns alignwide">

			<!-- wp:column {"width":"33%"} -->
			<div class="wp-block-column" style="flex-basis:33%">
				<!-- wp:cover {"dimRatio":40,"customGradient":"linear-gradient(180deg,rgba(0,0,0,0) 0%,rgb(0,0,0) 76%)","contentPosition":"bottom center","style":{"layout":{"selfStretch":"fill"},"border":{"radius":"28px"},"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"textColor":"base"} -->
				<div class="wp-block-cover has-custom-content-position is-position-bottom-center has-base-color has-text-color" style="border-radius:28px;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60);min-height:100%">
					<span aria-hidden="true" class="wp-block-cover__background has-background-dim-40 has-background-dim wp-block-cover__gradient-background has-background-gradient" style="background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgb(0,0,0) 76%)"></span>
					<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-1.jpg" style="object-position:25% 20%" data-object-fit="cover"/>
					<div class="wp-block-cover__inner-container">
						<!-- wp:heading {"textAlign":"left","fontSize":"x-large"} -->
						<h2 class="wp-block-heading has-text-align-left has-x-large-font-size"><?php esc_html_e( 'Our Story', 'kentwood' ); ?></h2>
						<!-- /wp:heading -->
						<!-- wp:paragraph {"fontSize":"small"} -->
						<p class="has-small-font-size"><?php esc_html_e( 'Built on a foundation of excellence, creativity, and genuine care for every person we serve.', 'kentwood' ); ?></p>
						<!-- /wp:paragraph -->
						<!-- wp:buttons -->
						<div class="wp-block-buttons">
							<!-- wp:button {"textColor":"base","className":"is-style-fill"} -->
							<div class="wp-block-button is-style-fill">
								<a class="wp-block-button__link has-base-color has-text-color wp-element-button"><?php esc_html_e( 'Learn More', 'kentwood' ); ?></a>
							</div>
							<!-- /wp:button -->
						</div>
						<!-- /wp:buttons -->
					</div>
				</div>
				<!-- /wp:cover -->
			</div>
			<!-- /wp:column -->

			<!-- wp:column {"width":"67%","style":{"spacing":{"blockGap":"var:preset|spacing|40"}}} -->
			<div class="wp-block-column" style="flex-basis:67%">
				<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}},"border":{"radius":"28px"}},"backgroundColor":"primary","textColor":"base","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center"}} -->
				<div class="wp-block-group has-base-color has-primary-background-color has-text-color has-background" style="border-radius:28px;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)">
					<!-- wp:heading {"fontSize":"x-large","style":{"color":{"text":"#ffffff"}}} -->
					<h2 class="wp-block-heading has-x-large-font-size" style="color:#ffffff"><?php esc_html_e( 'Ready to Work Together?', 'kentwood' ); ?></h2>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"style":{"color":{"text":"rgba(255,255,255,0.85)"}}} -->
					<p style="color:rgba(255,255,255,0.85)"><?php esc_html_e( 'We bring expertise, passion, and a track record of results to every engagement.', 'kentwood' ); ?></p>
					<!-- /wp:paragraph -->
					<!-- wp:buttons -->
					<div class="wp-block-buttons">
						<!-- wp:button {"style":{"color":{"background":"#ffffff","text":"var(--wp--preset--color--primary)"}}} -->
						<div class="wp-block-button is-style-outline">
							<a class="wp-block-button__link has-background wp-element-button" style="background-color:#ffffff;color:var(--wp--preset--color--primary)"><?php esc_html_e( 'Get in Touch', 'kentwood' ); ?></a>
						</div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
				</div>
				<!-- /wp:group -->

				<!-- wp:columns {"style":{"spacing":{"blockGap":{"top":"var:preset|spacing|40","left":"var:preset|spacing|40"}}}} -->
				<div class="wp-block-columns">
					<!-- wp:column -->
					<div class="wp-block-column">
						<!-- wp:group {"style":{"border":{"radius":"28px"},"dimensions":{"minHeight":"100%"},"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"accent","textColor":"contrast","layout":{"type":"flex","orientation":"vertical","justifyContent":"center","verticalAlignment":"center"}} -->
						<div class="wp-block-group has-contrast-color has-accent-background-color has-text-color has-background" style="border-radius:28px;min-height:100%;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)">
							<!-- wp:heading {"fontSize":"xx-large","textAlign":"center"} -->
							<h2 class="wp-block-heading has-text-align-center has-xx-large-font-size">10+</h2>
							<!-- /wp:heading -->
							<!-- wp:paragraph {"align":"center","fontSize":"small"} -->
							<p class="has-text-align-center has-small-font-size"><?php esc_html_e( 'Years of experience', 'kentwood' ); ?></p>
							<!-- /wp:paragraph -->
						</div>
						<!-- /wp:group -->
					</div>
					<!-- /wp:column -->

					<!-- wp:column -->
					<div class="wp-block-column">
						<!-- wp:group {"style":{"dimensions":{"minHeight":"100%"},"border":{"radius":"28px"},"spacing":{"padding":{"top":"var:preset|spacing|60","bottom":"var:preset|spacing|60","left":"var:preset|spacing|60","right":"var:preset|spacing|60"}}},"backgroundColor":"neutral","textColor":"primary","layout":{"type":"flex","orientation":"vertical","verticalAlignment":"center","justifyContent":"stretch"}} -->
						<div class="wp-block-group has-primary-color has-neutral-background-color has-text-color has-background" style="border-radius:28px;min-height:100%;padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--60)">
							<!-- wp:heading {"fontSize":"x-large"} -->
							<h2 class="wp-block-heading has-x-large-font-size"><?php esc_html_e( 'Our Services', 'kentwood' ); ?></h2>
							<!-- /wp:heading -->
							<!-- wp:paragraph {"fontSize":"small"} -->
							<p class="has-small-font-size"><?php esc_html_e( 'Tailored solutions designed around your goals and delivered with precision.', 'kentwood' ); ?></p>
							<!-- /wp:paragraph -->
							<!-- wp:buttons -->
							<div class="wp-block-buttons">
								<!-- wp:button {"className":"is-style-fill"} -->
								<div class="wp-block-button is-style-fill">
									<a class="wp-block-button__link wp-element-button"><?php esc_html_e( 'Explore', 'kentwood' ); ?></a>
								</div>
								<!-- /wp:button -->
							</div>
							<!-- /wp:buttons -->
						</div>
						<!-- /wp:group -->
					</div>
					<!-- /wp:column -->
				</div>
				<!-- /wp:columns -->
			</div>
			<!-- /wp:column -->

		</div>
		<!-- /wp:columns -->

		<!-- wp:query {"queryId":1,"query":{"perPage":"3","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"align":"wide"} -->
		<div class="wp-block-query alignwide">
			<!-- wp:group {"style":{"border":{"bottom":{"color":"var:preset|color|contrast","style":"solid","width":"2px"}},"spacing":{"margin":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"default"}} -->
			<div class="wp-block-group" style="border-bottom-color:var(--wp--preset--color--contrast);border-bottom-style:solid;border-bottom-width:2px;margin-bottom:var(--wp--preset--spacing--50)">
				<!-- wp:heading {"fontSize":"small","style":{"typography":{"textTransform":"uppercase","fontWeight":"700"}}} -->
				<h2 class="wp-block-heading has-small-font-size" style="text-transform:uppercase;font-weight:700"><?php esc_html_e( 'Latest News', 'kentwood' ); ?></h2>
				<!-- /wp:heading -->
			</div>
			<!-- /wp:group -->
			<!-- wp:post-template {"layout":{"type":"grid","columnCount":3}} -->
				<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"3/2","style":{"spacing":{"margin":{"bottom":"var:preset|spacing|30"}}}} /-->
				<!-- wp:post-title {"isLink":true,"fontSize":"medium"} /-->
				<!-- wp:post-date {"fontSize":"x-small"} /-->
			<!-- /wp:post-template -->
		</div>
		<!-- /wp:query -->

	</div>
	<!-- /wp:group -->

</div>
<!-- /wp:group -->
`.trim();

export const businessBentoShell: ShellDefinition = {
  id: 'business-bento',
  siteTypes: ['business', 'agency'],
  vibes: ['corporate', 'bold', 'elegant'],

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
          keywords: 'home, business, bento, grid, agency',
          html: norm(INTRO_HTML + '\n\n' + BENTO_HTML),
        }),
      },
    ];
  },
};
