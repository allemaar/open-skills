---
name: insight-retro
description: >
  Post-implementation retrospective — map blast radius, audit documentation, extract skills, update KIs, document lessons learned. Trigger when the user runs /retro or asks for a "retrospective", "post-mortem", "lessons learned", or "what changed" after completing significant implementation work. Use insight-skill-gap when the goal is specifically to identify new or updated skills.
visibility: public
self-improvable: true
next-skills:
  - skill: insight-skill-gap
    phrase: "/insight-skill-gap"
    why: "Codify recurring patterns into new or updated skills"
  - skill: human-draw
    phrase: "/human-draw"
    why: "Blast radius is proportional and positional — how far the change reached shows in a figure, not in a list of touched files"
triggers:
  - "/retro"
  - "retrospective"
  - "post-mortem"
  - "lessons learned"
  - "what changed"
---

# /retro

Structured reflection after completing large implementations — map what changed, verify documentation accuracy, capture reusable patterns, update knowledge, and flag follow-up work.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Reflection Protocol — run after shipping significant work.** Prevents knowledge loss, documentation drift, and tech debt accumulation. Observation only — fixes are separate tasks.

## Phase 1 — Blast Radius Mapping

Identify everything that changed during execution. Sources: `implementation_plan.md`, `walkthrough.md`, `task.md`, conversation history, git diff.

Produce a structured manifest:

- Packages touched
- Apps touched
- Files created / modified / deleted
- New exports or APIs introduced

Group changes by package/app. This map drives every subsequent phase.

**Gate:** cannot proceed without knowing what changed.

## Phase 2 — Pattern Extraction

Identify reusable patterns that emerged. Check for: new architectural patterns used in 2+ places; workarounds or gotchas future work will hit; integration patterns between packages not yet documented; novel solutions worth codifying.

For each pattern: **name**, **description**, **reuse potential** (HIGH / MEDIUM / LOW), **recommended action** (new skill, update existing skill, document in KI, or skip).

## Phase 3 — Documentation Audit

For each package/app in the blast radius, audit all documentation surfaces.

**Discovery:** find `README.md`, `llms.txt`, `index.yon`, `*.yon`, `*.feature.yon`, `CHANGELOG.md`, barrel exports (`index.ts`).

- **For docs/skills repositories:** also check `SKILL.md` files (description quality, runtime parity), cross-reference maps between skills, per-skill front-matter consistency. Consider a full library-audit pass.

**Sidecar audit:** for each significant changed file (>100 LOC, public API, component/hook/route handler/schema) — does a colocated `.yon` exist? Still accurate? Should one be created?

- New directories with >3 significant files → flag missing `index.yon`
- Cross-file features touching >2 related files → flag missing `*.feature.yon`

**README accuracy:** verify prose against current code — described APIs still accurate? New features documented? Removed features still mentioned?

Report by severity:

- **MISLEADING** — docs say X, code does Y (cite both the doc claim and contradicting code)
- **STALE** — docs describe removed features
- **MISSING** — new features/files undocumented
- **ACCURATE** — no action

## Phase 4 — Knowledge & Skill Assessment

**Knowledge Items:** cross-reference changes against existing KI summaries. Report KIs to update (with what changed), KIs to create (with proposed scope), KIs still accurate (no action).

**Skills:** load skill-index. Cross-reference patterns, libraries, and techniques against existing skills:

- (A) Skill exists and covers it — no action
- (B) Skill exists but is incomplete — specify what's missing or outdated
- (C) No skill exists — evaluate reuse potential (2+ uses, non-obvious decisions, multi-file scope). If warranted, propose: skill name, domain family, key sections, complexity estimate

Verify no existing skill covers the domain via skill-search first — never propose a duplicate.

## Phase 5 — Difficulty Analysis

Reflect on execution difficulty. For each: what was harder than expected, what assumptions proved wrong, what took multiple attempts, what external blockers were hit. For each: root cause, resolution, prevention.

## Phase 6 — Tech Debt Inventory

Inventory tech debt introduced or discovered: shortcuts taken, TODO/FIXME/HACK comments added, deferred limitations, test coverage gaps, sidecar coverage gaps. For each: **severity** (LOW/MEDIUM/HIGH), **estimated effort**, **recommended timeline**.

## Phase 7 — Retrospective Report

Compile the full report:

1. **Blast Radius Summary**
2. **Patterns Extracted** — with recommended actions
3. **Documentation Audit** — gaps, stale sidecars, README accuracy (MUST-DO vs SHOULD-DO)
4. **Knowledge & Skill Updates** — KIs and skills to update/create
5. **Difficulty Log**
6. **Tech Debt Inventory**
7. **Gate Status** — for committed work: the project gate-suite outcome (`pass` / `fail` / `skipped — why`) and any acceptance criterion left unverified. Name skipped gates and unverified criteria explicitly; a clean-looking retro that omits a coverage hole misrepresents what actually shipped.

Present with actionable next steps.

## Rules

- MUST check skill-index first when finding reusable patterns — avoid proposing duplicates
- MUST include skill name, domain family, and estimated content scope when proposing new skills
- MUST propose concrete follow-up when identifying tech debt — not vague observations
- MUST apply significance criteria (>100 LOC, public API, component/hook/route handler/schema) when assessing sidecars
- MUST cite both the doc claim and the contradicting code when finding MISLEADING docs
- MUST NOT fix issues in-line — retro is observation only; fixes are separate tasks
- SHOULD propose creating high-reuse skills immediately after retro
- SHOULD streamline the report to essentials only when blast radius is small (<5 files)

## Next Steps

- `/insight-skill-gap` — create/update skills flagged in retro

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
