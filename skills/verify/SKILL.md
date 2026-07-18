---
name: verify
description: "Formal phase gate — checks intent, plan, and execution artifacts for drift, then actively re-checks each load-bearing claim against its source (an agent's self-report of having checked is not evidence). Requires the intent and execution artifacts (the plan is optional; an absent plan short-circuits to a plan-not-found verdict). Produces structured output. Trigger when the user runs /verify or needs to decide whether to proceed to the next phase. Not /double-check (quick re-check of one claim), /reflect (informal thinking, no gate), or /insight-critique (advisory output review) — verify is the formal gate against intent, plan, and execution."
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

## The five phases

1. **Intent check.** Using the intent as ground truth, name any drift between the original goal and the current direction — with evidence.
2. **Plan check.** Does the plan match the intent? Look for scope creep, missing steps, unstated assumptions, over-engineering. Cite specific sections.
3. **Execution check.** Does the execution match the plan? Look for skipped steps, deviations, unplanned changes, incomplete work. Cite specific evidence.
4. **Source re-check (active, per-claim — the load-bearing gate).** For every load-bearing factual claim in the execution or output, re-open the source that would confirm or refute it and check it directly; revise the claim if wrong. A claim not re-checked against its source is reported `unverified`, never as passing. The agent's own report that it "already checked" is NOT evidence — only a fresh read of the source counts. When assessing a claim, pose it as a question ("Is X true, per the source?"), not a statement to confirm. **When the claim is about a committed, built, or published artifact, re-check against the *consumed* form — the committed blob (`git show <ref>:<path>`), the built `dist`/tarball, or the published version — not the mutable working tree; a dirty tree or a stale dist can pass a claim while the committed HEAD / shipped artifact is broken (grepping the working tree is not verifying the commit). Exception: when uncommitted WIP is itself the artifact under verification, the working copy is the correct source.** *(Grounded in the critical-thinking arc: passive/optional verification lets false claims through; a mandated active re-check catches them. The consumed-artifact clause was added 2026-07-07 after `/verify` returned clean on a working-tree grep while the committed HEAD shipped two CLI verbs dead — same family as tsc-green≠verified and served-route-shadows-source.)*
5. **Report.** Produce a structured verdict: `clean` (true/false), `gaps`, `drifts`, `issues`, and a `status` of `clean | gaps-found | plan-not-found | incomplete | unverified`. A `clean: true` verdict must cite evidence, must follow substantive analysis of all prior phases, and requires every load-bearing claim to have passed the phase-4 source re-check.

## Routing

The verdict points to the next move: `/investigate` when issues were found, `/plan-create` when the run surfaced drift from the intent, and `/github-sync` when the verdict is clean.

## Boundary

`verify` is the formal self-gate against intent, plan, and execution artifacts. It is not `/cold-review` (outside-agent review of work artifacts), not `/insight-critique` (advisory review of one output), and not `/double-check` (a quick targeted re-read of a single claim). A clean verdict is not a substitute for tests or a build where those are required. Verification is active and per-claim: a passive alignment pass, or an agent's self-report of having checked, does not satisfy it.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
