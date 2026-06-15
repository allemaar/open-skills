---
name: insight-explore
description: >
  Brainstorm 3+ possible implementations before committing. Trigger when the user runs /explore or asks to "brainstorm options", "what are the ways to do this", "explore approaches", "give me alternatives", or wants divergent thinking before planning or assessment. Use insight-assess to evaluate known options, insight-critique to review an existing output, and plan-create to turn a chosen direction into an implementation plan.
visibility: public
self-improvable: true
next-skills:
  - skill: insight-assess
    phrase: "/insight-assess"
    why: "Evaluate the options you just generated and pick one"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn a chosen option into a phased plan"
triggers:
  - "/explore"
  - "brainstorm options"
  - "what are the ways to do this"
  - "explore approaches"
  - "give me alternatives"
---

# /explore

Divergent thinking — generate 3+ implementation options, then converge on a recommendation. Produces options, not plans.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Brainstorming Protocol — explore before committing.** `/explore` generates alternatives (divergent). `/assess` evaluates them (convergent). `/plan-create` designs the chosen approach.

## Phase 1 — Divergence

1. **Analyze constraints** — what are we optimizing for? What are the hard requirements vs. preferences?
2. **Option A: The Standard Pattern** — the obvious, well-trodden approach. What would most engineers reach for first?
3. **Option B: The Performance Way** — optimized for speed, scale, or efficiency. Possibly more complex.
4. **Option C: The Minimalist** — YAGNI. Smallest footprint that still solves the problem.

Additional options may be added if the problem space warrants them (e.g., event-driven, type-safe, or zero-dependency variants).

## Phase 2 — Convergence

Compare all options across:

- **DX** — developer experience, API ergonomics, debuggability
- **Robustness** — error handling, edge case coverage, failure modes
- **Timeline fit** — how long does each take to implement and validate?
- **Alignment** — does it match existing patterns and coding standards in the repo?

## Phase 3 — Recommendation

Output:

- **Winner** — which option and why
- **Reason** — 1–2 sentences, referencing the comparison
- **Next step** — ask the user: *"Shall I `/plan-create` this?"*

## Rules

- MUST generate at least 2 distinct options (3 is the target).
- MUST NOT write code or make changes — this is ideation only.

## Next Steps

- `/assess` — evaluate the winner in depth before committing
- `/plan-create` — design the chosen approach

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
