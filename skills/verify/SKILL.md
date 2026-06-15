---
name: verify
description: "Formal phase gate — checks intent, plan, and execution artifacts for drift. Requires the intent and execution artifacts (the plan is optional; an absent plan short-circuits to a plan-not-found verdict). Produces structured output. Trigger when the user runs /verify or needs to decide whether to proceed to the next phase. Not /double-check (quick re-check of one claim), /reflect (informal thinking, no gate), or /insight-critique (advisory output review) — verify is the formal gate against intent, plan, and execution."
visibility: public
self-improvable: true
next-skills:
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit and push when the verdict is clean"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Redesign if the verdict surfaced drifts"
  - skill: investigate
    phrase: "/investigate"
    why: "Dig deeper if the verdict surfaced issues that need fact-gathering"
triggers:
  - "/verify"
---

# /verify

`/verify` is a formal phase gate. It checks three artifacts against each other — the **intent** (the original goal), the **plan** (the stated approach), and the **execution** (what was actually done) — and reports whether they still align before you proceed.

It hard-gates on two of them: the **intent** and the **execution**. If either is absent it stops and names what is missing, rather than guessing. The **plan** is optional — when absent, verify reports `status: plan-not-found` rather than failing. For a softer pause with no artifact requirement, use `/reflect`; for a quick re-read of a single claim, use `/double-check`.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). It carries the canonical preconditions, step sequence, and routing as named, validatable records; this file is the human-facing explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Preconditions

Two artifacts hard-gate the run: the **intent** and the **execution**. If either is missing, verify aborts and says so — there is nothing to align without both. The **plan** may be absent: when it is, verify skips the plan and execution checks and reports `status: plan-not-found` rather than failing.

## The four phases

1. **Intent check.** Using the intent as ground truth, name any drift between the original goal and the current direction — with evidence.
2. **Plan check.** Does the plan match the intent? Look for scope creep, missing steps, unstated assumptions, over-engineering. Cite specific sections.
3. **Execution check.** Does the execution match the plan? Look for skipped steps, deviations, unplanned changes, incomplete work. Cite specific evidence.
4. **Report.** Produce a structured verdict: `clean` (true/false), `gaps`, `drifts`, `issues`, and a `status` of `clean | gaps-found | plan-not-found | incomplete`. A `clean: true` verdict must cite evidence and must follow substantive analysis of all prior phases.

## Routing

The verdict points to the next move: `/investigate` when issues were found, `/plan-create` when the run surfaced drift from the intent, and `/github-sync` when the verdict is clean.

## Boundary

`verify` is the formal self-gate against intent, plan, and execution artifacts. It is not `/cold-review` (outside-agent review of work artifacts), not `/insight-critique` (advisory review of one output), and not `/double-check` (a quick targeted re-read of a single claim). A clean verdict is not a substitute for tests or a build where those are required.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
