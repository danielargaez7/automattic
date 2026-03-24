# Architectural Decision Records

## ADR-001: Deterministic Pipeline Over Direct LLM File Generation

**Context:** The core challenge is generating syntactically correct WordPress block markup (HTML comments with serialized JSON attributes). LLMs frequently produce malformed block syntax when asked to generate raw theme files.

**Decision:** The LLM generates a structured Theme Spec JSON — not raw WordPress files. A deterministic TypeScript pipeline compiles the spec into theme files.

**Alternatives Considered:**
- *Direct file generation*: Have the LLM output each file (theme.json, templates, patterns) directly. Rejected because block markup syntax errors are extremely common in raw LLM output, and validation of free-form HTML is much harder than validation of structured JSON.
- *Hybrid approach*: LLM generates theme.json directly but uses templates for block markup. Rejected because even theme.json generation has edge cases the LLM gets wrong.

**Consequences:** Higher reliability (95%+ valid output), testable pipeline, but less creative freedom in block-level layout decisions. The codegen layer's pattern library is the limiting factor on visual variety.

---

## ADR-002: Theme Spec as Intermediate Representation

**Context:** We need a typed, validated contract between the AI's creative decisions and the mechanical output of WordPress files.

**Decision:** A Zod-validated JSON schema (ThemeSpec) captures all creative decisions: colors, typography, spacing, layout, pattern selection, and header/footer configuration. The codegen layer consumes this spec deterministically.

**Alternatives Considered:**
- *Generate theme.json directly*: Conflates design intent with WordPress schema compliance. The LLM would need to understand both creative design AND the exact WordPress theme.json v3 specification.
- *Flat key-value config*: Simpler but couldn't express the relationships between design tokens, template composition, and pattern selection.

**Consequences:** Clean separation of concerns. Creative decisions are validated independently from mechanical correctness. The spec also serves as a documentation artifact for the generated theme.

---

## ADR-003: Pattern Template Composition Over Raw Markup Generation

**Context:** WordPress block patterns require precise HTML comment syntax with serialized JSON attributes. Even small syntax errors break block parsing.

**Decision:** Block patterns are assembled from pre-written, pre-validated TypeScript template functions populated with design tokens from the Theme Spec. The LLM selects which patterns to use; the codegen produces the markup.

**Alternatives Considered:**
- *Full LLM-generated patterns*: Maximum creative freedom but highest failure rate. Block markup syntax is fragile.
- *JSON-to-markup mapping with LLM-generated JSON per pattern*: Middle ground, but adds complexity without proportional reliability gain.

**Consequences:** 100% syntactically correct block markup. The trade-off is a fixed pattern vocabulary (20 types). New visual variety requires adding new pattern templates to the codegen library.

---

## ADR-004: Anthropic Claude as Primary Provider

**Context:** The brief allows any AI provider. We need strong structured JSON output, good instruction following, and reasonable cost.

**Decision:** Anthropic Claude Sonnet as the primary provider, with a provider adapter interface that makes swapping trivial.

**Alternatives Considered:**
- *OpenAI GPT-4o*: Strong alternative, good JSON mode. Could be added as a fallback via the same adapter interface.
- *Local models*: Lower cost, no API dependency, but significantly worse at structured output and design creativity.

**Consequences:** Clean provider abstraction (`ThemeGenerationProvider` interface). Adding a new provider requires implementing one method: `generateThemeSpec(input) → ThemeSpec`. The prompt and validation layers are provider-agnostic.

---

## ADR-005: WordPress Playground for Preview (Future)

**Context:** Users need to see what their theme looks like before downloading.

**Decision:** Architecture supports WordPress Playground iframe embedding for live preview. Not implemented in MVP but the ZIP output is designed to be loadable directly into Playground.

**Alternatives Considered:**
- *Static HTML mockup*: Faster to implement but would diverge from actual WordPress rendering, creating false expectations.
- *Custom block renderer*: Would require reimplementing WordPress's rendering engine in JavaScript — enormous scope.

**Consequences:** Preview fidelity matches real WordPress exactly. The trade-off is dependency on the WordPress Playground project for the preview feature.

---

## ADR-006: Repair Loop for Self-Healing Generation

**Context:** Even with structured output constraints, the LLM occasionally produces specs that fail validation (wrong contrast ratios, invalid pattern references, etc.).

**Decision:** When validation fails, structured error descriptions are fed back to the LLM as a repair prompt. Maximum 3 repair attempts before failing with a clear error.

**Alternatives Considered:**
- *Fail immediately*: Simpler but frustrating for users — they'd need to regenerate from scratch.
- *Auto-repair without LLM*: Programmatically fix issues (e.g., adjust colors for contrast). Feasible for some errors but not for structural issues like wrong pattern types.

**Consequences:** Higher success rate (the LLM can usually fix its own errors when told specifically what's wrong). Small latency cost for repair iterations. Clear error messages when repair fails.
