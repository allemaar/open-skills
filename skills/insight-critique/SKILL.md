---
name: insight-critique
description: >
  Advisory review workflow. Reviews the last plan, code, architecture, or UI output and returns a structured report: Summary, Strengths, Risks, Fixes. Use when the user runs /critique, asks to "review this", "critique this", or "what's wrong with this", or wants focused feedback on a specific output. Also trigger as a quality gate before /execute. Advisory only; applicable controlling authority and safety rules still govern. For multi-POV adversarial stress-testing with personas, use /insight-adversarial instead.
caller-options:
  venue: [inline, delegated]
  default-policy: ask
visibility: public
self-improvable: true
next-skills:
  - skill: insight-adversarial
    phrase: "/insight-adversarial"
    why: "Stress-test the work from multiple adversarial POVs"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Redesign if the verdict is Not Approved"
triggers:
  - "/critique"
  - "review this"
  - "critique this"
  - "what's wrong with this"
---

# /critique

Advisory review of the last plan, code, architecture, or UI output. Runs four analysis passes and emits a structured report. Advisory only; applicable controlling authority and safety rules still govern.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller. A resolved-invocation marker means COP already ran — execute the fixed combination directly, do not re-enter COP.

## Phase 1 — Classify

Identify what is being critiqued. Pick exactly one: `Code`, `Plan`, `Architecture`, `UI`. If the subject is ambiguous, ask for clarification before proceeding.

## Phase 2 — Analysis

Run all four passes. Passes 1–3 are independent. Pass 4 depends on Risks.

1. **Summary** — what is this? State purpose, scope, and approach concisely.
2. **Strengths** — what is well-designed, sound, or admirable? Be specific. Do not pad.
3. **Risks** — what is fragile, dangerous, underspecified, or likely to fail? Rank by severity: **High** / **Medium** / **Low**.
4. **Fixes** — for each risk, propose a concrete actionable change. Distinguish **must-fix** from **nice-to-fix**.

## Phase 3 — Render Report

Output a structured report with four labeled sections: Summary, Strengths, Risks, Fixes. Then set a verdict:

- ✅ **Approved** — all risks are Low or cosmetic
- ⚠️ **Conditional** — risks present but fixable; propose targeted fixes; offer `/plan-execute` only against a relevant approved executable plan
- 🚫 **Not Approved** — High risks present; `/plan-create` or a redesign is required

## Constraints

- Advisory only. Critique does not override applicable controlling authority or safety rules.
- Never mark Approved when any risk is rated Medium or above.
- Do not pad Strengths to soften the critique. If there are few strengths, say so.

## Downstream

Suggest the natural next command — these mirror the `next-skills:` front-matter:

- `/insight-adversarial` — stress-test the critiqued work from multiple POVs
- `/plan-create` — if the verdict is 🚫 Not Approved and a redesign is needed
- `/plan-execute` — only for a relevant approved executable plan after an Approved or Conditional verdict. Offer /plan-execute only when a relevant approved executable plan exists. Otherwise offer a scoped authorized repair or the appropriate planning owner; a critique verdict does not create execution approval.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): apply its signal taxonomy and threshold to this run; surface any surviving proposal for handler approval. Conservative — silent otherwise. Never auto-apply.
