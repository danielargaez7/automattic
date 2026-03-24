import { GoogleGenerativeAI, type Part } from '@google/generative-ai';
import type { ThemeGenerationProvider, GenerationResult } from './provider';
import type { UserInput } from '../schemas/user-input';
import { getSystemPrompt } from './prompts/system-prompt';
import { getPromptTemplate, getCurrentVersion } from './prompts/registry';
import { buildRepairPrompt } from './repair';
import { validateThemeSpec } from '../validators/pipeline';

const MAX_REPAIR_ATTEMPTS = 3;

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
    this.model = model || process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  async generateThemeSpec(input: UserInput): Promise<GenerationResult> {
    const promptTemplate = getPromptTemplate();
    const systemPrompt = getSystemPrompt();
    const userPrompt = promptTemplate.buildUserPrompt(input);

    let totalTokens = 0;
    let repairAttempts = 0;

    // Build multimodal parts
    const parts: Part[] = [];

    // Add inspiration images if provided
    if (input.inspirationImages && input.inspirationImages.length > 0) {
      parts.push({
        text: 'Here are inspiration images the user uploaded. Analyze the colors, mood, typography style, and visual patterns. Use these as strong design direction for the theme:\n',
      });

      for (const img of input.inspirationImages) {
        parts.push({
          inlineData: {
            mimeType: img.mimeType,
            data: img.data,
          },
        });
      }

      parts.push({ text: '\n' });
    }

    // Add extracted design context if available
    if (input.extractedDesign) {
      parts.push({
        text: `\nDesign system extracted from a reference URL:\n${JSON.stringify(input.extractedDesign, null, 2)}\nUse these as strong guidance for the color palette, typography, and spacing.\n\n`,
      });
    }

    parts.push({ text: userPrompt });

    // Initial generation
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
    parts: Part[]
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.model,
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.7,
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
