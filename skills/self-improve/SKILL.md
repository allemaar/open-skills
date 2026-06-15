---
name: self-improve
description: >
  The Self-Improvement Protocol (SIP). After a participating skill runs, detect concrete signals that the skill itself could be better — ambiguous instructions, an uncovered edge case, a misfired rule, a stale cross-reference, a user correction — and propose a specific diff to it, surfaced for approval and never auto-applied. Conservative by default: silent unless a ready, blocking, or recurring fix exists. Trigger via /self-improve, or automatically when a self-improvable skill completes. Not /insight-skill-gap (deliberate batch scan for new/updated skills) or /insight-retro (post-implementation review) — SIP is the in-the-moment, per-skill detector.
visibility: public
self-improvable: false
triggers:
  - "/self-improve"
  - "/self-improve [skill]"
next-skills:
  - skill: ask-gate
    phrase: "/ask-gate"
    why: "SIP never auto-applies — the proposed diff must be surfaced to the handler, which is exactly the question-triage gate ask-gate governs."
  - skill: insight-skill-gap
    phrase: "/skill-gap"
    why: "When the in-the-moment signal points to a recurring pattern, escalate to the deliberate batch scan for new or updated skills."
  - skill: new-skill-creator
    phrase: "/new-skill-creator"
    why: "If the detected gap is a whole missing capability rather than a tweak, scaffold it as a new skill."
---

# /self-improve

**Self-Improvement (SIP)** turns each skill run into a chance for that skill to get better. When a participating skill finishes, SIP checks whether the run surfaced a *concrete* weakness in the skill — and if so, drafts a specific improvement and surfaces it for the handler to approve. It is the **per-skill, in-the-moment, signal-triggered** counterpart to the deliberate batch reflection of `/insight-skill-gap` and `/insight-retro`.

SIP is the structural mirror of NSP: **NSP** runs after a skill and asks *"what should you do next?"*; **SIP** runs after a skill and asks *"how should this skill be better next time?"*

SIP is invoked two ways: **automatically**, when a skill carrying the SIP opt-in block completes; or **directly**, as `/self-improve [skill]` to review a specific skill against the most recent run.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Conservative by default.** A missed minor improvement is cheaper than nag fatigue. SIP surfaces nothing unless a signal is concrete, **material** (it cost something *this run* — a deviation, a guess, a halt, or a wrong output) **or recurring within the session** (the same signal seen ≥2× this session), and a specific fix is ready. Silence is the common case.

## Signal taxonomy — what counts as a real signal

SIP fires only on **concrete** signals tied to *this* run. Vibes ("this could be cleaner") do not qualify. The qualifying signals:

- **Ambiguity** — the skill's instructions were unclear and the agent had to guess which interpretation to follow.
- **Uncovered edge case** — the run hit a case the skill's steps/gates don't address, forcing improvisation.
- **Forced deviation** — getting a good result required departing from the skill's prescribed steps.
- **Misfired rule** — a gate/check over- or under-fired (e.g. an ABORT that should be WARN, a WARN that should be ABORT, a false-positive halt). This is how live skills get *tuned*.
- **Stale cross-reference** — a path, skill, or file the skill names has moved, been renamed, or no longer exists.
- **User correction** — the handler corrected the agent in a way that exposes a gap in the skill, not just this task.

## The protocol — four steps

### 1. Watch
During and at the end of the participating skill's run, note any of the signals above. Passive — no extra work, just attention to where the skill fought you.

### 2. Triage (anti-nag + dedup)
Apply the conservative bar: surface a proposal **only if** the signal is concrete (tied to a specific taxonomy signal) **and material** — it actually cost something *this run* (forced a deviation, a guess, a halt, or produced a wrong output) **or recurred within this session** (the same signal seen ≥2× this session) — **and** a specific fix is ready to write. Otherwise **stay silent**. Then check the **within-session already-proposed set** — if this same improvement was surfaced earlier *this session* and not acted on, do not re-surface it (re-nagging is the failure mode). This is SIP's equivalent of COP's and AGP's anti-nag gate. (Cross-session dedup is a v2 backlog item — see Depth & safety.)

### 3. Draft
Produce a **specific diff**, not prose hand-waving: the target file (`SKILL.md` and/or `protocol.yon`, or a directive), the exact lines to add/change, and a one-line rationale tying the change to the signal. If the run instead reveals that a *new* skill is warranted (recurring multi-step pattern with no home), **delegate the authoring question to `/insight-skill-gap`** rather than drafting a skill from scratch here.

