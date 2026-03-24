# DreamBuilder

**Describe your dream website. Get a real, installable WordPress Block Theme.**

DreamBuilder is an AI-powered application that converts natural language descriptions into complete, standards-compliant WordPress Block Theme `.zip` files — ready to install on any WordPress site in under 60 seconds.

Built as part of the Automattic engineering challenge.

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/danielargaez7/automattic.git
cd automattic
npm install

# 2. Add API keys
cp .env.example .env.local
# Edit .env.local — add your Gemini and/or Anthropic API key (see below)

# 3. Run
npm run dev

# 4. Open
open http://localhost:3333
```

**That's it. No database, no external services, no Docker.**

---

## Running Tests

```bash
npm test
```

81 tests across 10 test files. All should pass with no setup beyond `npm install`. No API keys required for tests — the test suite is fully offline.

```
Test Files  10 passed (10)
Tests       81 passed (81)
Duration    ~400ms
```

Test coverage includes: schema validation, design token validation (WCAG contrast), block constraint enforcement, theme.json generation, pattern block syntax, ZIP packaging integrity, and a full end-to-end pipeline integration test.

---

## Environment Variables

Create a `.env.local` in the project root:

```env
# AI Provider: "gemini" (default) or "anthropic"
AI_PROVIDER=gemini

# Gemini (primary — supports multimodal image analysis)
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-001

# Anthropic (automatic fallback if Gemini fails)
ANTHROPIC_API_KEY=your_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3333
```

**Only one API key is required.** Gemini is the default because it supports multimodal inputs (image + text in a single call). If Gemini fails, the pipeline automatically falls back to Anthropic without user-facing errors.

Get keys here:
- Gemini: https://aistudio.google.com/app/apikey
- Anthropic: https://console.anthropic.com/settings/keys

---

## What It Does

A user types a description like *"A warm gardening blog with earthy tones and serif fonts"* and gets back a downloadable `.zip` containing a complete WordPress Block Theme:

```
garden-grove/
├── style.css              # Theme metadata header
├── theme.json             # Design tokens + settings (v3 schema)
├── functions.php          # Pattern registration, Google Fonts enqueue
├── templates/
│   ├── index.html         # Main template (required)
│   ├── home.html
│   ├── single.html
│   ├── page.html
│   ├── archive.html
│   ├── 404.html
│   └── search.html
├── parts/
│   ├── header.html
│   └── footer.html
├── patterns/              # PHP block pattern files
│   ├── hero-centered.php
│   ├── blog-latest-posts.php
│   └── ...
└── styles/
    ├── dark-mode.json     # Style variation 1
    └── light-airy.json    # Style variation 2
```

The theme installs and activates in WordPress with zero manual editing required.

---

## Architecture

### The Core Insight

**The LLM never writes raw WordPress files.** Instead it produces a structured `ThemeSpec` JSON object. All WordPress file generation is deterministic TypeScript. This is the key design decision:

- LLMs are excellent at creative decisions (colors, typography pairings, layout choices)
- LLMs are unreliable at generating syntactically correct WordPress block markup
- Separating creative decisions from mechanical output gives us both reliability and quality

### Pipeline

```
User Input
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  PASS 1: Design Token Lock                              │
│  Images → Color Extractor (sharp) → Exact hex values   │
│  Input + colors → LLM → { colors, fonts, mood }        │
└─────────────────────────────┬───────────────────────────┘
                              │ locked tokens
    ▼
┌─────────────────────────────────────────────────────────┐
│  PASS 2: Theme Spec Generation                          │
│  Input + locked tokens → LLM → ThemeSpec JSON          │
│       ↑                                                 │
│       └── Repair Loop (max 3 attempts on invalid JSON)  │
└─────────────────────────────┬───────────────────────────┘
                              │ valid ThemeSpec
    ▼
┌─────────────────────────────────────────────────────────┐
│  Validation Pipeline                                    │
│  Schema (Zod) → Design Tokens (WCAG) → Block Constraints│
└─────────────────────────────┬───────────────────────────┘
                              │
    ▼
