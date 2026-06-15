---
name: design-an-interface
description: Generate multiple radically different interface designs for a module, then compare and synthesize. Use when the user wants to design an API, explore interface options, compare module shapes, or says "design it twice" / "give me options" / "what should this interface look like". Also trigger proactively when a user is about to implement something non-trivial and hasn't locked in an interface yet. Not /insight-explore (brainstorms approaches as prose) or /plan-create (turns a chosen design into a phased plan) — this produces concrete, comparable interface designs.
visibility: public
self-improvable: true
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the chosen interface design into a phased plan"
  - skill: improve-codebase-architecture
    phrase: "/improve-codebase-architecture"
    why: "Find refactors that deepen the modules behind the interface"
triggers:
  - "/design-an-interface"
  - "design an API"
  - "explore interface options"
  - "compare module shapes"
  - "design it twice"
  - "give me options"
  - "what should this interface look like"
---

# /design-an-interface

From "Design It Twice" (Ousterhout): your first idea is rarely the best. The value is in contrast — not in any single design.

## Step 1 — Gather Requirements

Shallow intake produces shallow designs. Ask these specifically — not just "what does it do?":

1. What is the one-sentence job of this module?
2. Who are the callers? (other modules, end users, tests, CLI, external systems)
3. Walk me through the happy path in code — what does the call site actually look like?
4. What are the failure modes? What can go wrong, and who handles it?
5. What must the interface hide? What should callers never need to know about?
6. Any hard constraints? (performance, compatibility with existing patterns, language idioms)
7. Is there a "most common case" that should be especially ergonomic?

Don't proceed until you have real answers. One vague sentence is not enough.

## Step 2 — Generate Designs

If you have a Task tool: spawn all three designs simultaneously. Each agent gets the requirements plus its assigned lens and must produce a design that would surprise the others. Brief them to actively resist the obvious answer.

If you don't have Task: run them sequentially, but commit fully to each design before moving to the next. Don't let later designs learn from earlier ones — write each as if it were your only attempt.

**Produce 3 radically different designs.** Radically different means different information hiding boundaries — not just different method names or parameter orders. Three designs that all accept a config struct and return a result are not radically different, even if the method names differ.

Use these lenses to force divergence:

| Design | Constraint | Core question |
|--------|-----------|---------------|
| Minimal | 1–3 operations max | What is the smallest surface that covers all cases? |
| Caller-empowering | Expose primitives; let caller compose | What if we trust the caller with more control? |
| Common-case-first | Optimize the happy path to one line | What if the 95% case has zero friction, even if edge cases are awkward? |

Add a 4th for domain-specific shapes (event-driven, streaming, builder, type-state) when relevant.

For each design, produce:

- **Interface** — concrete method signatures, types, function signatures. Not schematic.
- **Usage example** — real call-site code for: happy path, error case, one awkward case.
- **What this hides** — complexity that lives inside, invisible to callers.
- **What this exposes** — decisions or knowledge pushed onto the caller.
- **Where it shines / breaks down** — 1–3 honest sentences.

## Step 3 — Compare

Fill this table, then write prose.

| Dimension | Design 1 | Design 2 | Design 3 |
|-----------|----------|----------|----------|
| # of operations | | | |
| Caller knowledge required | low/med/high | | |
| Error handling location | inside / outside | | |
| Composability | y/n | | |
| Fits most common case | | | |

The table shows **what**. The prose explains **why it matters**. Go deep on where the designs diverge most — depth, misuse resistance, evolution over time, and the awkward case each design can't handle cleanly. Don't soften it. Say which designs have real problems.

Apply the Evaluation Criteria from the Reference section below.

## Step 4 — Synthesize

This is the highest-value output. Produce something concrete:

1. State your recommendation and why, referencing the comparison.
2. Write the synthesized design — concrete signatures, not description. If one design wins outright, restate it as a clean spec. If the answer is "take X's shape, borrow Y's error handling, add Z's escape hatch," write that out.
3. Name **the one thing to get right** — the decision that, if wrong, causes the most pain later.

Close by asking: "Does this fit your primary use case? Anything from the other designs worth keeping?"

---

## Reference

Use these during Step 3. Don't apply them during generation.

### Evaluation Criteria (APOSD)

- **Interface simplicity** — fewer methods, simpler params → easier to learn, harder to misuse.
- **Depth** — small interface hiding large complexity = deep module (good). Large interface over thin implementation = shallow module (avoid).
- **General-purpose vs. specialized** — can it handle adjacent use cases without changes? Beware over-generalization, but also beware interfaces that lock in today's assumptions.
- **Implementation efficiency** — does the interface allow an efficient implementation, or force awkward internals?
- **Ease of correct use** — the best interfaces make the right thing the natural thing.

### Anti-Patterns

- **Convergent designs** — if all three designs are the same module with different names, you've failed. Start over with harder constraints.
- **Skipping comparison** — generating without comparing is just brainstorming. The value is in the contrast.
- **Implementing** — this skill is about interface shape. Don't write internals.
- **Premature synthesis** — don't merge designs during generation. Let them stay fully different until Step 4.
- **Vague trade-offs** — "more flexible" means nothing. More flexible how, for whom, at what cost?

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
