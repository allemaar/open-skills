---
name: plan-execute
description: Apply the last approved plan exactly. Trigger when the user runs /execute or says "execute the plan", "implement this", "do it", or "go ahead" after a plan has been approved. Surface judgment calls — do not make them silently. Not /plan-create (designs the plan first) or /plan-deep-dive (inspects a plan without running it) — plan-execute runs an already-approved plan.
disable-model-invocation: true
visibility: public
self-improvable: true
next-skills:
  - skill: verify
    phrase: "/verify"
    why: "Verify the change actually works by running it"
  - skill: insight-retro
    phrase: "/insight-retro"
    why: "Run a retrospective on the completed work"
  - skill: plan-cleanup
    phrase: "/plan-cleanup"
    why: "Remove planning artifacts now the plan is done"
triggers:
  - "/execute"
  - "execute the plan"
  - "implement this"
  - "do it"
  - "go ahead"
---

# /execute

Execute an approved plan with precision — follow the plan exactly, surface any judgment calls, declare completion explicitly.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Execution Protocol — no silent decisions, no silent drift.** The plan was already reviewed. Surface anything not specified. Declare when done.

## Valid Executable Plan

A plan is executable if it has all of the following:

- **Numbered steps** — each step is a discrete, concrete action (not prose intention)
- **Concrete actions** — each step names what to do, not what to achieve (e.g., "Edit `src/auth.ts` to add JWT validation" not "add authentication")
- **At least one verifiable outcome** — at least one step or verification entry that produces an observable, checkable result

If the plan does not meet this definition, the Phase 1 gate will reject it with the specific gap named.

## Phase 1 — Alignment

1. Load the approved plan using this priority order:
   - **Conversation context first** — if a plan was produced in this conversation, use it
   - Then `PLAN.md` in the project root
   - Then `implementation_plan.md` in the project root
   - If none found, see Gate below
2. Confirm execution mode: no planning, no exploring, no scope additions.

**Gate:**

- No plan found → run `/plan-create` first. Do not proceed.
- Plan found but does not meet the **Valid Executable Plan** definition → state the specific gap (e.g., "no numbered steps", "no verifiable outcome") and ask the user to revise or invoke `/plan-create`. Do not proceed.

## Phase 2 — Action

Execute each step from the plan **in order**. Track progress against the plan as you go.

**If drift is detected** — environment, codebase, or dependencies differ from what the plan assumed — **stop immediately**. Do not self-correct. Do not improvise. State the specific discrepancy:

> "Planned: [X]. Found: [Y]. Options: (1) I can proceed with [specific substitution] — confirm to approve this deviation. (2) We can revise the plan. Which do you prefer?"

If the user approves a deviation, document it inline: "Proceeding with [substitution] as approved deviation to plan step N" — then continue.

**If a judgment call is required** — any decision not explicitly named in the plan step — surface it before acting:

> "Step N requires a decision not specified in the plan: [decision]. Options: [A] / [B]. Which should I use?"

Do not make implicit decisions. Do not proceed past a judgment call without a user response.

## Phase 3 — Verification

Run the verification steps specified in the plan. Report:

- Which steps were completed
- What verification was run
- What the result was

**If no verification steps are specified in the plan:** ask the user to confirm outcomes explicitly — do not silently pass.

**Full gate suite before commit.** If the execution produced committable code, do not rely on the plan's named checks alone — run the project's defined gate suite (lint / test / typecheck — whatever the project declares; e.g. `turbo run lint test typecheck` where present) before the terminal declaration. This is a *deliberate pre-commit gate*, distinct from speculatively auto-running suites: invoke it as the closing verification of the work, not on every edit. **Map each plan step's intended outcome to the specific verification that exercised it**, and report the mapping — any unverified step or skipped gate is allowed but must be named explicitly, never silently passed. (If the project's CLAUDE.md restricts auto-running builds/tests, honor that: run only the gates the project sanctions, and name the rest as deferred.)

**Terminal declaration (required):** every execution ends with one of:

- `Execution complete — all steps verified.`
- `Execution failed — [specific reason].`
- `Execution halted — [specific reason]. Completed steps: [list].`

No execution ends without a terminal declaration.

## Rules

- MUST follow the plan exactly — no scope creep
- MUST stop and notify user when drift is detected — do not self-correct
- MUST surface all judgment calls to the user before acting
- MUST NOT add features or refactors not in the plan
- MUST report which steps were completed if execution halts mid-run
- MUST end every execution with a terminal declaration
- SHOULD run the project's defined gate suite (lint/test/typecheck) as a deliberate pre-commit gate when the work is committable code, map each plan step's outcome to its verification, and name any unverified step or skipped gate — never silently pass. Honor any project restriction on auto-running builds/tests.

## Next Steps

- `/verify` — verify alignment after execution
- `/plan-create` — revise the plan if execution surfaces scope gaps
- `/plan-cleanup` — remove planning artifacts after execution is complete

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
