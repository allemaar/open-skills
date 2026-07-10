---
name: extract-signal
description: >
  An elastic signal-extraction methodology run under /multi-agent-mode. INFERS from the call what signal, what form, what stakes, and where output goes. Default is agentic — a normal call spawns a freshly-primed sub-agent that gathers, vets, and returns the signal; when extract-signal IS the agent (in-session / new-session) it works inline with output inline by default (or to a file if specified). Composes techniques per task: gather (/prime-sweep, /prime-fetch, /prime-expand), diverge (/insight-explore), vet (/insight-critique → /insight-assess), cold second opinion (/cold-review-style). Vetting scales with stakes; the presented signal carries provenance and is sensitivity-matched to its destination. Trigger on /extract-signal, "extract the signal on X and present it as Y", "gather + vet + report the signal about X". Not the prime-* / insight-* / cold-review skills it composes; not /multi-agent-mode (the mode it runs under).
visibility: public
self-improvable: true
triggers:
  - "/extract-signal"
  - "extract the signal on X and present it as Y"
  - "gather + vet + report the signal about X"
next-skills:
  - skill: insight-assess
    phrase: "/insight-assess"
    why: "Evaluate and decide among the options the extracted signal surfaced"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Turn the vetted signal into a phased implementation plan"
  - skill: handoff
    phrase: "/handoff"
    why: "Package the extracted, provenance-tagged signal as a brief for a fresh agent"
---

# /extract-signal

An **elastic methodology** for turning a noisy source surface into a **vetted signal in the form the requester asked for**, without contaminating the context that must stay clean. It is a goal + a toolkit + the judgment to **compose techniques to fit the task** — not a fixed pipeline. The work it does is determined by the context it is invoked with.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## The principle that motivates this skill

**Context hygiene comes from RELOCATION, not TRUNCATION.** Noisy work happens where noise is cheap — a spawned sub-agent's window, or this skill's own disposable window when it is itself a sub-agent. Only the **signal** reaches the place that must stay clean. The gathering area is never shrunk to fit an arbitrary size.

## Inference & contracts (read the call, don't demand a form)

The skill **infers** its parameters from how it was invoked; explicit overrides are accepted but never required:

- **What signal** — the question to answer.
- **What form** — the output shape (see menu). Inferred from the ask ("as a risk-list", "is it ready?", "what are the options").
- **Stakes** — inferred from consequence; drives vetting depth.
- **Mode & output** — inferred per below.

## Modes & output (inferred)

- **Agentic (default — the normal call).** extract-signal spawns a **freshly-primed sub-agent** that does the gather/vet/present and returns the signal. Relocation keeps the caller's window clean. Output returns to the caller (inline) unless a file is specified.
- **In-session / new-session (it IS the agent).** extract-signal works directly as the running agent; **output inline by default**, **to a file if specified**. (When it is itself a dispatched sub-agent, this is the same path: it works inline in its disposable window and does NOT spawn further sub-agents — depth-1 guardrail; the isolation already protects the caller.)

## The methodology (elastic — compose, don't follow blindly)

1. **Frame** the inferred signal request (what · form · stakes).
2. **Compose** the technique set for this task and run it (in the mode above):
   - **Gather** — `/prime-sweep` (many sources) · `/prime-fetch` (one noisy call) · `/prime-expand` (vague request → questions + named sources first).
   - **Diverge** — `/insight-explore` when the signal needs options/hypotheses generated before they can be vetted.
   - **Vet** — `/insight-critique` (poke holes) → `/insight-assess` (evidence solid? what does it imply?).
   - **Cold opinion** — a fresh, no-prior-framing read (`/cold-review`-style) as a drift guard.
3. **Vet proportionally to stakes** — cheap/low-stakes → a quick critique may suffice; material/high-stakes → full critique + assess + cold opinion. Reach for the cold opinion whenever the lead has been deep in the material.
4. **Present** the signal in the requested form (next two sections govern *how*).

## Output contract — the signal carries its provenance

Whatever the form, the presentation MUST include:

