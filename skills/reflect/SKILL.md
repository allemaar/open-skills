---
name: reflect
description: "Lightweight cognitive pause — surface assumptions, uncertainty, and what you'd do differently. No gate, no enforcement, no artifacts required. Trigger when the user runs /reflect or wants to step back and think before continuing. Not /verify (formal gate) or /ask-gate (question triage) — reflect is freeform thinking with no gate."
disable-model-invocation: false
visibility: public
next-skills:
  - skill: verify
    phrase: "/verify"
    why: "Gate the work formally if reflection surfaced a concern worth blocking on"
  - skill: plan-create
    phrase: "/plan-create"
    why: "Redesign if reflection points to a direction change"
triggers:
  - "/reflect"
  - "step back and think before continuing"
---

# /reflect

A lightweight cognitive pause — not a gate. `/reflect` steps back from the work to surface what has gone unspoken: the assumptions you never stated, where you are least confident, and what you would do differently starting fresh. It enforces nothing, requires no artifacts, and produces no verdict. For a formal gate, use `/verify`; for triaging whether a question is the handler's to answer, use `/ask-gate`.

## The reflection

Pause and answer three questions honestly:

1. **What assumptions did I make that I have not stated out loud?**
2. **Where am I least confident, and why?**
3. **If I were starting fresh, what would I do differently?**

This is not a status report. Be direct about uncertainty — the value is in naming what you would otherwise leave implicit.

## Why no `protocol.yon`

`reflect` is deliberately Markdown-only. The skills that ship a `protocol.yon` do so because they carry enforceable steps, rules, or gates a runtime can check. `reflect` carries none by design — it is a prompt to think, not a procedure to enforce. A protocol here would declare a contract the skill has no intention of keeping. For a no-gate skill, prose is the honest shape.

## Boundary

Not `/verify` (the formal gate against intent, plan, and execution) and not `/ask-gate` (question-triage). `reflect` is freeform thinking — no gate, no enforcement, no artifacts.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.
