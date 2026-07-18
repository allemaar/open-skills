---
name: insight-assess
description: >
  Structured decision evaluation — pros/cons, impact assessment, quality analysis, recommendation. Trigger when the user runs /assess or asks for evaluation, comparison, or impact analysis of an approach, decision, option, or implementation. Use insight-explore for divergent option generation, insight-critique for focused output review, and insight-adversarial for multi-POV stress testing.
visibility: public
self-improvable: true
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the recommended option into a phased plan (if the verdict is PROCEED)"
  - skill: insight-explore
    phrase: "/insight-explore"
    why: "Generate more options if none of the assessed ones fit"
  - skill: insight-critique
    phrase: "/insight-critique"
    why: "Get a deeper review of a specific output before deciding"
  - skill: prime-expand
    phrase: "/prime-expand"
    why: "When the decision target is vague — clarify intent (concrete question + named sources) before evaluating options"
triggers:
  - "/assess"
  - "/insight-assess"
---

# /assess

Structured evaluation of an approach, decision, or implementation — assess viability across multiple dimensions and deliver a clear recommendation.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Decision Support Protocol — convergent evaluation.** `/explore` generates alternatives (divergent). `/assess` evaluates them (convergent). `/critique` reviews outputs (reactive). Three complementary tools.

## Phase 1 — Frame the Decision

Identify what is being assessed: a specific approach, a decision between options, an implementation pattern, or an architectural direction.

Load relevant context — files, docs, KIs, skills. Define what we are optimizing for and the constraints.

**Gate:** cannot assess without a clear subject. If the decision cannot be framed, ask for clarification before proceeding.

## Phase 2 — Dimensional Analysis

Evaluate across all relevant dimensions. Skip dimensions that don't apply.

**Pros & cons** — concrete advantages and disadvantages. Cite actual code, dependencies, or patterns. No vague generalizations. If comparing multiple options, do side-by-side.

**Quality assessment** — score `STRONG` / `ADEQUATE` / `WEAK` with justification on:

- **Performance** — bundle size, runtime overhead, N+1 queries, render cycles
- **Code quality** — DRY violations, coupling, testability, readability
- **Developer experience** — API ergonomics, debugging ease, onboarding friction
- **Maintainability** — upgrade path, community support, lock-in risk

**Impact assessment** — map and classify overall impact `LOW` / `MEDIUM` / `HIGH`:

- **Blast radius** — packages/apps/files
- **Migration effort** — if replacing something
- **Breaking changes** — if any
- **Learning curve** — for the team
- **Future flexibility** — does this open or close doors?

## Phase 3 — Alignment Check

- Does this align with repo coding standards?
- Does it follow existing patterns, or introduce a new one?
- If new, is it justified?
- Check relevant skills and KIs for prior art.

## Phase 4 — Recommendation

Structure:

- **VERDICT** — one of: `PROCEED` / `PROCEED WITH CAVEATS` / `RECONSIDER` / `REJECT`
- **RATIONALE** — 1–2 sentences
- **CONDITIONS** — if `PROCEED WITH CAVEATS`: what must be addressed
- **ALTERNATIVES** — if `RECONSIDER` / `REJECT`: what to do instead

**Gate:** assessment is incomplete without a recommendation delivered to the user.

## Rules

- MUST be concrete and specific when listing pros/cons — cite actual code, libraries, or patterns.
- MUST check performance, DX, and maintainability — not just correctness.
- MUST use consistent dimensions across all options when comparing.
- MUST NOT make changes, write code, or execute — evaluation only.
- MUST NOT hedge without a clear verdict — always commit to a recommendation.
- SHOULD note caveats or conditions even if minor when recommending PROCEED.
- SHOULD suggest concrete alternatives when recommending RECONSIDER.

## Next Steps

- `/plan-create` — if verdict is PROCEED
- `/explore` — if more options are needed before deciding
- `/critique` — if a deeper review of specific output is needed

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
