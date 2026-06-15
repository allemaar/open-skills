---
name: ask-gate
description: >
  The Ask-Gate Protocol (AGP). Before surfacing an AskUserQuestion, triage whether the question is genuinely the handler's call (anti-nag); ask routine questions directly after a quality checklist, but escalate high-stakes / branching / irreversible ones through /insight-critique then /insight-assess first. Trigger via /ask-gate, or automatically before any handler-facing question. Not /caller-options (routes a skill's venue/mode) or /next-skills (recommends successors) — AGP governs the question itself.
visibility: public
self-improvable: true
triggers:
  - "/ask-gate"
next-skills:
  - skill: insight-cross-examine
    phrase: "/insight-cross-examine"
    why: "When triage escalates a high-stakes branching question, deliberate the options to a recommendation before asking."
  - skill: insight-assess
    phrase: "/assess"
    why: "Evaluate the specific options behind an escalated decision so the handler's call is grounded."
  - skill: reflect
    phrase: "/reflect"
    why: "If the question is the handler's but you want to surface your own assumptions first, pause before phrasing it."
---

# /ask-gate

**Ask-Gate (AGP)** governs the moment *just before* a handler-facing question. Asking is cheap to type and expensive to waste — a question the agent could have answered itself is a nag, and a high-stakes question asked with the wrong options or framing burns the one interaction that mattered. AGP makes AskUserQuestion a deliberate, quality-gated reflex instead of a casual reach: triage whether to ask at all, ask routine questions directly after a quick checklist, and escalate the questions that actually matter through `/insight-critique` then `/insight-assess` before surfacing them.

AGP is invoked two ways: **automatically**, as the standard reflex before any AskUserQuestion (it can fire inside COP's surface step, inside NSP's surface step, or standalone); or **directly**, as `/ask-gate` to quality-gate a specific pending question.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## The protocol — three steps

### 1. Triage (anti-nag)

A question is the handler's to answer **only if it cannot be resolved from the request, the code, or sensible defaults.** If it can be resolved, resolve it, state the choice you made, and **do not ask**. Asking a resolvable question is the single most common nag failure — this gate exists to kill it. This mirrors COP's step-1 anti-nag triage; if nothing genuinely needs the handler, AGP surfaces nothing.

### 2. Classify stakes

If a question is warranted, classify it:

- **Routine** — low-stakes, reversible, one obvious framing (a preference, an NSP "which next skill?", a yes/no with a clear default). → **Routine path** (3a).
- **High-stakes** — architecturally load-bearing, hard to reverse, commits resources or time, *or* 3+ viable options where the *framing itself* is uncertain, *or* the answer shapes a plan/roadmap. → **High-stakes path** (3b).

When in doubt between the two, treat it as high-stakes — the escalation is cheap relative to a mis-framed expensive decision.

### 3a. Routine path — inline checklist, then ask

Apply this lightweight question-quality checklist inline, then surface directly:

- **Handler's call?** — already confirmed in triage.
- **Mutually exclusive?** — single-select options must be mutually exclusive; use `multiSelect` only when choices genuinely aren't.
- **Recommended-first** — put the recommended option first and label it "(Recommended)".
- **Exhaustive enough** — options cover the real space; "Other" is the escape hatch, not a substitute for thinking.
- **Self-answerable?** — not answerable by gathering a little context yourself first.
- **Within limits** — ≤4 options per question, ≤4 questions.

### 3b. High-stakes path — critique → assess → ask

1. **`/insight-critique`** the *candidate questions themselves* (not the underlying work): are these the right questions? Are the options mutually exclusive, exhaustive, recommended-first? Is anything still resolvable without the handler?
2. **`/insight-assess`** the critique findings: which framing and option set best serves the decision? Produce the refined question set.
3. **Ask** the refined set via AskUserQuestion, recommended option first.

Both sub-skills run **inline under an `AG-RESOLVED` marker carrying `depth: 1`** — see Depth & safety.

## Depth & safety

- **Depth-1 only.** `/insight-critique` and `/insight-assess` can themselves surface questions. When AGP invokes them, it prepends an `AG-RESOLVED` marker with `depth: 1`; under that marker they run inline and any question they raise is asked directly after the inline checklist — they never re-enter AGP. The marker *is* the recursion guard (no harness signal detects this nesting).
- **Triage always runs first.** Never surface a question that triage can resolve.
- **Escalation is bounded.** The high-stakes path runs critique once and assess once — it is not a loop. If the refined questions are still unclear, ask the handler that meta-question directly rather than escalating again.

## Lifecycle position

AGP, **Caller Options (COP)**, and **Next Skills (NSP)** are the three question/handoff hooks and never conflict:

- **COP** runs *before* a skill — routes venue (inline / delegated / fan-out) and mode.
- **NSP** runs *after* a skill — recommends successor skills.
- **AGP** wraps *the question itself* — whenever any of them (or the bare agent) is about to ask the handler something.

AGP can fire inside COP's surface step or NSP's surface step: those protocols decide *what* to ask; AGP decides *whether and how* to ask it well.

## Platform mapping

- **Surface** — Claude Code: `AskUserQuestion`. Codex or any runtime without a structured-question tool: present the options + recommendation as a numbered prose list and wait for the reply.
- **Triage, classify, critique, assess** are runtime-agnostic.

## Standalone use

`/ask-gate` runs the protocol ad-hoc on a specific pending question — useful to quality-gate a question you've already drafted, or to smoke-test the triage on a borderline "should I even ask this?" case.

## Boundary

Not a session mode and not a router for skills. For venue/mode routing of a skill invocation use [`caller-options`](../caller-options/SKILL.md); for successor-skill recommendations use [`next-skills`](../next-skills/SKILL.md). AGP *uses* [`insight-critique`](../insight-critique/SKILL.md) and [`insight-assess`](../insight-assess/SKILL.md) on the high-stakes path — it does not replace them.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
