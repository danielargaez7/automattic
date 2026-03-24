import type { ThemeSpec } from '../../schemas/theme-spec';
import { patternHeader, themeImgUrl } from './utils';

export function generateHeroCentered(spec: ThemeSpec, imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  const bgUrl = themeImgUrl(imageUris, 0);
  const dimRatio = bgUrl ? 50 : 100;
  return `${patternHeader({
    title: 'Hero Centered',
    slug: `${slug}/hero-centered`,
    categories: 'featured, banner',
    keywords: 'hero, banner, header, landing',
    blockTypes: 'core/cover',
  })}

<!-- wp:cover {"url":"${bgUrl}","dimRatio":50,"gradient":"primary-to-accent","minHeight":600,"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull" style="min-height:600px">
  <span aria-hidden="true" class="wp-block-cover__background has-primary-to-accent-gradient-background has-background-dim-50 has-background-dim"></span>
  ${bgUrl ? `<img class="wp-block-cover__image-background" alt="" src="${bgUrl}" style="object-fit:cover"/>` : ''}
  <div class="wp-block-cover__inner-container">

    <!-- wp:spacer {"height":"60px"} -->
    <div style="height:60px" aria-hidden="true" class="wp-block-spacer"></div>
    <!-- /wp:spacer -->

    <!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large"} -->
    <h1 class="wp-block-heading has-text-align-center has-xx-large-font-size"><?php echo esc_html_x( 'Your Story Starts Here', 'Hero heading', '${slug}' ); ?></h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","fontSize":"large"} -->
    <p class="has-text-align-center has-large-font-size"><?php echo esc_html_x( 'A brief description of what makes this site special.', 'Hero description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
      <!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php echo esc_html_x( 'Get Started', 'Hero button', '${slug}' ); ?></a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->

    <!-- wp:spacer {"height":"60px"} -->
    <div style="height:60px" aria-hidden="true" class="wp-block-spacer"></div>
    <!-- /wp:spacer -->

  </div>
</div>
<!-- /wp:cover -->`;
}

export function generateHeroSplit(spec: ThemeSpec, imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  const imgSrc = themeImgUrl(imageUris, 0);
  return `${patternHeader({
    title: 'Hero Split',
    slug: `${slug}/hero-split`,
    categories: 'featured, banner',
    keywords: 'hero, split, landing, two-column',
    blockTypes: 'core/columns',
  })}

<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|80","bottom":"var:preset|spacing|80","left":"var:preset|spacing|50","right":"var:preset|spacing|50"}}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-base-background-color has-background" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--50)">

<!-- wp:columns {"align":"wide","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|70"}}}} -->
<div class="wp-block-columns alignwide">

  <!-- wp:column {"verticalAlignment":"center","width":"50%"} -->
  <div class="wp-block-column is-vertically-aligned-center" style="flex-basis:50%">
    <!-- wp:heading {"level":1,"fontSize":"xx-large"} -->
    <h1 class="wp-block-heading has-xx-large-font-size"><?php echo esc_html_x( 'Build Something Beautiful', 'Hero heading', '${slug}' ); ?></h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"fontSize":"large"} -->
    <p class="has-large-font-size"><?php echo esc_html_x( 'Transform your ideas into reality with tools designed for creators who care about craft.', 'Hero description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons -->
    <div class="wp-block-buttons">
      <!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php echo esc_html_x( 'Get Started', 'Hero button', '${slug}' ); ?></a></div>
      <!-- /wp:button -->
      <!-- wp:button {"className":"is-style-outline"} -->
      <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button"><?php echo esc_html_x( 'Learn More', 'Hero button', '${slug}' ); ?></a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->
  </div>
  <!-- /wp:column -->

  <!-- wp:column {"width":"50%"} -->
  <div class="wp-block-column" style="flex-basis:50%">
    <!-- wp:image {"align":"wide","sizeSlug":"full"} -->
    <figure class="wp-block-image alignwide size-full"><img src="${imgSrc}" alt=""/></figure>
    <!-- /wp:image -->
  </div>
  <!-- /wp:column -->

</div>
<!-- /wp:columns -->

</div>
<!-- /wp:group -->`;
}

export function generateHeroFullwidth(spec: ThemeSpec, imageUris: string[] = []): string {
  const slug = spec.metadata.slug;
  const bgUrl = themeImgUrl(imageUris, 0);
  return `${patternHeader({
    title: 'Hero Full Width Image',
    slug: `${slug}/hero-fullwidth-image`,
    categories: 'featured, banner',
    keywords: 'hero, fullwidth, image, cover',
    blockTypes: 'core/cover',
  })}

<!-- wp:cover {"url":"${bgUrl}","dimRatio":60,"gradient":"accent-to-primary","minHeight":80,"minHeightUnit":"vh","align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull" style="min-height:80vh">
  <span aria-hidden="true" class="wp-block-cover__background has-accent-to-primary-gradient-background has-background-dim-60 has-background-dim"></span>
  ${bgUrl ? `<img class="wp-block-cover__image-background" alt="" src="${bgUrl}" style="object-fit:cover"/>` : ''}
  <div class="wp-block-cover__inner-container">

    <!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large","textColor":"contrast"} -->
    <h1 class="wp-block-heading has-text-align-center has-contrast-color has-text-color has-xx-large-font-size"><?php echo esc_html_x( 'Visual Stories That Inspire', 'Hero heading', '${slug}' ); ?></h1>
    <!-- /wp:heading -->

    <!-- wp:paragraph {"align":"center","fontSize":"large","textColor":"contrast"} -->
    <p class="has-text-align-center has-contrast-color has-text-color has-large-font-size"><?php echo esc_html_x( 'Discover a world of creativity captured through the lens.', 'Hero description', '${slug}' ); ?></p>
    <!-- /wp:paragraph -->

    <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
    <div class="wp-block-buttons">
      <!-- wp:button {"backgroundColor":"accent","textColor":"contrast"} -->
      <div class="wp-block-button"><a class="wp-block-button__link has-accent-background-color has-contrast-color has-text-color has-background wp-element-button"><?php echo esc_html_x( 'Explore Gallery', 'Hero button', '${slug}' ); ?></a></div>
      <!-- /wp:button -->
    </div>
    <!-- /wp:buttons -->

  </div>
</div>
<!-- /wp:cover -->`;
}
