import type { UserInput } from '../../schemas/user-input';
import { buildUserPrompt as v1Builder, PROMPT_VERSION as V1_VERSION } from './v1';

interface PromptTemplate {
  version: string;
  buildUserPrompt: (input: UserInput) => string;
}

const PROMPT_REGISTRY: Record<string, PromptTemplate> = {
  v1: { version: V1_VERSION, buildUserPrompt: v1Builder },
};

const CURRENT_VERSION = 'v1';

export function getPromptTemplate(version?: string): PromptTemplate {
  const v = version || CURRENT_VERSION;
  const template = PROMPT_REGISTRY[v];
  if (!template) {
    throw new Error(`Prompt version "${v}" not found. Available: ${Object.keys(PROMPT_REGISTRY).join(', ')}`);
  }
  return template;
}

export function getCurrentVersion(): string {
  return CURRENT_VERSION;
}
