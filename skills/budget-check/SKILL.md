---
name: budget-check
description: >
  Pre-wave usage gate. Before launching an expensive multi-agent wave or fan-out, check the active usage block against a threshold (default 95%) via `ccusage` and return go / no-go / unknown — fail-closed, never a fabricated go. Trigger via /budget-check, or as a reflex before any large dispatch. Not /ask-gate (governs a handler-facing question) or /orchestrate-mode and /multi-agent-mode (which run the wave) — budget-check only decides whether the wave should start.
visibility: public
self-improvable: true
companions:
  - path: references/tools/budget-check.mjs
    optional: false
    why: "The required bounded ccusage wrapper and verdict engine; bundled inside this skill."
triggers:
  - "/budget-check"
next-skills:
  - skill: orchestrate-mode
    phrase: "/orchestrate-mode"
    why: "On GO, launch the gated multi-agent wave with isolated workers."
  - skill: multi-agent-mode
    phrase: "/multi-agent-mode"
    why: "On GO, proceed with delegated helper slices alongside your own work."
  - skill: reflect
    phrase: "/reflect"
    why: "On NO-GO, pause to decide whether to trim the wave, wait for the window, or proceed anyway."
---

# /budget-check

A **pre-wave usage gate**. Launching a multi-agent wave is the most expensive thing an agent does — N concurrent subagents, each burning tokens. `/budget-check` answers one question *before* you spend: is the current usage window close enough to its ceiling that starting a wave is reckless? It returns **go**, **no-go**, or **unknown**, and it **fails closed** — with no usage data it returns `unknown`, never a convenient "go".

It is deliberately small: a concrete wrapper around the public [`ccusage`](https://github.com/ryoppippi/ccusage) reader, not a judgment engine. It does **not** add a global rule or amend your operating directives — it is a skill you *call*, so the gate lives at the decision point, not as standing policy.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## The check — one tool, three verdicts

The skill ships [`references/tools/budget-check.mjs`](references/tools/budget-check.mjs) inside its own folder. Resolve the installed skill directory and run the bundled tool, which wraps `ccusage blocks --json`:

```bash
node <skill-dir>/references/tools/budget-check.mjs                  # go/no-go vs 95% of your historical-peak block
node <skill-dir>/references/tools/budget-check.mjs --threshold 90   # custom threshold (percent)
node <skill-dir>/references/tools/budget-check.mjs --token-limit 200000000   # explicit ceiling instead of the auto peak
node <skill-dir>/references/tools/budget-check.mjs --json           # machine-readable verdict
```

- **Ceiling** = `--token-limit <N>` if you pass one, else the largest historical (non-active) block's total tokens — ccusage's own `max` notion, i.e. "your usual peak window." Without `--token-limit`, the gate measures against *your own historical peak* — a relative signal ("am I near my personal worst window"), not your real plan budget. **For a true budget gate, pass `--token-limit <N>` with your plan's actual token ceiling.**
- **Verdict** = `go` when the active block is under the threshold, `no-go` at or over it, `unknown` when there is no usage data, no active block, or no ceiling to measure against.
- **Exit code** = `0` go · `1` no-go · `2` unknown — so a dispatch script can gate on it directly.
- On **no-go** it also reports `secondsUntilWindowClears` and a `min(3600, …)` poll interval, so you know how long until the window resets.

## How to use it

1. **Before a wave** (a fan-out of subagents, a `prime-sweep`, an orchestrated run), call `/budget-check`.
2. **GO** → launch the wave.
3. **NO-GO** → trim the wave (fewer concurrent workers), wait for the window to clear (the reported interval), or proceed deliberately — your call, surfaced not forced.
4. **UNKNOWN** → the gate cannot vouch; decide on other grounds and say so. A common, fixable cause is no inferable ceiling (a fresh environment with no historical block) — pass `--token-limit <N>` with your plan's real token budget to get a meaningful gate.

This is a **runtime** tool — it reads *your* local usage logs, so it has nothing to measure in CI. The value is at the live pre-wave decision point, never in a pipeline.

## Boundary

- Not `/ask-gate` — that triages a handler-facing *question*; budget-check gates a *spend*.
- Not `/orchestrate-mode` or `/multi-agent-mode` — those *run* the wave; budget-check only decides whether it should start.
- It encodes no policy and amends no directive: a skill you call, not a rule that fires.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol: surface the front-matter recommendations for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol: if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