┌─────────────────────────────────────────────────────────┐
│  Deterministic Code Generation                          │
│  theme.json │ templates │ parts │ patterns │ variations │
└─────────────────────────────┬───────────────────────────┘
                              │
    ▼
┌─────────────────────────────────────────────────────────┐
│  Packager + Integrity Check                             │
│  ZIP → verify required files, no wp:html, valid JSON    │
└─────────────────────────────┬───────────────────────────┘
                              │
    ▼
  .zip + Accessibility Score (WCAG AA) + 3 Variations
```

### Two-Pass Generation

A single-pass "generate everything" prompt produces generic output. DreamBuilder uses two passes:

1. **Token Lock** — a fast, focused call extracts only colors, fonts, and mood from the user's description and any uploaded images. These are locked as hard constraints.
2. **Full Spec** — the second call generates the complete theme spec with those tokens embedded. The AI can't drift from the chosen palette.

### Provider Interface

Swapping AI providers is trivial by design:

```typescript
interface ThemeGenerationProvider {
  readonly name: string;
  generateThemeSpec(input: UserInput): Promise<GenerationResult>;
}
```

`GeminiProvider` and `AnthropicProvider` both implement this interface. The pipeline reads `AI_PROVIDER` from env and instantiates accordingly. Adding a new provider (OpenAI, local model) requires implementing one method.

---

## Features

**Input**
- Natural language description
- Visual vibe picker (8 options with real photography)
- Site type selection (blog, portfolio, business, ecommerce, personal, agency)
- Drag-and-drop inspiration image upload (up to 3 images, multimodal analysis)
- URL design extraction — paste any URL, extract colors and fonts from its CSS
- Font and color preference hints

**AI Generation**
- Two-pass generation (lock tokens → generate spec)
- Dominant color extraction from images via pixel analysis (not AI guessing)
- Automatic reference image injection from curated library when no user image provided
- Repair loop: up to 3 automatic correction attempts on invalid output
- Automatic fallback from Gemini → Anthropic on any provider failure
- Prompt caching on Anthropic calls (reduced latency + cost)
- Generates 3 parallel variations — user picks their favorite

**Output**
- Complete WordPress Block Theme v3 (`theme.json` schema)
- 20 block pattern types (hero, features, testimonials, pricing, FAQ, gallery, CTA, etc.)
- 7 template types (index, home, single, page, archive, 404, search)
- 2 style variations per theme
- WCAG AA accessibility score (contrast ratios, font sizes, spacing)
- Live preview via WordPress Playground with theme installed and sample content loaded
- Downloadable ZIP, installable directly from WordPress admin

**Quality Enforcement**
- `wp:html` block is explicitly forbidden — detected and rejected in both the repair loop and post-packaging integrity check
- All block markup uses native WordPress block syntax (`<!-- wp:paragraph -->` etc.)
- Slug format validated as kebab-case at every schema boundary
- WCAG AA contrast ratio enforced on generated color pairs

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Multi-step wizard UI
│   ├── globals.css                 # Custom animations + design tokens
│   └── api/
│       ├── generate/route.ts       # POST /api/generate — runs pipeline
│       ├── download/route.ts       # POST /api/download — serves ZIP
│       └── extract-design/route.ts # POST /api/extract-design — scrapes URL CSS
├── lib/
│   ├── ai/
│   │   ├── provider.ts             # ThemeGenerationProvider interface
│   │   ├── gemini.ts               # Gemini implementation (multimodal, two-pass)
│   │   ├── anthropic.ts            # Anthropic implementation (fallback, cached)
│   │   ├── repair.ts               # Repair loop prompt builder
│   │   └── prompts/
│   │       ├── system-prompt.ts    # WordPress constraints + design quality rules
│   │       ├── v1.ts               # User prompt builder
│   │       └── design-tokens-prompt.ts  # Pass 1: token extraction prompt
│   ├── schemas/
│   │   ├── theme-spec.ts           # Full ThemeSpec Zod schema (source of truth)
│   │   └── user-input.ts           # UserInput Zod schema
│   ├── validators/
│   │   ├── pipeline.ts             # Orchestrates all validators
│   │   ├── schema-validator.ts     # Zod schema check
│   │   ├── design-token-validator.ts  # WCAG contrast, font sizes, spacing
│   │   ├── block-validator.ts      # Pattern types, index template requirement
│   │   └── accessibility.ts        # Accessibility scorecard (grade A-F)
│   ├── codegen/
│   │   ├── theme-json.ts           # ThemeSpec → theme.json v3
│   │   ├── style-css.ts            # ThemeSpec → style.css header
│   │   ├── functions-php.ts        # ThemeSpec → functions.php
│   │   ├── templates/              # 7 template generators
│   │   ├── parts/                  # header.ts, footer.ts
│   │   └── patterns/               # 20 pattern generators
│   ├── packager/
│   │   ├── zip.ts                  # Assembles and compresses ZIP
│   │   └── integrity.ts            # Post-packaging file validation
│   ├── pipeline.ts                 # Orchestrates the full generation pipeline
│   └── utils/
│       ├── extract-colors.ts       # Pixel-level dominant color extraction (sharp)
│       └── reference-library.ts    # Auto-matches reference images by vibe + site type
tests/
├── unit/
│   ├── schemas/                    # UserInput and ThemeSpec validation
│   ├── validators/                 # Schema, design token, block, accessibility
│   ├── codegen/                    # theme.json, pattern block syntax
│   └── packager/                   # ZIP structure and integrity
├── integration/
│   └── pipeline.test.ts            # End-to-end: spec → validate → package → ZIP
└── fixtures/                       # Sample specs and inputs (photography, blog, business)
public/
├── library/                        # Reference image library (vibe-matched)
│   ├── minimalist/
│   ├── bold/
│   └── ...                         # See public/library/README.md for naming
└── vibes/                          # Vibe card images for the UI picker
```

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | API routes + React UI in one project |
| Language | TypeScript strict | Schema safety across the whole pipeline |
| Primary AI | Google Gemini 2.0 Flash | Multimodal (image + text), fast, cost-effective |
| Fallback AI | Anthropic Claude Sonnet | Reliability fallback, prompt caching support |
| Validation | Zod | Runtime schema enforcement + TypeScript types |
| Image Processing | sharp | Server-side pixel color extraction |
| ZIP | archiver | Streaming ZIP compression |
| Styling | Tailwind CSS v4 | |
| Testing | Vitest | Fast, ESM-native, Jest-compatible API |

