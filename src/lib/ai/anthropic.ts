import Anthropic from '@anthropic-ai/sdk';
import type { ThemeGenerationProvider, GenerationResult } from './provider';
import type { UserInput } from '../schemas/user-input';
import { getSystemPrompt } from './prompts/system-prompt';
import { getPromptTemplate, getCurrentVersion } from './prompts/registry';
import { buildRepairPrompt } from './repair';
import { validateThemeSpec } from '../validators/pipeline';

const MAX_REPAIR_ATTEMPTS = 3;

export class AnthropicProvider implements ThemeGenerationProvider {
  readonly name = 'anthropic';
  private client: Anthropic;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.model = model || process.env.AI_MODEL || 'claude-sonnet-4-20250514';
  }

  async generateThemeSpec(input: UserInput): Promise<GenerationResult> {
    const promptTemplate = getPromptTemplate();
    const systemPrompt = getSystemPrompt();
    const userPrompt = promptTemplate.buildUserPrompt(input);

    let totalTokens = 0;
    let repairAttempts = 0;
    let lastSpec: string = '';

    // Initial generation
    const initialResponse = await this.callApi(systemPrompt, userPrompt);
    totalTokens += initialResponse.tokensUsed;
    lastSpec = initialResponse.content;

    // Parse and validate
    let parsed = this.parseJson(lastSpec);
    let validation = validateThemeSpec(parsed);

    // Repair loop
    while (!validation.valid && repairAttempts < MAX_REPAIR_ATTEMPTS) {
      repairAttempts++;
      const repairPrompt = buildRepairPrompt(validation.errors, lastSpec);
      const repairResponse = await this.callApi(systemPrompt, repairPrompt);
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
    userPrompt: string
  ): Promise<{ content: string; tokensUsed: number }> {
    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const content =
        response.content[0].type === 'text' ? response.content[0].text : '';
      const tokensUsed =
        (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0);

      return { content, tokensUsed };
    } catch (error: unknown) {
      if (error instanceof Anthropic.RateLimitError) {
        throw new Error(
          'AI API rate limit reached. Please wait a moment and try again.'
        );
      }
      if (error instanceof Anthropic.APIError) {
        throw new Error(`AI API error: ${error.message}`);
      }
      throw error;
    }
  }

  private parseJson(content: string): unknown {
    // Strip markdown code fences if the model wraps output
    let cleaned = content.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(cleaned);
    } catch {
      throw new Error(
        `AI returned invalid JSON. First 200 chars: ${cleaned.slice(0, 200)}`
      );
    }
  }
}
