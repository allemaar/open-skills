---
name: plan-phases
description: >
  Restructure an existing plan into phases with /verify gates after each phase and critical steps. Trigger when the user runs /phase-plan or asks to "add phases to this plan", "gate this plan", "restructure the plan", or "add checkpoints". Use plan-create for new plans and plan-deep-dive for inspection without restructuring.
visibility: public
self-improvable: true
next-skills:
  - skill: plan-execute
    phrase: "/plan-execute"
    why: "Run the now-phased plan"
  - skill: plan-deep-dive
    phrase: "/plan-deep-dive"
    why: "Inspect the phased plan before running it"
triggers:
  - "/phase-plan"
  - "add phases to this plan"
  - "gate this plan"
  - "restructure the plan"
  - "add checkpoints"
---

# /phase-plan

Take an existing flat or unstructured plan and restructure it into phased execution with `/verify` gates after each phase and critical steps.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Plan Restructuring Protocol — transforms any plan into a gated, phased structure for structural legibility and explicit checkpointing.** Restructure, never delete. All original content is preserved.

## What is `/verify`?

`/verify` is a verification gate — a point where execution stops and the current state is validated before proceeding. When you encounter a `/verify` gate in a restructured plan:

1. Review what the gate specifies
2. Verify each condition is met
3. Only continue to the next phase/step once the gate passes

If `/verify` is not a recognized command in your session, replace it with an explicit user confirmation prompt: pause, state what you're verifying, and wait for the user to confirm before continuing.

## Phase 1 — Locate & Load Existing Plan

1. **Find the plan** — check `implementation_plan.md`, `PLAN.md`, `task.md`, recent conversation context, or user-provided file. Load the full content. If multiple candidates exist, use the most recently modified file and note the choice.
2. **Assess structure** — flat (single list)? Partially phased? Missing verification steps? Identify structural gaps.

**If no plan is found** after checking all locations → stop. Ask the user to provide the plan before continuing.

## Phase 2 — Decompose Into Phases

1. **Identify natural phase boundaries** — group related steps by dependency order, component, or concern. Each phase must be independently verifiable. Mark critical steps that need individual `/verify` gates.
2. **Define phases** — each phase needs:
   - Clear name
   - Goal / deliverable
   - Ordered steps
   - Success criteria

Ensure phases flow logically — dependencies before dependents.

## Phase 3 — Insert Check Gates

1. **Phase-level gates** — insert a `/verify` gate **after every phase**. Gate focus must be specific to what that phase accomplished and what the next phase depends on.
2. **Critical step gates** — identify steps within phases that warrant individual `/verify` gates:
   - Risky operations
   - Breaking changes
   - Schema migrations
   - Cross-package impacts
   - Security-sensitive changes

   Insert inline `/verify` gates immediately after those steps.

### Gate Quality Reference

A gate must validate something observable. If it can't fail, it's ceremonial.

| | Example |
|-|---------|
| **Good gate** | `/verify` — migration applied: `users.email` column is non-null, existing rows have values, no FK errors in test suite |
| **Bad gate** | `/verify` — make sure the migration looks right |

The bad gate has no observable condition. The good gate has three specific pass/fail criteria a different person could verify independently.

### Gate Placement Rules

- MUST insert a `/verify` gate after completing any phase
- MUST insert an inline `/verify` gate after any schema migration, breaking change, or security-sensitive step
- MUST insert an inline `/verify` gate after any step with cross-package impact
- SHOULD split phases with >5 steps into sub-phases with intermediate `/verify` gates

## Phase 4 — Rewrite & Output

1. **Rewrite the plan** — in its original format (`implementation_plan.md`, `PLAN.md`, or `task.md`) with the new phased structure. Preserve all original content — restructure, do not delete. Each phase should clearly show: steps, `/verify` gate, and what the gate validates. **If the plan has no source file** (existed only in conversation context), output the full restructured plan as a fenced code block in the response instead.
2. **Diff report** — summarize what changed: how many phases created, how many `/verify` gates added, any steps reordered or split.

## Rules

- MUST preserve ALL original plan content — restructure, never delete
- MUST maintain original intent and goal alignment
- MUST use the same file format as the original plan
- MUST NOT add new scope or features not in the original plan
- MUST NOT create ceremonial `/verify` gates with vague focus

## Next Steps

- `/plan-execute` — implement the newly phased plan
- `/double-check` — verify the restructured plan before executing

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
