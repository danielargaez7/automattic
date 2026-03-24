import type { UserInput } from './schemas/user-input';
import type { ThemeGenerationProvider, GenerationResult } from './ai/provider';
import { AnthropicProvider } from './ai/anthropic';
import { GeminiProvider } from './ai/gemini';
import { packageTheme, type PackageResult } from './packager/zip';
import { scoreAccessibility, type AccessibilityScore } from './validators/accessibility';
import { findReferenceImages } from './utils/reference-library';

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

  // Step 1: Generate Theme Spec via LLM (includes validation + repair loop)
  // Fall back to Anthropic if primary provider fails
  let generation: GenerationResult;
  try {
    generation = await provider.generateThemeSpec(enrichedInput);
  } catch (primaryError) {
    console.warn('Primary AI provider failed, falling back to Anthropic:', primaryError);
    const fallback = new AnthropicProvider();
    generation = await fallback.generateThemeSpec(enrichedInput);
  }

  // Step 2: Package into ZIP (includes codegen + integrity check)
  const packageResult = await packageTheme(generation.spec, { themeImages });

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
