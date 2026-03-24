import type { ThemeSpec, Template } from '../../schemas/theme-spec';
import { generateHome } from './home';
import { generateSingle } from './single';
import { generatePage } from './page';
import { generateArchive } from './archive';
import { generateFourOhFour } from './four-oh-four';
import { generateSearch } from './search';

/**
 * Generate all template HTML files from the ThemeSpec.
 */
export function generateAllTemplates(
  spec: ThemeSpec
): Array<{ filename: string; content: string }> {
  const templateMap: Record<string, (spec: ThemeSpec, template: Template) => string> = {
    index: generateDefaultIndex,
    home: generateHome,
    single: generateSingle,
    page: generatePage,
    archive: generateArchive,
    '404': generateFourOhFour,
    search: generateSearch,
  };

  return spec.templates.map((template) => {
    const generator = templateMap[template.slug] || generateDefaultIndex;
    return {
      filename: `${template.slug}.html`,
      content: generator(spec, template),
    };
  });
}

/**
 * The default index template — required fallback for all WP block themes.
 */
function generateDefaultIndex(spec: ThemeSpec, template: Template): string {
  const patternIncludes = template.sections
    .map((s) => `<!-- wp:pattern {"slug":"${spec.metadata.slug}/${s.type}"} /-->`)
    .join('\n\n');

  const hasPatterns = template.sections.length > 0;

  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

${
  hasPatterns
    ? patternIncludes
    : `<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">

<!-- wp:query {"queryId":1,"query":{"perPage":10,"offset":0,"postType":"post","order":"desc","orderBy":"date"}} -->
<div class="wp-block-query">
  <!-- wp:post-template -->
    <!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|30"}},"layout":{"type":"constrained"}} -->
    <div class="wp-block-group">
      <!-- wp:post-title {"isLink":true,"fontSize":"x-large"} /-->
      <!-- wp:post-date {"fontSize":"small"} /-->
      <!-- wp:post-excerpt {"excerptLength":30} /-->
    </div>
    <!-- /wp:group -->

    <!-- wp:spacer {"height":"var:preset|spacing|50"} -->
    <div style="height:var(--wp--preset--spacing--50)" aria-hidden="true" class="wp-block-spacer"></div>
    <!-- /wp:spacer -->
  <!-- /wp:post-template -->

  <!-- wp:query-pagination {"layout":{"type":"flex","justifyContent":"center"}} -->
    <!-- wp:query-pagination-previous /-->
    <!-- wp:query-pagination-numbers /-->
    <!-- wp:query-pagination-next /-->
  <!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->

</div>
<!-- /wp:group -->`
}

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
