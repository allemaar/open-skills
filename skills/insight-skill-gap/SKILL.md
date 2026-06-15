---
name: insight-skill-gap
description: >
  Scan recent work and identify if new skills should be created or existing ones updated. Trigger when the user runs /skill-gap, asks to "check for skill gaps", "what skills should we add", "did we miss anything worth capturing", or after /retro flags patterns worth codifying. Use insight-retro for a broader post-implementation retrospective.
visibility: public
self-improvable: true
next-skills:
  - skill: new-skill-creator
    phrase: "/new-skill-creator"
    why: "Scaffold the new skill the gap analysis identified"
triggers:
  - "/skill-gap"
  - "check for skill gaps"
  - "what skills should we add"
  - "did we miss anything worth capturing"
---

# /skill-gap

Identify gaps in the skill library based on recent implementation work — propose new skills or updates to existing ones.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Skill Discovery Protocol — ensures reusable patterns don't stay buried in implementation code.**

## Phase 1 — Recent Work Scan

1. **Gather recent context** — conversation history, changed files, new patterns introduced. Summarize: what was built, which libraries/frameworks were used, what novel patterns emerged.
2. **Load skill index** — read the current skill index to know what already exists before analyzing gaps.

## Phase 2 — Gap Analysis

Cross-reference patterns from Phase 1 against the skill index. Classify each pattern:

- **(A) Skill exists and covers it** — no action
- **(B) Skill exists but is incomplete** — propose update; specify which sections are missing or outdated
- **(C) No skill exists** — evaluate against new-skill criteria below

**Criteria for a new skill:**

- Pattern is reusable (used 2+ times, or clearly will be)
- Pattern involves non-obvious decisions or gotchas
- Pattern spans multiple files or concepts

**Gate:** gap analysis must be documented before proceeding.

## Phase 3 — Skill Proposals

For each gap, draft a skill specification:

- **Skill name** — domain-prefix convention (e.g., `drizzle-*`, `nextjs16-*`)
- **Skill family** — domain prefix
- **Prerequisites** — what the user needs to know first
- **Complexity estimate** — how large/involved the skill content will be
- **Key sections to cover** — what the skill should teach

Check `new-skill-creator` for template requirements before drafting. Present proposals to the user and wait for approval before proceeding.

## Phase 4 — Execution (only if approved)

Create approved skills via `/new-skill-creator`. For updates, apply targeted edits to the relevant sections.

## Rules

- MUST verify no existing skill covers the same domain before proposing a new one.
- MUST follow the domain-prefix naming convention.
- MUST specify which sections are missing or outdated when proposing updates.
- MUST check `new-skill-creator` for template requirements before proposing new skills.
- MUST NOT propose skills for one-off patterns with no reuse potential.
- SHOULD recommend immediate creation (not deferral) when reuse potential is HIGH.

## Next Steps

- `/new-skill-creator` — to build approved skills

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
