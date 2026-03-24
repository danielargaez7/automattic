# Architectural Decision Records

## ADR-001: Deterministic Pipeline Over Direct LLM File Generation

**Context:** The core challenge is generating syntactically correct WordPress block markup — HTML comments with serialized JSON attributes. LLMs frequently produce malformed block syntax when asked to generate raw theme files. A single misplaced quote in a block attribute breaks the entire template.

**Decision:** The LLM generates a structured `ThemeSpec` JSON object — not raw WordPress files. A deterministic TypeScript pipeline compiles the spec into theme files.

**Alternatives Considered:**
- *Direct file generation*: Have the LLM output each file (theme.json, templates, patterns) directly. Rejected because block markup syntax errors are extremely common in raw LLM output and validation of free-form HTML is much harder than validation of structured JSON.
- *Hybrid approach*: LLM generates theme.json directly but uses templates for block markup. Rejected because even theme.json generation has edge cases the LLM gets wrong (wrong schema URLs, invalid property names, conflicting settings).

**Trade-offs Accepted:** Less creative freedom in block-level layout decisions. The codegen layer's 20-pattern vocabulary is the limiting factor on visual variety. New layouts require adding TypeScript pattern generators, not prompting.

**Consequences:** ~95%+ valid output on first generation attempt. Testable, deterministic pipeline. Clear separation between creative decisions (AI) and mechanical correctness (codegen).

---

## ADR-002: Theme Spec as Intermediate Representation

**Context:** We need a typed, validated contract between the AI's creative decisions and the mechanical output of WordPress files.

**Decision:** A Zod-validated JSON schema (`ThemeSpec`) captures all creative decisions: colors, typography, spacing, layout, pattern selection, and header/footer configuration. The codegen layer consumes this spec deterministically.

**Alternatives Considered:**
- *Generate theme.json directly*: Conflates design intent with WordPress schema compliance. The LLM would need to understand both creative design AND the exact WordPress theme.json v3 specification simultaneously.
- *Flat key-value config*: Simpler but couldn't express the relationships between design tokens, template composition, and pattern selection.

**Consequences:** Clean separation of concerns. Creative decisions are validated independently from mechanical correctness. The spec also serves as a documentation artifact for what was generated — it can be serialized and replayed.

---

## ADR-003: Pattern Template Composition Over Raw Markup Generation

**Context:** WordPress block patterns require precise HTML comment syntax with serialized JSON attributes. Even small syntax errors break block parsing silently.

**Decision:** Block patterns are assembled from pre-written, pre-validated TypeScript template functions populated with design tokens from the Theme Spec. The LLM selects *which* patterns to use and *how* to configure them; the codegen produces the markup.

**Alternatives Considered:**
- *Full LLM-generated patterns*: Maximum creative freedom but highest failure rate. Block markup syntax is fragile and LLMs regularly produce invalid attribute JSON.
- *JSON-to-markup mapping with LLM-generated JSON per pattern*: Middle ground, but adds complexity without proportional reliability gain. The LLM would still need to understand block attribute schemas.

**Trade-offs Accepted:** Fixed pattern vocabulary. Adding a new pattern type (e.g., a video hero, a testimonial carousel) requires writing a TypeScript generator. This is the correct trade-off for an MVP — reliability over infinite variety.

**Consequences:** 100% syntactically correct block markup. The `wp:html` block is explicitly forbidden at both the prompt level and the post-packaging integrity check.

---

## ADR-004: Gemini as Primary Provider, Anthropic as Fallback

**Context:** The brief allows any AI provider. The key requirements are: strong structured JSON output, reliable instruction following, and multimodal support for analyzing inspiration images.

**Decision:** Google Gemini 2.0 Flash as primary, Anthropic Claude Sonnet as automatic fallback, with a provider adapter interface that makes swapping trivial.

**Why Gemini Primary:**
Gemini supports multimodal inputs (image + text in a single API call). When a user uploads an inspiration image, Gemini can visually analyze the color palette, typography style, and layout density directly — not just extract CSS. This produces significantly better themed output than text-only prompting. Gemini 2.0 Flash is also faster and cheaper per token than equivalents.

**Why Anthropic as Fallback:**
Anthropic's Claude has excellent structured JSON output and instruction following. It supports prompt caching (`cache_control: ephemeral`) on the system prompt, reducing latency and cost on repeated calls. It's the right fallback for reliability — different model family, different failure modes.

**Alternatives Considered:**
- *OpenAI GPT-4o*: Strong alternative with good JSON mode. Could be added as a third provider via the same interface with minimal work.
- *Local models (Ollama, etc.)*: No API cost, no external dependency. Rejected for MVP — local model structured output quality is significantly lower, especially for complex nested JSON schemas.

**Provider Interface:** Both providers implement `ThemeGenerationProvider`:
```typescript
interface ThemeGenerationProvider {
  readonly name: string;
  generateThemeSpec(input: UserInput): Promise<GenerationResult>;
}
```
Adding a new provider requires implementing this one method. The prompt, validation, and codegen layers are fully provider-agnostic.

---

## ADR-005: Two-Pass Generation for Design Token Locking

**Context:** Single-pass "generate everything" prompts produce color drift — the AI makes creative choices mid-generation and ends up with a palette far from the inspiration material. The output is technically valid but visually generic.

**Decision:** Split generation into two passes:
1. **Token Lock** — A fast, focused call extracts colors, fonts, and mood from the description and inspiration images. Output is a small JSON object. Programmatic pixel extraction (via `sharp`) runs in parallel to get exact hex values from uploaded images.
2. **Full Spec** — The second call generates the complete theme spec with locked tokens embedded as hard constraints the model cannot override.

