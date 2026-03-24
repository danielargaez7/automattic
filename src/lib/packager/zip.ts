import archiver from 'archiver';
import { PassThrough } from 'stream';
import fs from 'fs';
import path from 'path';
import type { ThemeSpec } from '../schemas/theme-spec';
import { generateThemeJson } from '../codegen/theme-json';
import { generateStyleCss } from '../codegen/style-css';
import { generateFunctionsPhp } from '../codegen/functions-php';
import { generateAllTemplates } from '../codegen/templates/index';
import { generateHeader } from '../codegen/parts/header';
import { generateFooter } from '../codegen/parts/footer';
import { generateAllPatterns } from '../codegen/patterns/index';
import { generateStyleVariations } from '../codegen/style-variations';
import { validateIntegrity, type IntegrityResult } from './integrity';
import { selectShell } from '../shells/index';

export interface PackageResult {
  buffer: Buffer;
  integrity: IntegrityResult;
  files: string[];
}

export interface PackageOptions {
  themeImages?: Array<{ filePath: string; mimeType: string }>;
  /** Passed from UserInput to enable shell selection */
  siteType?: string;
  vibe?: string;
}

/**
 * Package a validated ThemeSpec into a ZIP archive.
 */
export async function packageTheme(spec: ThemeSpec, options?: PackageOptions): Promise<PackageResult> {
  const slug = spec.metadata.slug;
  const files: Map<string, string> = new Map();
  const binaryFiles: Map<string, Buffer> = new Map();

  // Generate all file contents
  files.set('style.css', generateStyleCss(spec));
  files.set('theme.json', JSON.stringify(generateThemeJson(spec), null, 2));
  files.set('functions.php', generateFunctionsPhp(spec));

  // Templates
  const templates = generateAllTemplates(spec);
  for (const t of templates) {
    files.set(`templates/${t.filename}`, t.content);
  }

  // Template parts
  files.set('parts/header.html', generateHeader(spec));
  files.set('parts/footer.html', generateFooter(spec));

  // Bundle theme images as assets/images/img-1.jpg … img-N.jpg
  const imageUris: string[] = [];
  for (let i = 0; i < (options?.themeImages?.length ?? 0); i++) {
    const img = options!.themeImages![i];
    try {
      const ext = path.extname(img.filePath).toLowerCase() || '.jpg';
      const themeRelPath = `assets/images/img-${i + 1}${ext}`;
      binaryFiles.set(themeRelPath, fs.readFileSync(img.filePath));
      imageUris.push(themeRelPath);
    } catch { /* skip unreadable files */ }
  }

  // Patterns — use a pre-built shell if one matches siteType + vibe,
  // otherwise fall back to codegen generators.
  const shell = selectShell(options?.siteType, options?.vibe);

  if (shell) {
    // Shell provides a home.php pattern; codegen provides all other patterns
    const shellPatterns = shell.buildPatterns(slug, imageUris);
    const shellFilenames = new Set(shellPatterns.map((p) => p.filename));

    // Add shell patterns first
    for (const p of shellPatterns) {
      files.set(`patterns/${p.filename}`, p.content);
    }
    // Add codegen patterns that the shell doesn't override
    const codegenPatterns = generateAllPatterns(spec, imageUris);
    for (const p of codegenPatterns) {
      if (!shellFilenames.has(p.filename)) {
        files.set(`patterns/${p.filename}`, p.content);
      }
    }

    // Override the home template to point at shell's home pattern
    const homeTemplate = `<!-- wp:template-part {"slug":"header","area":"header","tagName":"header"} /-->

<!-- wp:pattern {"slug":"${slug}/home"} /-->

<!-- wp:template-part {"slug":"footer","area":"footer","tagName":"footer"} /-->`;
    files.set('templates/home.html', homeTemplate);
  } else {
    const patterns = generateAllPatterns(spec, imageUris);
    for (const p of patterns) {
      files.set(`patterns/${p.filename}`, p.content);
    }
  }

  // Style variations
  const variations = generateStyleVariations(spec);
  for (const v of variations) {
    files.set(`styles/${v.filename}`, v.content);
  }

  // Validate integrity before packaging
  const integrity = validateIntegrity(files, spec);

  // Build the ZIP
  const buffer = await createZipBuffer(slug, files, binaryFiles);

  return {
    buffer,
    integrity,
    files: [...files.keys()],
  };
}

async function createZipBuffer(
  rootDir: string,
  files: Map<string, string>,
  binaryFiles: Map<string, Buffer> = new Map(),
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const chunks: Buffer[] = [];
    const passthrough = new PassThrough();

    passthrough.on('data', (chunk: Buffer) => chunks.push(chunk));
    passthrough.on('end', () => resolve(Buffer.concat(chunks)));
    passthrough.on('error', reject);

    archive.pipe(passthrough);

    for (const [filePath, content] of files) {
      archive.append(content, { name: `${rootDir}/${filePath}` });
    }

    for (const [filePath, buffer] of binaryFiles) {
      archive.append(buffer, { name: `${rootDir}/${filePath}` });
    }

    archive.finalize();
  });
}
