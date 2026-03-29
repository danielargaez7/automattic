import type { UserInput } from './schemas/user-input';
import type { ThemeGenerationProvider, GenerationResult } from './ai/provider';
import { AnthropicProvider } from './ai/anthropic';
import { GeminiProvider } from './ai/gemini';
import { packageTheme, type PackageResult } from './packager/zip';
import { scoreAccessibility, type AccessibilityScore } from './validators/accessibility';
import { findReferenceImages } from './utils/reference-library';
import { selectShell } from './shells/index';
import { extractDominantColors } from './utils/extract-colors';
import { getCurrentVersion } from './ai/prompts/registry';

export interface PipelineResult {
  packageResult: PackageResult;
  generation: GenerationResult;
  accessibility: AccessibilityScore;
}

function getProvider(): ThemeGenerationProvider {
  const providerName = process.env.AI_PROVIDER || 'gemini';
  switch (providerName) {
    case 'gemini':
      return new GeminiProvider();
    case 'anthropic':
      return new AnthropicProvider();
    default:
      throw new Error(`Unknown AI provider: ${providerName}. Supported: gemini, anthropic`);
  }
}

/**
 * Run the full theme generation pipeline:
 * UserInput → Prompt → LLM → Validate (with repair) → Codegen → Package → ZIP → Accessibility Score
 */
export async function runPipeline(input: UserInput): Promise<PipelineResult> {
  const provider = getProvider();

  // Auto-inject reference library images if user provided no inspiration images
  let enrichedInput = input;
  let themeImages: Array<{ filePath: string; mimeType: string }> = [];
  if (!input.inspirationImages || input.inspirationImages.length === 0) {
    const refs = await findReferenceImages(6, input.vibe, input.siteType, input.description);
    if (refs.length > 0) {
      enrichedInput = { ...input, inspirationImages: [refs[0]] }; // first image for AI vision
      themeImages = refs;
    }
  }

  // Step 1: Generate Theme Spec via LLM
  // Shell fast path: if a shell matches siteType+vibe, skip block-pattern generation
  // and only ask AI for design tokens — single small call instead of full spec.
  let generation: GenerationResult;
  const shellMatched = !!selectShell(input.siteType, input.vibe);

  if (shellMatched && provider instanceof GeminiProvider) {
    // Pre-extract colors from images for the fast path
    const fastImageParts: import('@google/generative-ai').Part[] = [];
    const fastColors: string[] = [];

    if (enrichedInput.inspirationImages && enrichedInput.inspirationImages.length > 0) {
      for (const img of enrichedInput.inspirationImages) {
        try {
          const colors = await extractDominantColors(img.data, img.mimeType, 6);
          fastColors.push(...colors);
        } catch { /* ignore */ }
        fastImageParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      }
    }

    const fastResult = await provider.generateShellTokens(enrichedInput, fastImageParts, fastColors);

    if (fastResult) {
      generation = {
        spec: fastResult.spec,
        model: provider['model'] as string,
        promptVersion: getCurrentVersion(),
        tokensUsed: fastResult.tokensUsed,
        repairAttempts: 0,
      };
    } else {
      // Fast path failed — fall back to full generation
      console.warn('Shell fast path failed, falling back to full spec generation');
      try {
        generation = await provider.generateThemeSpec(enrichedInput);
      } catch (primaryError) {
        console.warn('Primary AI provider failed, falling back to Anthropic:', primaryError);
        const fallback = new AnthropicProvider();
        generation = await fallback.generateThemeSpec(enrichedInput);
      }
    }
  } else {
    // No shell match — full generation path (includes validation + repair loop)
    try {
      generation = await provider.generateThemeSpec(enrichedInput);
    } catch (primaryError) {
      console.warn('Primary AI provider failed, falling back to Anthropic:', primaryError);
      const fallback = new AnthropicProvider();
      generation = await fallback.generateThemeSpec(enrichedInput);
    }
  }

  // Step 2: Package into ZIP (includes codegen + integrity check)
  const packageResult = await packageTheme(generation.spec, {
    themeImages,
    siteType: input.siteType,
    vibe: input.vibe,
  });

  if (!packageResult.integrity.valid) {
    const issues = packageResult.integrity.errors
      .map((e) => `${e.file}: ${e.message}`)
      .join('; ');
    throw new Error(`Theme packaging integrity check failed: ${issues}`);
  }

  // Step 3: Accessibility scoring
  const accessibility = scoreAccessibility(generation.spec);

  return { packageResult, generation, accessibility };
}
