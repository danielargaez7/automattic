import { GoogleGenerativeAI, type Part } from '@google/generative-ai';
import type { ThemeGenerationProvider, GenerationResult } from './provider';
import type { UserInput } from '../schemas/user-input';
import { getSystemPrompt } from './prompts/system-prompt';
import { getPromptTemplate, getCurrentVersion } from './prompts/registry';
import { buildDesignTokensPrompt } from './prompts/design-tokens-prompt';
import { buildRepairPrompt } from './repair';
import { validateThemeSpec } from '../validators/pipeline';
import { extractDominantColors } from '../utils/extract-colors';

const MAX_REPAIR_ATTEMPTS = 3;

interface LockedTokens {
  colors: Array<{ slug: string; name: string; hex: string; role: string }>;
  headingFont: { family: string; googleFont: boolean };
  bodyFont: { family: string; googleFont: boolean };
  mood: string;
}

export class GeminiProvider implements ThemeGenerationProvider {
  readonly name = 'gemini';
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY || '';
    if (!key) {
      throw new Error('GEMINI_API_KEY is required');
    }
    this.client = new GoogleGenerativeAI(key);
    this.model = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  }

  async generateThemeSpec(input: UserInput): Promise<GenerationResult> {
    const promptTemplate = getPromptTemplate();
    const systemPrompt = getSystemPrompt();

    let totalTokens = 0;
    let repairAttempts = 0;

    // ── PASS 1: Extract dominant colors from images ──
    const allExtractedColors: string[] = [];
    const imageParts: Part[] = [];

    if (input.inspirationImages && input.inspirationImages.length > 0) {
      for (const img of input.inspirationImages) {
        try {
          const colors = await extractDominantColors(img.data, img.mimeType, 6);
          allExtractedColors.push(...colors);
        } catch { /* fall back to visual only */ }
        imageParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
      }
    }
    const uniqueColors = [...new Set(allExtractedColors)].slice(0, 10);

    // ── PASS 2: Lock design tokens first ──
    let lockedTokens: LockedTokens | null = null;
    try {
      const tokenPrompt = buildDesignTokensPrompt(input, uniqueColors);
      const tokenParts: Part[] = [];
      if (imageParts.length > 0) {
        tokenParts.push({ text: 'Inspiration images:\n' });
        tokenParts.push(...imageParts);
        tokenParts.push({ text: '\n' });
      }
      tokenParts.push({ text: tokenPrompt });
      const tokenResponse = await this.callApi('You are a visual designer. Output only JSON.', tokenParts, 1024);
      totalTokens += tokenResponse.tokensUsed;
      lockedTokens = JSON.parse(tokenResponse.content.trim().replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '')) as LockedTokens;
    } catch { /* if pass 1 fails, continue to pass 2 without locked tokens */ }

    // ── PASS 3: Generate full theme spec with locked tokens ──
    const userPrompt = promptTemplate.buildUserPrompt(input);
    const parts: Part[] = [];

    if (imageParts.length > 0) {
      parts.push({
        text: `Inspiration images:\n` +
          (uniqueColors.length > 0 ? `EXACT pixel colors from these images: ${uniqueColors.join(', ')}\n` : ''),
      });
      parts.push(...imageParts);
      parts.push({ text: '\n' });
    }

    if (lockedTokens) {
      parts.push({
        text: `\n⚠️ LOCKED DESIGN TOKENS — you MUST use these exact values, do not change them:\n` +
          `Colors: ${JSON.stringify(lockedTokens.colors)}\n` +
          `Heading font: ${lockedTokens.headingFont.family}\n` +
          `Body font: ${lockedTokens.bodyFont.family}\n` +
          `Mood: ${lockedTokens.mood}\n\n`,
      });
    }

    if (input.extractedDesign) {
      parts.push({
        text: `Design system from reference URL:\nColors: ${(input.extractedDesign.colors ?? []).join(', ')}\nFonts: ${(input.extractedDesign.fontFamilies ?? []).join(', ')}\nMood: ${input.extractedDesign.mood}\n\n`,
      });
    }

    parts.push({ text: userPrompt });

    const initialResponse = await this.callApi(systemPrompt, parts);
    totalTokens += initialResponse.tokensUsed;
    let lastSpec = initialResponse.content;

    // Parse and validate
    let parsed = this.parseJson(lastSpec);
    let validation = validateThemeSpec(parsed);

    // Repair loop
    while (!validation.valid && repairAttempts < MAX_REPAIR_ATTEMPTS) {
      repairAttempts++;
      const repairPrompt = buildRepairPrompt(validation.errors, lastSpec);
      const repairResponse = await this.callApi(systemPrompt, [{ text: repairPrompt }]);
      totalTokens += repairResponse.tokensUsed;
      lastSpec = repairResponse.content;
      parsed = this.parseJson(lastSpec);
      validation = validateThemeSpec(parsed);
    }

    if (!validation.valid || !validation.data) {
      const errorSummary = validation.errors.map((e) => `${e.path}: ${e.message}`).join('; ');
      throw new Error(
        `Failed to generate valid theme spec after ${repairAttempts} repair attempts. Errors: ${errorSummary}`
      );
    }

    return {
      spec: validation.data,
      model: this.model,
      promptVersion: getCurrentVersion(),
      tokensUsed: totalTokens,
      repairAttempts,
    };
  }

  private async callApi(
    systemPrompt: string,
    parts: Part[],
    maxTokens = 8192
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.8,
        },
      });

      const response = result.response;
      const content = response.text();
      const usage = response.usageMetadata;
      const tokensUsed = (usage?.promptTokenCount || 0) + (usage?.candidatesTokenCount || 0);

      return { content, tokensUsed };
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED')) {
          throw new Error('AI API rate limit reached. Please wait a moment and try again.');
        }
        throw new Error(`Gemini API error: ${error.message}`);
      }
      throw error;
    }
  }

  private parseJson(content: string): unknown {
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }
    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`AI returned invalid JSON. First 200 chars: ${cleaned.slice(0, 200)}`);
    }
  }
}
