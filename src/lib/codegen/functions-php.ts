import type { ThemeSpec } from '../schemas/theme-spec';

/**
 * Generate functions.php with pattern registration and font loading.
 */
export function generateFunctionsPhp(spec: ThemeSpec): string {
  const slug = spec.metadata.slug;
  const googleFonts = spec.designTokens.typography.fontFamilies.filter((f) => f.googleFont);

  let fontEnqueue = '';
  if (googleFonts.length > 0) {
    const families = googleFonts
      .map((f) => {
        const name = f.fontFamily.split(',')[0].replace(/'/g, '').trim();
        const weights = f.fontFace?.map((face) => face.fontWeight).join(';') || '400;700';
        return `${name.replace(/ /g, '+')}:wght@${weights}`;
      })
      .join('&family=');

    fontEnqueue = `
/**
 * Enqueue Google Fonts.
 */
function ${slug.replace(/-/g, '_')}_enqueue_fonts() {
    wp_enqueue_style(
        '${slug}-google-fonts',
        'https://fonts.googleapis.com/css2?family=${families}&display=swap',
        array(),
        null
    );
}
add_action( 'wp_enqueue_scripts', '${slug.replace(/-/g, '_')}_enqueue_fonts' );
add_action( 'enqueue_block_editor_assets', '${slug.replace(/-/g, '_')}_enqueue_fonts' );
`;
  }

  return `<?php
/**
 * ${spec.metadata.name} functions and definitions.
 *
 * @package ${slug}
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Register block patterns.
 */
function ${slug.replace(/-/g, '_')}_register_block_patterns() {
    $pattern_categories = array(
        'featured'       => array( 'label' => __( 'Featured', '${slug}' ) ),
        'banner'         => array( 'label' => __( 'Banner', '${slug}' ) ),
        'call-to-action' => array( 'label' => __( 'Call to Action', '${slug}' ) ),
        'text'           => array( 'label' => __( 'Text', '${slug}' ) ),
        'gallery'        => array( 'label' => __( 'Gallery', '${slug}' ) ),
        'testimonials'   => array( 'label' => __( 'Testimonials', '${slug}' ) ),
        'services'       => array( 'label' => __( 'Services', '${slug}' ) ),
        'team'           => array( 'label' => __( 'Team', '${slug}' ) ),
        'contact'        => array( 'label' => __( 'Contact', '${slug}' ) ),
        'about'          => array( 'label' => __( 'About', '${slug}' ) ),
        'portfolio'      => array( 'label' => __( 'Portfolio', '${slug}' ) ),
    );

    foreach ( $pattern_categories as $slug_cat => $props ) {
        if ( ! \\WP_Block_Pattern_Categories_Registry::get_instance()->is_registered( $slug_cat ) ) {
            register_block_pattern_category( $slug_cat, $props );
        }
    }
}
add_action( 'init', '${slug.replace(/-/g, '_')}_register_block_patterns' );
${fontEnqueue}`;
}