---

## Design Decisions

Full rationale for key decisions is in [docs/ADR.md](docs/ADR.md).

**Why structured JSON instead of raw file generation?**
The LLM produces a `ThemeSpec` object. Deterministic TypeScript compiles it into WordPress files. This separation means: (1) the AI can be creative without corrupting file syntax, (2) every output is reproducible from its spec, (3) validation is straightforward.

**Why two-pass generation?**
Single-pass prompts produce color drift — the AI makes creative choices mid-generation and can end up far from the inspiration. Locking design tokens in pass 1 constrains pass 2 to a specific palette. Quality improves significantly, especially with uploaded images.

**Why Gemini as primary?**
Multimodal support. A user can drop a photo of a website they love, and Gemini analyzes the visual style, layout, and mood directly — not just the extracted CSS. Anthropic is the fallback for reliability.

---

## Known Limitations

- **Pattern library is fixed at 20 types.** New layouts require adding generators to `src/lib/codegen/patterns/`.
- **Google Fonts only.** Font loading assumes Google Fonts CDN. Self-hosted fonts would require bundling `.woff2` files in the ZIP.
- **No image generation.** Patterns use CSS placeholder backgrounds. Users add real images in the WordPress editor.
- **Reference library ships empty.** The `public/library/` folders need royalty-free images dropped in to activate auto-injection. See `public/library/README.md`.
- **WordPress Playground preview is local only.** The `@wp-playground/client` integration works in development. A production deployment would need the ZIP served at a public URL for cross-origin Playground access.

---

## Roadmap

See [docs/NEXT.md](docs/NEXT.md) for the full production roadmap.

Short list:
- Keyword-based reference library matching (description → image category)
- Iterative refinement ("make it darker", regenerate just colors)
- WordPress.com OAuth publish flow
- Streaming generation progress
- Theme history (localStorage)
