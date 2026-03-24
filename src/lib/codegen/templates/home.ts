import type { ThemeSpec, Template } from '../../schemas/theme-spec';

export function generateHome(spec: ThemeSpec, template: Template): string {
  const patternIncludes = template.sections
    .map((s) => `<!-- wp:pattern {"slug":"${spec.metadata.slug}/${s.type}"} /-->`)
    .join('\n\n');

  return `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

${patternIncludes}

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
}
