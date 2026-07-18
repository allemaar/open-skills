---
name: cold-review
description: >
  Run outside-agent review of actual work artifacts against objectives, with classification, fresh reviewer lenses, evidence-based findings (re-opened at synthesis, not recalled), scoring, and thresholds; the review self-verifies its own findings before returning. Trigger on /cold-review, "cold review this", "get outside review", "have fresh agents inspect this work", or "review this with fresh context". Use verify for self-gating intent/plan/execution; use insight-adversarial for persona critique of ideas or plans.
caller-options:
  venue: [inline]
  modes: [narrow, medium, broad]
  default-policy: ask
visibility: public
self-improvable: true
triggers:
  - "/cold-review"
  - "cold review this"
  - "get outside review"
  - "have fresh agents inspect this work"
  - "review this with fresh context"
next-skills:
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the review's findings into a phased plan to remediate what it flagged."
  - skill: insight-cross-examine
    phrase: "/insight-cross-examine"
    why: "When the verdict is borderline, deliberate the findings to a clear go/no-go before acting."
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit and push the reviewed artifact once it passes the threshold."
  - skill: double-check
    phrase: "/double-check"
    why: "Re-verify a single contested finding the review raised before reworking everything."
  - skill: human-merge
    phrase: "/human-merge"
    why: "Several reviewers came back separately and the pile is what defeats the reader — collapse the reviewer reports into one decision surface, classifying where two reviewers actually conflict instead of averaging their verdicts, and pooling coverage so a gap no single reviewer had becomes visible."
  - skill: human-rewrite
    phrase: "/human-rewrite"
    why: "Repair the readability of the single synthesised review once it exists — it stays long and reviewer-voiced — without softening a severity or dropping a caveat. Hand it the one synthesis, never the separate reviewer reports."
---

# /cold-review

Run an independent review of actual work artifacts using fresh context. The goal is to surface issues the current agent misses because it has too much context, owns the work, or is biased toward its own implementation. This is a workflow, not a persistent mode.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller. cold-review's modes are the reviewer-count tiers (`narrow`/`medium`/`broad` → 1/2/3 reviewers); its venue is `inline` only (cold-review spawns its own reviewers — COP never wraps a self-orchestrating skill).

## Boundary

Use `cold-review` for completed or in-progress work artifacts: diffs, files, code, tests, screenshots, UI states, plans, specs, docs, command outputs, worker reports. Do not use it for raw ideas. Use `insight-adversarial` for multi-POV critique of plans/ideas/strategy, `verify` for a formal self-gate, and `double-check` when the current agent should re-read and challenge a specific target itself.

## Step 1 — Establish target and objectives

Identify: the **work assessed**; the **objectives** (infer and label as inferred if not given); the **constraints** (non-goals, compatibility, style, acceptance criteria, preferences); and the **available evidence** (tests, commands, screenshots, docs, diffs, source). If no concrete artifact exists, stop and ask for the target — do not review from vague memory.

## Step 2 — Classify the work

Classify the primary target type and choose lenses accordingly:

| Target type | Required review lenses |
| --- | --- |
| Backend / code | Correctness, architecture, security, tests, maintainability, performance |
| Frontend / UI | User flow, visual layout, responsiveness, accessibility, interaction states |
| Plan / spec | Ambiguity, scope, sequencing, assumptions, executability |
| Agent skill / workflow | Trigger clarity, runtime portability, step ordering, failure modes |
| Mixed work | Pick the top 2 target types and cover both |

## Step 3 — Choose reviewer count

Spawn fresh reviewer agents when the runtime supports subagents:

- **1** — narrow work: one file, one small fix, one artifact, low risk.
- **2** — medium or mixed work: multiple files, UI plus logic, plan plus implementation, moderate risk.
- **3** — broad or high-risk work: shared abstractions, security changes, multi-surface UI, migrations, agent workflows, release-blocking work.

Do not spawn more than 3 reviewers without explicit user confirmation. If fresh agents are unavailable, perform a degraded single-agent review and label the report: `Degraded review: no fresh reviewer agents were available, so this is a same-session review and may miss context-bias issues.`

## Step 4 — Brief reviewers

Each reviewer gets a narrow, evidence-based brief. Do not pass the lead agent's conclusions as ground truth. Assign one lens per reviewer.

```text
You are a cold reviewer. You did not do this work. Review only the supplied artifacts and source evidence.

Work assessed:
Objectives:
Constraints:
Your review lens:
Artifacts/evidence to inspect:
Do not modify files. Do not propose broad rewrites unless needed to fix a concrete issue.
When you check a claim, pose it as a question against the source ("Is X true, per the evidence?"), not a statement to confirm; re-open the source, do not rely on recall.

Return:
- Findings grouped by Critical, Major, Minor, Interesting
- Evidence for every finding, with file paths, commands, screenshots, or artifact references where possible
- Missing evidence or uncertainty
- Suggested score from 0-100 and rationale
```

Suggested lens groups:

- **Backend / code**: Correctness, Architecture, Security, Test Coverage, Performance reviewers.
- **Frontend / UI**: UX, Visual/Layout, Accessibility, Responsive States, Product Friction reviewers.
- **Plan / spec**: Scope, Pragmatist, Sequencing, Assumption, Executability reviewers.
- **Agent skill / workflow**: Trigger Auditor, Runtime Portability, Agent Runtime, Process Auditor, Failure-Mode reviewers.
- **Diagnosis brief (chained after `/handoff-execute`)**: Correctness, Scope/Architecture, Hypothesis Quality reviewers. The Correctness lens checks the fix matches the named problem with no new races; Scope/Architecture verifies brief out-of-scope guards held and architecture invariants (esp. coupled-constant SEE ALSO trails) are preserved; Hypothesis Quality challenges whether the diagnosis was sound or the agent band-aided over an unidentified root cause. This triplet repeatedly catches the "missed 4th call site" / "wrong file list" / "5/5 stress isn't 10/10" class of finding.

## Step 5 — Synthesize

The lead agent synthesizes reviewer reports into one final report. Do not paste raw reports unless asked.

**Self-verify the synthesis (before returning).** Re-open the evidence behind each load-bearing finding and confirm it against source; drop or downgrade any finding whose evidence doesn't survive a fresh read. A cold review must pass its own active re-check — a reviewer's confident finding is not exempt from the self-report unreliability it exists to catch.

```text
Cold Review Report

Work assessed:
Objectives:
Review type: full cold review | degraded same-session review
Reviewers/lenses used:

Findings
- Critical:
- Major:
- Minor:
- Interesting:

Score:
Verdict:
Recommended fixes:
Open uncertainties:
```

Scoring thresholds: **90-100** clean (minor notes only) · **75-89** acceptable with concerns (fix important issues before high-stakes use) · **60-74** risky (major issues need resolution) · **below 60** blocked (rework or redesign). Any Critical finding caps the verdict at risky or blocked regardless of numeric score.

## Rules

- MUST review concrete artifacts and evidence, not memory alone.
- MUST classify the work before choosing reviewer lenses.
- MUST use fresh reviewer agents when available and appropriate for the work size.
- MUST label degraded same-session reviews clearly.
- MUST require evidence for every finding, and MUST re-open (not recall) the evidence for each load-bearing finding at synthesis.
- MUST separate Critical, Major, Minor, and Interesting findings.
- MUST include a numeric score and threshold verdict.
- MUST NOT let reviewers modify files; this skill reviews only.
- MUST NOT confuse critique with verification: a high score does not replace tests, builds, or `verify` when those are required.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
