# What I'd Do Next

## With Another Week

### Formal Block Validation Pipeline
Build a proper WordPress block grammar parser that validates generated markup against the Gutenberg block specification — not just regex checks. This would catch nesting errors, invalid attribute combinations, and deprecated block syntax before they reach the user.

### Live WordPress Playground Preview
Embed a WordPress Playground iframe that loads the generated theme in a real WordPress environment. Users would see their theme rendered exactly as it would appear on a live site, with responsive preview toggles (desktop/tablet/mobile).

### Iterative Refinement via Chat
After the initial generation, let users make incremental changes: "Make the header sticky," "Switch to a darker palette," "Add a pricing section." Each change would produce a diff-based Theme Spec update rather than a full regeneration, preserving previous customizations.

### Multi-Option Style Tiles
Generate 3 distinct style variations simultaneously (Refined, Bold, Warm) by making parallel LLM calls with different design direction prompts. Present them as visual cards with palette strips and typography samples so users can pick their preferred direction.

### WooCommerce Starter Patterns
Add product grid, cart summary, and checkout flow patterns that work with WooCommerce blocks. This would make the generated themes immediately useful for e-commerce sites.

## For Production Readiness

### Visual Regression Testing
Screenshot comparison of generated themes across browser engines to catch rendering issues. Run generated themes through Playwright to verify they render correctly at multiple viewport sizes.

### Rate Limiting and Cost Controls
Per-user generation limits, token budget monitoring, and graceful degradation when approaching API limits. Track cost-per-generation to ensure sustainability.

### Block Grammar Parser
A formal parser for WordPress block markup that validates nesting rules, attribute schemas, and block support levels. The current integrity checks catch structural issues but don't validate block-level semantics.

### Accessibility Scoring
Run axe-core on the Playground preview and display a WCAG compliance score. Flag specific issues (missing alt text patterns, color contrast in patterns, keyboard navigation). This aligns with Automattic's democratization mission.

### MCP Tool Exposure
Package the generation pipeline as an MCP (Model Context Protocol) tool that AI agents can invoke programmatically. This follows WordPress.com's direction with scoped access and revocation for AI agent connectivity.

## For Scaling

### Generation Queue
Move theme generation to async job processing (e.g., BullMQ) to handle concurrent users without timeout issues. Return a job ID immediately and poll for completion.

### Template Library Crowdsourcing
Allow users to contribute patterns back to a community library, expanding the design vocabulary over time. Curate submissions with automated quality checks and human review.

### Fine-Tuned Model
Train a specialized model on the WordPress block theme corpus for higher-quality, more reliable structured output. The current prompt engineering works well but a fine-tuned model would reduce repair loop frequency and improve design creativity.

### WordPress.com API Integration
Direct theme deployment to WordPress.com sites via REST API, closing the loop from generation to live site. This would be the ultimate "describe it and it's live" experience.

### Plugin Marketplace Submission
Validate generated themes against WordPress.org theme review requirements for marketplace submission. Add screenshot generation, proper licensing headers, and review-ready documentation.
