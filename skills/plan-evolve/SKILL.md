---
name: plan-evolve
description: >
  Evolve a target to its next version — treat what shipped as v1, plan the next iteration. The target can be a plan, a repo, a system, a document, a feature, or a skill. If a v1 plan artifact exists, evolve it; if not, the current state of the target IS v1. Trigger: 'what would v2 look like', 'evolve this', 'what's next for this', 'next iteration of this', 'plan the next version'. Use plan-deep-dive to inspect the current state, plan-execute to run the new plan, and plan-cleanup to remove artifacts after execution.
visibility: public
self-improvable: true
next-skills:
  - skill: plan-deep-dive
    phrase: "/deep-dive"
    why: "Inspect the new plan phase-by-phase before execution"
  - skill: insight-critique
    phrase: "/critique"
    why: "Get focused review of the proposed next-version plan"
  - skill: plan-execute
    phrase: "/plan-execute"
    why: "Execute the new plan once approved"
triggers:
  - "what would v2 look like"
  - "evolve this"
  - "what's next for this"
  - "next iteration of this"
  - "plan the next version"
---

# /plan-evolve

This is exactly what I wanted — can we evolve this to its next version? Treat what shipped as version 1, now plan version 2 — what would that be?

## Frame

Something shipped. It worked. Now the user wants the next version of it.

The **target** can be anything that has a current state:
- A plan (`PLAN.md` or a plan file)
- A repo, codebase, or system
- A document, spec, or skill
- A feature, product, or process

Version numbers are immaterial — "v1 → v2" is just shorthand for "what shipped → what's next."

## Find v1

Identify what counts as v1:
- A `PLAN.md` or plan file in the current directory or `.claude/plans/`
- A plan or target the user points you to
- **The current state of the target itself** — if no plan artifact exists, what is built / written / deployed today *is* v1

If no plan was provided, do not block and do not demand one — the current state of the target is the floor you evolve from. Only ask the user if the target itself is ambiguous.

## The work

V1 is the floor, not the ceiling. The next version means:
- What did v1 leave on the table?
- What would you do differently now that v1 exists?
- What new possibilities does v1 unlock that weren't visible before?
- Where did v1 make pragmatic compromises that the next version can resolve?

Don't re-plan from scratch. Evolve. V1's decisions are load-bearing until proven otherwise.

Output a next-version plan. If v1 was a plan, match its format — same structure, upgraded content. If v1 was a target with no plan, produce a plan in a clear phased format. Mark what's new, what changed, and what carries forward unchanged.

## Hard rules

- Never discard v1 — it shipped, it earned its place
- Don't version-up for the sake of it — every change needs a reason
- If v1 had phases or structure, keep it unless there's a strong reason to restructure
- Ask the user what they valued most about v1 and what felt incomplete — don't assume

## Downstream

Suggest the natural next command — these mirror the `next-skills:` front-matter:

- `/deep-dive` — inspect the new plan phase-by-phase
- `/critique` — focused review of the proposed v2 plan
- `/plan-execute` — execute once approved

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