- the **signal** in the requested form;
- **provenance** — `source:line` (or equivalent) for load-bearing claims;
- **confidence** + **residual gaps** (what wasn't determined and why);
- **which techniques ran** (so the caller can judge the vetting depth).

## Sensitivity vs destination (do not over-expose the signal)

Signal inherits the sensitivity of what it was extracted from. Before presenting:

- **Tag the signal's sensitivity** (e.g. internal / restricted / public).
- **The destination must be cleared for that sensitivity.** If the output is bound for a lower-trust or external/public destination than the signal warrants, **flag it and withhold the sensitive parts** rather than present them. Never let internal detail flow into a public-bound artifact by default.

## Failure & contradiction handling

- **Empty gather** → report "no signal found", with what was searched. Never fabricate signal to fill the form.
- **Vet disagreement** (`/insight-assess` vs the cold opinion) → **surface the split** with both positions; do not silently average to a false consensus.
- **Mid-flight blocker** — if extraction hits a decision only the caller/handler can make, **surface it and pause** that line; do not guess past it.

## Bounds

- **Concurrency** — in agentic/full-agent mode, ≤3 parallel sub-agents, depth-1 (sub-agents don't spawn sub-agents).
- **Termination** — gathering stops at the gather tool's wave cap or when added waves return no new signal; report what was capped.

## Signal forms (reference menu — any custom form allowed)

| Form | Typically pairs |
|---|---|
| verdict / yes-no | gather → critique → assess (+ cold if material) |
| ranked options | insight-explore → assess → present ranked |
| risk-list | prime-fetch/sweep → critique → present risks |
| map / inventory | prime-sweep → present structured map |
| count / metric | prime-fetch → verify → present number + method |
| bill-of-health | prime-sweep → critique → assess → cold → present report |

## Examples (illustrative — the lead composes to fit the actual call)

**1 · Agentic + high-stakes → bill-of-health**
> **Call:** `extract-signal: is @acme/parser ready to ship publicly?`
> **Infers:** signal = release-readiness · form = bill-of-health · stakes = high · mode = agentic (default) · output = inline to caller.
> **Composes:** spawn a primed sub-agent → `prime-sweep` the package → `insight-critique` → `insight-assess` → cold second opinion → return the bill-of-health.
> **Returns:** verdict + per-area findings with `source:line`, confidence, residual gaps, techniques-run.

**2 · In-session inline + options → ranked-options**
> **Call (running as the session):** `extract-signal: what are our options for the cache layer? inline.`
> **Infers:** form = ranked-options · stakes = moderate · mode = in-session (it IS the agent) · output = inline.
> **Composes:** `insight-explore` (3+ options) → `insight-assess` (score) → present ranked. Lighter vet — no cold opinion at moderate stakes.
> **Returns:** ranked options + rationale + provenance + gaps.

**3 · Output-to-file + moderate → risk-list**
> **Call:** `extract-signal: risks in this diff → write to risks.md`
> **Infers:** form = risk-list · output = file (`risks.md`) · stakes = moderate · mode = agentic.
> **Composes:** `prime-fetch` the diff → `insight-critique` (hunt risks) → write a severity-ranked risk-list to the file.
> **Writes:** `risks.md` — each risk with severity + `source:line` + confidence.

**4 · Sensitivity-edge (the guard fires)**
> **Call:** `extract-signal: summarize the auth module for the public README`
> **Infers:** signal sensitivity = internal · destination = public README.
> **Acts:** sensitivity (internal) > destination (public) → **withhold internal detail, flag it** — present only the public-safe surface and tell the caller what was withheld and why. Never auto-leaks internal detail into a public artifact.

## Rules

- MUST infer the signal request from the call; MUST NOT demand a rigid input form.
- MUST default to agentic (spawn a primed sub-agent); when it IS the agent, work inline with output inline-by-default or to a file if specified.
- MUST keep gathered output complete (report-to-file for large surfaces); MUST NOT impose an arbitrary word/size cap on gathering.
- MUST compose techniques to fit the task; MUST NOT run a fixed sequence regardless of the signal.
- MUST vet before presenting; depth MUST scale with stakes.
- MUST attach provenance + confidence + gaps + techniques-run to the presented signal.
- MUST sensitivity-match the signal to its destination; MUST NOT over-expose internal signal to a public/external destination.
- MUST surface (not average) vet disagreements and (not guess past) mid-flight blockers.
- MUST NOT spawn sub-agents from within a sub-agent (depth-1 guardrail).

## Pairs with

- **`/prime-sweep`, `/prime-fetch`, `/prime-expand`** — gather techniques.
- **`/insight-explore`** — divergent generation when candidates are needed first.
- **`/insight-critique`, `/insight-assess`** — the vetting engine.
- **`/cold-review`** — the second-cold-opinion shape.
- **`/multi-agent-mode`** — the session posture this runs inside.
- **`/caller-options`** — surfaces the venue/output/form choices.

## Evolution (logged for v2+)

A signal ledger/cache (reuse prior extractions) and signal-quality metrics are deferred — not yet in scope.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
