# What I'd Do Next

## What's Already Shipped (MVP)

To set context for what "next" means — the current MVP already includes:

- Live WordPress Playground preview with the generated theme auto-installed
- 3 parallel variations with a visual picker (color swatches + accessibility grade)
- WCAG AA accessibility scoring on every generation
- Two-pass generation (token lock → full spec)
- Dominant color extraction from inspiration images (pixel-level, not AI guessing)
- Automatic reference image injection from a curated library by vibe + site type
- URL design extraction (CSS scraping → color + font palette)
- Automatic Anthropic fallback if Gemini fails

The items below are what comes *after* this foundation.

---

## With Another Week

### Formal Block Validation Pipeline

The current integrity checks verify file structure and forbid `wp:html`. What's missing is a grammar-level validator for block markup — one that verifies attribute schemas, nesting rules, and block support levels against the Gutenberg specification.

This matters because a block can be syntactically valid HTML-comment-wise but semantically broken (e.g., a `wp:cover` with a `layout` attribute that the installed Gutenberg version doesn't support). A formal parser would catch these before the ZIP is packaged.

Approach: Parse the block comment attributes as JSON, validate against a local copy of the Gutenberg block.json manifests for each block type.

### Iterative Refinement via Chat

After the initial generation, let users make incremental changes: *"Make the header sticky,"* *"Switch to a darker palette,"* *"Add a pricing section."*

The key architectural requirement: produce a **diff-based ThemeSpec update**, not a full regeneration. The user's previous choices should be preserved. Implementation would require serializing the current ThemeSpec as context in the refinement prompt and constraining the AI to only modify the fields relevant to the request.

This is the highest-value UX improvement available — it changes DreamBuilder from a one-shot generator into a design tool.

### Keyword-Based Reference Library Matching

Currently the reference library matches on `vibe + siteType`. A garden blog and a hiking blog both hit `organic/` — but they want very different aesthetics.

Extend the lookup to scan the user's description for content keywords (plants, food, architecture, fashion, dark, etc.) and match against subject-matter image categories. A garden blog gets nature images. A restaurant gets food photography. This requires building the library with 8-12 content categories and ~5 images each.

### WordPress.com OAuth Publish Flow

A "Publish to WordPress.com" button that completes the loop: describe → generate → live site. The WordPress.com REST API supports theme upload at `POST /rest/v1.1/sites/{id}/themes/upload`. Requires OAuth 2.0 with `themes` scope. The UI work is mostly done — what's needed is the OAuth flow and the upload call.

---

## For Production Readiness

### URL Extraction Security Hardening

The `/api/extract-design` endpoint fetches arbitrary user-provided URLs. In production it needs:
- Block list for private IP ranges (localhost, 192.168.x.x, 169.254.x.x) to prevent SSRF
- Explicit timeout and response size caps
- Domain allowlist option for enterprise deployments

### Rate Limiting and Cost Controls

Per-user generation limits (IP-based or session-based), token budget monitoring per request, and graceful degradation when approaching API limits. At current token usage (~6-10k per generation with two-pass + 3 variations), unconstrained usage would be expensive quickly.

### Async Generation Queue

Theme generation takes 20-45 seconds with 3 parallel variations. At scale, this needs to move to an async job queue (BullMQ or similar): return a job ID immediately, poll for completion, stream progress events via SSE. The synchronous API route approach doesn't survive concurrent load.

### Visual Regression Testing

Run generated themes through Playwright against WordPress Playground: screenshot at 3 viewport sizes, compare against a baseline. Catch rendering regressions when the codegen or block markup changes. This is the only way to confidently refactor the pattern library without breaking visual output.

### `.env.example` and Local Setup Hardening

Add a proper `.env.example` with placeholder values so `cp .env.example .env.local` is the only setup step. Document what happens if only one of the two API keys is provided (Gemini-only, Anthropic-only modes).

---

## For Scaling Dynamic Features

### Generation Queue with Streaming Progress

The current polling approach (timer-incremented UI stage) is cosmetic — the stages don't reflect actual pipeline progress. Real streaming would use Server-Sent Events to emit progress from the pipeline as each validation layer completes. More honest UX and better developer visibility into where time is spent.

### Fine-Tuned Model

The current prompt engineering works reliably, but repair loop frequency (currently ~15% of generations need at least one repair) indicates the base model has non-trivial misalignment with the ThemeSpec schema. A fine-tuned model trained on ThemeSpec examples would reduce repair frequency, improve design creativity, and produce richer pattern selection. The ThemeSpec format is simple enough that a training dataset of ~500 curated examples would meaningfully improve output quality.

### Template Library Crowdsourcing

Allow users to contribute patterns back to a community library. Generated patterns that score A on accessibility and pass all validators automatically qualify for community review. This expands the 20-pattern vocabulary over time without requiring core engineering work for each new pattern type.

### MCP Tool Exposure

Package the generation pipeline as an MCP (Model Context Protocol) server. This would allow AI coding assistants (Claude Code, Cursor, etc.) to invoke `generate_wordpress_theme` as a tool call from inside a development workflow. An engineer building a client site could describe it in natural language and receive a theme ZIP without leaving their editor. This aligns with where AI-native tooling is headed.

### Plugin Marketplace Submission Pipeline

Validate generated themes against WordPress.org theme review requirements: screenshot generation, proper licensing headers, no deprecated functions, accessibility statement. Automate the submission package. The gap between "generates a valid theme" and "passes WordPress.org review" is mostly documentation and metadata — worth closing for themes users want to distribute.