### 4. Surface
Route the proposal through **`/ask-gate`** (the proposal is itself a handler question) — invoked under a `SIP-RESOLVED` marker (see Depth & safety) — recommended action first: *approve* / *edit* / *decline*. **Never auto-apply** — application goes through the normal Edit path with handler approval. On approve, apply and (for dual-doc skills) keep `SKILL.md` ↔ `protocol.yon` in sync and bump the `@STAMP`. On decline or no-action, record it in the **within-session already-proposed set** so it isn't raised again this session.

## The opt-in contract

A skill joins SIP by declaring itself self-improvable (per-skill front-matter is canonical):

1. **Front-matter field** — `self-improvable: true`. Capable procedural skills (phases, gates, judgment) opt in; pure routers, mode-setters, and reference cards omit it (nothing to tune from a run).
2. **SKILL.md prose pointer** — paste at the **end** of the body (SIP runs on completion, like NSP):
   > **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
3. **protocol.yon** (dual-doc only) — a closing `@STEP rid=step:sip` as the last step, after `step:nsp` where present.

The field is metadata — the harness does not execute it; it is read by SIP, by audit tooling, and by humans.

## Depth & safety

- **No auto-apply.** Proposals are surfaced and approved, never silently written. The real guarantee is the `rule:no-auto-apply` MUST_NOT + the `/ask-gate` human approval — not an assumed harness feature. (The harness's auto-mode self-edit classifier *does* gate writes to agent-config like `CLAUDE.md` — confirmed to fire on such edits — but whether it also intercepts edits to individual skill files is unverified, so SIP does not lean on it.)
- **Dedup / proposed-once (within-session).** Re-surfacing an un-acted proposal every run is nag. SIP tracks proposals surfaced **during the current session** and suppresses repeats within it. **Cross-session persistence is not yet implemented** — there is no on-disk queue, so a proposal declined in an earlier session can resurface later. Until a persistent `skill-improvements/` store ships (**v2 backlog**), the mitigation is the conservative bar plus surfacing once and respecting the handler's standing decision.
- **Depth guard (`SIP-RESOLVED` marker).** SIP invokes `/ask-gate` (to surface) and may invoke `/insight-skill-gap` — both are themselves SIP participants whose completion would otherwise re-fire SIP, an unguarded `SIP → ask-gate → SIP → …` loop. SIP closes this the way COP and AGP do: when it invokes them it prepends a **`SIP-RESOLVED` marker carrying `depth: 1`**; under that marker they run inline and neither their own `step:sip` nor any nested SIP re-enters the gate. The marker *is* the recursion guard — a prose rule alone is memory-dependent, since no harness signal detects the nesting.
- **Conservative threshold is the contract**, not a suggestion. When unsure whether a signal clears the bar, stay silent.

## Lifecycle position

SIP joins the skill-hook family and never conflicts with the others:

- **COP** (`caller-options`) — *before* a skill: routes venue/mode.
- **AGP** (`ask-gate`) — *the question moment*: triages and quality-gates any handler question.
- **NSP** (`next-skills`) — *after* a skill: recommends successor skills.
- **SIP** (`self-improve`) — *after* a skill: proposes improvements to the skill that just ran.

NSP and SIP both run on completion and compose cleanly: NSP points forward (what to do next), SIP points inward (how this skill should evolve). SIP surfaces *through* AGP.

## Platform mapping

- **Surface** — Claude Code: via `/ask-gate` → `AskUserQuestion`. Codex or any runtime without a structured-question tool: present the proposal + recommended action as prose and wait.
- **Watch, triage, draft** are runtime-agnostic.

## Standalone use

`/self-improve [skill]` runs the protocol on demand against the most recent run of a named skill — useful to deliberately mine a skill you just used heavily for tuning opportunities, or to audit one skill's fit without waiting for an automatic trigger.

## Boundary

Not a batch reflection and not a library audit. For a deliberate scan of recent work for new/updated skills use [`insight-skill-gap`](../insight-skill-gap/SKILL.md); for a full post-implementation retrospective use [`insight-retro`](../insight-retro/SKILL.md); for library health (descriptions, cross-refs, runtime parity), run a dedicated library-audit pass. SIP is the lightweight, per-run, signal-triggered detector that feeds those when a pattern is bigger than one fix.
