# BlockForge

**Forge beautiful WordPress block themes from words.**

BlockForge is an AI-powered web application that generates complete, installable WordPress Block Themes from natural language descriptions. It produces valid, standards-compliant `.zip` files ready for installation on any WordPress site.

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url> && cd blockforge

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# 4. Start development server
npm run dev

# 5. Open in browser
open http://localhost:3000
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | Yes | — | Your Anthropic API key |
| `AI_PROVIDER` | No | `anthropic` | AI provider to use |
| `AI_MODEL` | No | `claude-sonnet-4-20250514` | Model ID |

## Architecture

```
User Input → Prompt Builder → LLM → Theme Spec JSON → Validator → Codegen → ZIP
                                         ↑                  |
                                         └── Repair Loop ───┘ (max 3 attempts)
```

### The Six Layers

1. **Input UI** (Next.js React) — Collects description, site type, vibe, palette, fonts
2. **Prompt Builder** (TypeScript) — Constructs versioned system + user prompts with WP constraints
3. **LLM Adapter** (Provider-agnostic) — Calls Anthropic Claude, parses JSON response
4. **Spec Validator** (Zod + custom checks) — Schema validation, WCAG contrast checks, block constraint enforcement
5. **Code Generator** (Deterministic TypeScript) — Compiles Theme Spec into theme.json, templates, parts, patterns
6. **Packager** (Archiver) — Assembles ZIP with integrity validation

### Key Design Decision

**The LLM never generates raw WordPress files.** It generates a structured Theme Spec JSON. Everything downstream is deterministic compilation. This gives us reliable output AND creative designs.

The LLM is good at creative decisions (color palettes, typography pairings, pattern selection). It's bad at generating syntactically correct WordPress block markup. By splitting creative decisions from mechanical output, we get the best of both worlds.

### Generated Theme Structure

```
{theme-slug}/
├── style.css          # Theme metadata header
├── theme.json         # Design tokens + settings (v3)
├── functions.php      # Pattern registration, font loading
├── templates/         # index, home, single, page, archive, 404
├── parts/             # header.html, footer.html
├── patterns/          # PHP pattern files with i18n
└── styles/            # Style variation JSON files
```

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch
```

Tests cover: schema validation, design token validation, block constraint validation, theme.json generation, pattern generation, ZIP packaging, and full pipeline integration.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **AI Provider:** Anthropic Claude (via `@anthropic-ai/sdk`)
- **Validation:** Zod
- **Styling:** Tailwind CSS
- **ZIP:** Archiver
- **Testing:** Vitest

## Known Limitations

- **Fixed pattern library:** The 20 built-in pattern types define the visual vocabulary. New layouts require adding pattern generators to the codegen layer.
- **No live preview:** The MVP generates a downloadable ZIP. WordPress Playground integration is architecturally supported but not yet implemented.
- **Single generation:** No iterative refinement — each generation is independent. The spec supports diffing but the UI doesn't expose it yet.
- **No image generation:** Patterns include placeholder `<img>` tags. Users add their own images in the WordPress editor.
- **Google Fonts only:** The font loading assumes Google Fonts. Self-hosted font support would require bundling font files in the ZIP.

## Documentation

- [Architectural Decision Records](docs/ADR.md) — Key technical decisions and trade-offs
- [What I'd Do Next](docs/NEXT.md) — Future roadmap and production readiness plan
