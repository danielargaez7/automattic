export interface ShellDefinition {
  id: string;
  /** Site types this shell suits */
  siteTypes: string[];
  /** Vibes this shell suits (order = priority) */
  vibes: string[];
  /** Build the home pattern + any extra patterns for this shell */
  buildPatterns(
    slug: string,
    imageUris: string[],
  ): Array<{ filename: string; content: string }>;
}
