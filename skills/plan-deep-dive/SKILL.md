---
name: plan-deep-dive
description: >
  Phase-by-phase deep inspection of any multi-phase plan — stop at each phase and assess completeness, quality, and future-readiness before advancing. Trigger when the user runs /deep-dive or asks to "do a deep dive", "inspect each phase", "look at this more carefully", or "check if we're missing anything" on an existing plan. Use plan-create to create a new plan, plan-execute to run an approved plan, and plan-phases to add gates to a plan.
visibility: public
self-improvable: true
caller-options:
  venue: [inline, delegated]
  default-policy: ask
next-skills:
  - skill: plan-execute
    phrase: "/plan-execute"
    why: "Proceed to execution if all phases pass"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Redesign if any phase verdict is RETHINK"
  - skill: prime-sweep
    phrase: "/prime-sweep"
    why: "When a phase under deep-dive touches a large unread source surface — prime via delegation before inspecting"
triggers:
  - "/deep-dive"
  - "do a deep dive"
  - "inspect each phase"
  - "look at this more carefully"
  - "check if we're missing anything"
---

# /deep-dive

Phase-by-phase deep inspection of any multi-phase plan. Stop at each phase, assess completeness, quality, and future-readiness before moving on.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options. For very long plans, `delegated` keeps the main context clean while a sub-agent walks the phases and returns the verdict log.

> **Iterative Depth Protocol.** `/plan-create` produces the plan. `/deep-dive` pressure-tests it phase by phase. Never batch or skip phases — the value is in the forced stops.

## When to escalate to plan-create

If phase-by-phase inspection surfaces gaps that would require redesigning the plan rather than tweaking it (missing phase, wrong sequencing, fundamental approach issue), stop the deep-dive and recommend `/plan-create` to redesign.

## Phase 1 — Load & Enumerate

Identify the active plan. Load `implementation_plan.md`, `PLAN.md`, or the current multi-phase artifact (e.g. a multi-phase plan presented inline in the conversation, or a plan document at any path the user has referenced). Extract the ordered list of phases.

**Verification step:** before entering Phase 2, present the loaded artifact's title and first substantive line to the user and ask: "Is this the correct and current plan?" Do not proceed until confirmed.

**Gate:** no phases found → cannot proceed.

## Phase 2 — Iterative Phase Drill-Down

For **each phase**, execute the full drill-down loop below. **Do NOT advance until the current phase passes all checks.**

**Running verdict log:** maintain a verdict table updated after each Step 5. This log is cited verbatim in Phase 3 — do not reconstruct from memory.

```
| Phase | Verdict | Key Findings | Amendments Applied |
|-------|---------|-------------|-------------------|
```

### Step 1 — Read the Phase

Read the current phase in full. Summarize scope, deliverables, and dependencies.

### Step 2 — Gap Assessment: Are we MISSING anything?

Check for: omitted edge cases, unstated assumptions, undeclared dependencies, missing error handling, missing validation, incomplete coverage.

**Minimum bar:** at least one named gap, or explicitly state "No gaps found — [reason]." A blank or "looks good" is not acceptable.

### Step 3 — Quality Assessment: Can we do it BETTER?

Check for: simpler approaches, performance gains, better abstractions, reduced scope creep, alignment with existing patterns and skills, DRY violations, naming drift.

**Minimum bar:** at least one named quality issue, or explicitly state "No quality issues found — [reason]."

### Step 4 — Future Assessment: Is this FUTURE-READY?

Check for: extensibility, breaking change risk, forward compatibility, scalability bottlenecks, tech debt introduced, migration paths needed later.

Consider **3-month** and **6-month** horizons explicitly. Example prompts: "What breaks if this phase's output format changes in 3 months?" / "What would need to be re-done if the team doubles in 6 months?"

**Minimum bar:** at least one named future risk, or explicitly state "No future risks found — [reason]."

### Step 5 — Phase Verdict — Present

Synthesize findings into a verdict. **Present the verdict and all findings to the user. Do not apply amendments yet.**

- **PASS** — no significant gaps, quality issues, or future risks found
- **AMEND** — gaps or improvements found; plan can proceed after targeted fixes
- **RETHINK** — stop and redesign before proceeding. Triggered when **any** of:
  - The phase's primary deliverable is undefined or cannot be stated concretely
  - The phase has an undeclared dependency on work not yet planned or completed
  - The phase's approach directly contradicts a constraint or goal stated in the plan

Update the running verdict log with this phase's result.

### Step 6 — User Gate + Apply Amendments

Present the phase verdict and findings summary. The user must **acknowledge at least one specific finding by name** before the gate passes — a blanket "yes" or "proceed" is not sufficient. If the verdict is PASS with no findings, the user must confirm "no findings noted."

After user approval: apply any amendments to the plan artifact. Then loop back to Phase 2, Step 1 for the next phase.

## Phase 3 — Synthesis

After all phases pass, produce a consolidated deep-dive report. Cite per-phase verdicts directly from the running verdict log — do not reconstruct from memory.

- **Per-phase verdicts** — copied from the running verdict log
- **Total amendments made** — count and list
- **Residual risks** — findings not resolved by amendments
- **Future considerations** — 3-month/6-month items surfaced during Step 4 passes
- **Overall confidence score** — 1–10, where 10 = all phases PASS with zero findings, 1 = multiple RETHINK with unresolved issues. State the score and the primary reason it is not higher.

**Verdict examples:**

- *AMEND example:* "Phase 3 AMEND — missing rollback step identified; added explicit rollback instruction to the phase before advancing."
- *RETHINK example:* "Phase 2 RETHINK — primary deliverable (the API schema) was undefined; could not assess completeness. Returned to `/plan-create` to define it before re-running."

## Rules

- MUST stop at each phase — never batch or skip
- MUST propose concrete fixes when finding gaps — not vague observations
- MUST consider 3-month and 6-month horizons when assessing future
- MUST apply amendments to the plan artifact only after user approval in Step 6 — never before
- MUST NOT output "LGTM" without substantive analysis
- SHOULD check sibling skills for established patterns when referencing existing work

## Downstream

Suggest the natural next command — these mirror the `next-skills:` front-matter:

- `/plan-execute` — if all phases PASS
- `/plan-create` — if RETHINK on any phase

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