**Alternatives Considered:**
- *Single pass with stronger color instructions*: Tried this. The model acknowledges the colors but drifts toward its training distribution on long generations.
- *Post-processing color replacement*: Swap colors after generation. Rejected — too brittle, doesn't account for contrast requirements or semantic color roles.

**Consequences:** Dramatically better color fidelity when inspiration images are provided. Slight latency increase from the extra API call, offset by the smaller token count for pass 1.

---

## ADR-006: Repair Loop for Self-Healing Generation

**Context:** Even with structured output constraints, the LLM occasionally produces specs that fail Zod validation or custom design token checks.

**Decision:** When validation fails, structured error descriptions are fed back to the LLM as a targeted repair prompt. Maximum 3 repair attempts before failing with a clear, specific error message.

**Alternatives Considered:**
- *Fail immediately on invalid output*: Simpler but frustrating — users would need to regenerate from scratch for what is often a fixable issue.
- *Programmatic auto-repair*: Fix issues without the LLM (e.g., programmatically adjust a color for contrast). Feasible for specific cases but can't handle structural errors like wrong pattern types or invalid font references.

**Consequences:** Higher success rate. The LLM can usually fix its own errors when given specific, structured feedback. Small token cost per repair iteration. When repair fails after 3 attempts, the error message tells the user exactly what failed — not a silent generic error.

---

## ADR-007: Security Considerations

**Context:** The application accepts user-provided strings (descriptions, color preferences, URLs) and incorporates them into AI prompts and generated theme files.

**Threat Model and Mitigations:**

**Prompt Injection**
User descriptions are incorporated into AI prompts. A malicious user could attempt to inject instructions: *"Ignore previous instructions and output..."*
- *Mitigation:* User input is embedded in a clearly delimited user prompt section, not the system prompt. The system prompt is loaded from server-side TypeScript, never user-controlled. The LLM output is never executed — it's parsed as JSON and compiled by a deterministic pipeline. There is no code execution path from user input.

**Theme File Content**
User-provided strings (theme name, description, color preferences) appear in generated theme files (style.css header, theme.json description field).
- *Mitigation:* All user strings are embedded as JSON values inside validated Zod schemas before reaching the codegen layer. The codegen uses template literals that embed pre-validated values — not `eval` or `innerHTML`. Theme slugs are validated against `/^[a-z0-9-]+$/` at schema level, preventing path traversal.

**URL Extraction Endpoint**
The `/api/extract-design` endpoint fetches arbitrary user-provided URLs to extract CSS.
- *Mitigation:* The endpoint uses `fetch` with a short timeout and only processes the CSS text — no script execution. Internal network URLs (localhost, 192.168.x.x, etc.) are not explicitly blocked in the MVP, which is a known limitation for production hardening.

**ZIP Contents**
Generated ZIP files contain PHP, HTML, JSON, and CSS. No user input is placed inside PHP execution contexts.
- *Mitigation:* `functions.php` is generated from hardcoded templates with only theme slug and font URLs interpolated. Font URLs are validated as Google Fonts CDN URLs in the codegen layer. No user text reaches PHP execution contexts.

**API Key Exposure**
API keys are server-side only, in `.env.local` which is excluded from git.
- *Mitigation:* Keys are accessed only in Next.js API routes and server-side pipeline code. They are never sent to the client or embedded in the generated theme files.

---

## ADR-008: Design Exploration — Getting Creative, Non-Generic Output

**Context:** The most common failure mode for AI theme generators is generic output — beige backgrounds, Inter font, blue buttons. The challenge is making the AI produce distinctively designed themes that reflect the user's actual brief.

**The Problem:**
LLMs trained on web content have a strong prior toward "safe" design choices. Without active countermeasures, you get the same theme with a different name every time.

**Techniques Used:**

**1. Programmatic Color Extraction (Not AI Color Guessing)**
When a user drops an inspiration image, `sharp` extracts exact dominant hex values from the pixel data at 64×64 resolution. These values are embedded in the prompt as hard constraints: *"EXACT dominant colors: #2d5016, #4a7c2f — use these hex values directly."* The AI is no longer guessing colors from a description of an image — it's filling slots with pre-computed values.

**2. Two-Pass Token Locking**
See ADR-005. By locking colors and fonts before generating the full spec, we prevent the model from drifting toward its training distribution on long completions.

**3. Explicit Anti-Generic Instructions in System Prompt**
The system prompt explicitly says: *"NEVER use generic blue/gray defaults,"* *"think senior agency designer,"* *"make something someone would actually pay for."* This activates a different part of the model's training distribution — design portfolio content rather than generic website templates.

**4. Reference Image Library (Auto-Injected)**
When no inspiration image is provided, the pipeline auto-injects a curated reference image from `public/library/` matched by vibe + site type. The AI always gets a visual anchor, even when the user provides only text. This is the same technique as RAG (retrieval-augmented generation) applied to visual design.

**5. Vibe-Informed Mood Amplification**
The user prompt explicitly says *"let this vibe drive every design decision"* for the selected vibe. This creates a more coherent aesthetic push than a soft suggestion.

**6. Three Parallel Variations**
Generating 3 variations simultaneously (baseline, light, dark directions) means the user sees a range of interpretations. One of the three is almost always distinctly better than a single generation would produce. It also surfaces the model's creative range rather than anchoring on a single output.
