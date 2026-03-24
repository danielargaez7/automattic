import type { ShellDefinition } from '../types';
import { normalizeShell, wrapPatternHeader } from '../normalize';

const SOURCE_SLUG = 'koinonia';

// koinonia uses 'background' instead of 'base', 'secondary' as accent-on-primary
const TOKEN_MAP: Record<string, string> = {
  background: 'base',
  secondary: 'accent',
};

// ── Adapted from koinonia/koinonia/patterns/home.php ─────────────────────
// Hero cover + services grid + split image/CTA + blog query loop
// Removed Jetpack-specific blocks (subscriptions, contact-form)
const HOME_HTML = `
<!-- wp:cover {"dimRatio":0,"isUserOverlayColor":true,"minHeight":75,"minHeightUnit":"vh","contentPosition":"top center","style":{"spacing":{"padding":{"top":"2.5vh","bottom":"10vh"},"blockGap":"7.5vh"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover has-custom-content-position is-position-top-center" style="padding-top:2.5vh;padding-bottom:10vh;min-height:75vh">
	<span aria-hidden="true" class="wp-block-cover__background has-background-dim-0 has-background-dim"></span>
	<img class="wp-block-cover__image-background" alt="" src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-hero.jpg" data-object-fit="cover"/>
	<div class="wp-block-cover__inner-container">
		<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"right":"var:preset|spacing|40","left":"var:preset|spacing|40"}}},"layout":{"type":"constrained","justifyContent":"left"}} -->
		<div class="wp-block-group alignwide" style="padding-right:var(--wp--preset--spacing--40);padding-left:var(--wp--preset--spacing--40)">
			<!-- wp:columns {"align":"wide"} -->
			<div class="wp-block-columns alignwide">
				<!-- wp:column -->
				<div class="wp-block-column">
					<!-- wp:heading {"textAlign":"left","level":1,"style":{"typography":{"letterSpacing":"-0.02rem","fontSize":"3.4rem"}}} -->
					<h1 class="wp-block-heading has-text-align-left" style="font-size:3.4rem;letter-spacing:-0.02rem"><?php echo esc_html( get_bloginfo( 'name' ) ); ?></h1>
					<!-- /wp:heading -->
					<!-- wp:paragraph {"align":"left"} -->
					<p class="has-text-align-left"><?php echo esc_html( get_bloginfo( 'description' ) ); ?></p>
					<!-- /wp:paragraph -->
					<!-- wp:buttons {"style":{"spacing":{"margin":{"top":"var:preset|spacing|50"}}}} -->
					<div class="wp-block-buttons" style="margin-top:var(--wp--preset--spacing--50)">
						<!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
						<div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php esc_html_e( 'Get Involved', 'koinonia' ); ?></a></div>
						<!-- /wp:button -->
					</div>
					<!-- /wp:buttons -->
				</div>
				<!-- /wp:column -->
				<!-- wp:column -->
				<div class="wp-block-column"></div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->
		</div>
		<!-- /wp:group -->
	</div>
</div>
<!-- /wp:cover -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"5vh","bottom":"10vh","right":"var:preset|spacing|50","left":"var:preset|spacing|50"},"blockGap":"5vh"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:5vh;padding-right:var(--wp--preset--spacing--50);padding-bottom:10vh;padding-left:var(--wp--preset--spacing--50)">

	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center">Where We Make a Difference</h2>
	<!-- /wp:heading -->

	<!-- wp:columns {"align":"wide"} -->
	<div class="wp-block-columns alignwide">
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group">
				<!-- wp:heading {"textAlign":"left"} -->
				<h2 class="wp-block-heading has-text-align-left"><?php esc_html_e( 'Community Support', 'koinonia' ); ?></h2>
				<!-- /wp:heading -->
				<!-- wp:paragraph -->
				<p><?php esc_html_e( 'We connect volunteers with meaningful opportunities to create lasting impact in the lives of those who need it most.', 'koinonia' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group">
				<!-- wp:heading {"textAlign":"left"} -->
				<h2 class="wp-block-heading has-text-align-left"><?php esc_html_e( 'Education & Outreach', 'koinonia' ); ?></h2>
				<!-- /wp:heading -->
				<!-- wp:paragraph -->
				<p><?php esc_html_e( 'Knowledge is the foundation of change. Our programs provide resources, workshops, and mentorship to every member.', 'koinonia' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column -->
		<div class="wp-block-column">
			<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group">
				<!-- wp:heading {"textAlign":"left"} -->
				<h2 class="wp-block-heading has-text-align-left"><?php esc_html_e( 'Fundraising & Events', 'koinonia' ); ?></h2>
				<!-- /wp:heading -->
				<!-- wp:paragraph -->
				<p><?php esc_html_e( 'Every dollar raised goes directly to the programs that matter. Join our events and help us do more together.', 'koinonia' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->

</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"5vh","bottom":"5vh","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"primary","layout":{"type":"constrained"}} -->
<div class="wp-block-group has-primary-background-color has-background" style="padding-top:5vh;padding-right:var(--wp--preset--spacing--50);padding-bottom:5vh;padding-left:var(--wp--preset--spacing--50)">
	<!-- wp:columns {"verticalAlignment":"center","align":"wide"} -->
	<div class="wp-block-columns alignwide are-vertically-aligned-center">
		<!-- wp:column {"verticalAlignment":"center","width":"50%"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:50%">
			<!-- wp:image {"aspectRatio":"1","scale":"cover","sizeSlug":"full","linkDestination":"none","style":{"border":{"radius":"10px"}}} -->
			<figure class="wp-block-image size-full has-custom-border"><img src="<?php echo esc_url( get_template_directory_uri() ); ?>/assets/images/placeholder-community.jpg" alt="" style="border-radius:10px;aspect-ratio:1;object-fit:cover"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
		<!-- wp:column {"verticalAlignment":"center","width":"50%"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:50%">
			<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|40","margin":{"bottom":"var:preset|spacing|50"}}},"layout":{"type":"flex","orientation":"vertical"}} -->
			<div class="wp-block-group" style="margin-bottom:var(--wp--preset--spacing--50)">
				<!-- wp:heading {"style":{"color":{"text":"#ffffff"}}} -->
				<h2 class="wp-block-heading" style="color:#ffffff"><?php esc_html_e( 'A passionate community dedicated to collaboration and compassion.', 'koinonia' ); ?></h2>
				<!-- /wp:heading -->
				<!-- wp:paragraph {"style":{"color":{"text":"rgba(255,255,255,0.85)"}}} -->
				<p style="color:rgba(255,255,255,0.85)"><?php esc_html_e( 'Together we create spaces where everyone belongs and every contribution counts. Join us and be part of something bigger.', 'koinonia' ); ?></p>
				<!-- /wp:paragraph -->
			</div>
			<!-- /wp:group -->
			<!-- wp:buttons -->
			<div class="wp-block-buttons">
				<!-- wp:button {"style":{"color":{"background":"#ffffff","text":"var(--wp--preset--color--primary)"}}} -->
				<div class="wp-block-button is-style-outline">
					<a class="wp-block-button__link has-background wp-element-button" style="background-color:#ffffff;color:var(--wp--preset--color--primary)"><?php esc_html_e( 'About Us', 'koinonia' ); ?></a>
				</div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"padding":{"top":"5vh","bottom":"5vh","left":"var:preset|spacing|50","right":"var:preset|spacing|50"},"blockGap":"5vh"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:5vh;padding-right:var(--wp--preset--spacing--50);padding-bottom:5vh;padding-left:var(--wp--preset--spacing--50)">
	<!-- wp:heading {"textAlign":"center","level":2} -->
	<h2 class="wp-block-heading has-text-align-center"><?php esc_html_e( 'Latest News', 'koinonia' ); ?></h2>
	<!-- /wp:heading -->
	<!-- wp:query {"queryId":17,"query":{"perPage":"3","pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","inherit":false},"align":"wide","layout":{"type":"constrained"}} -->
	<div class="wp-block-query alignwide">
		<!-- wp:post-template {"align":"wide","layout":{"type":"grid","columnCount":3}} -->
			<!-- wp:post-featured-image {"isLink":true,"aspectRatio":"4/3"} /-->
			<!-- wp:group {"style":{"spacing":{"margin":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40"}}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"stretch"}} -->
			<div class="wp-block-group" style="margin-top:var(--wp--preset--spacing--40);margin-bottom:var(--wp--preset--spacing--40)">
				<!-- wp:post-title {"isLink":true} /-->
				<!-- wp:post-date /-->
				<!-- wp:post-excerpt {"excerptLength":20} /-->
			</div>
			<!-- /wp:group -->
		<!-- /wp:post-template -->
	</div>
	<!-- /wp:query -->
</div>
<!-- /wp:group -->
`.trim();

export const communityOrgShell: ShellDefinition = {
  id: 'community-org',
  siteTypes: ['business', 'agency'],
  vibes: ['warm', 'organic', 'playful'],

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
          keywords: 'home, nonprofit, community, organization, blog, hero',
          html: norm(HOME_HTML),
        }),
      },
    ];
  },
};
