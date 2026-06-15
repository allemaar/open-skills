---
name: next-skills
description: >
  The Next Skills protocol (NSP). When a participating skill finishes, surface its declared
  follow-on skills — each with an activation phrase and a one-line why — for the caller to pick,
  onboarding-style. Trigger via /next-skills, or automatically when a skill carrying the NSP
  opt-in block completes. Not /caller-options (routes one invocation's venue/mode) or
  /skills-help (the static library menu) — NSP recommends successor skills after one runs.
disable-model-invocation: true
runtime: [claude, codex, agents]
visibility: public
triggers:
  - "/next-skills"
next-skills:
  - skill: skills-help
    phrase: "/skills-help"
    why: "Browse the full static skill library when none of the recommended successors fits."
  - skill: caller-options
    phrase: "/caller-options"
    why: "Sibling protocol hook — route the chosen successor's venue/mode for one invocation."
  - skill: ask-gate
    phrase: "/ask-gate"
    why: "Sibling protocol hook — triage whether to ask the handler before acting on the pick."
---

# /next-skills

**Next Skills (NSP)** answers the question a skill leaves open: *what now?* When a participating
skill finishes, NSP reads that skill's declared successors and surfaces them — each with an
activation phrase and a short reason — for the caller to choose from. The caller (a human, or
another agent) picks; nothing auto-runs.

NSP is invoked two ways: **automatically**, when a skill carrying the NSP opt-in block completes;
or **directly**, as `/next-skills <skill>` to preview a skill's declared successors.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). It carries the three steps and the
> offer-only / empty-silent / loop-safe rules as validatable records; this file is the explanation.
> Keep the two in sync — edit one, update the other and refresh the `@STAMP` date.

## The protocol — three steps

1. **Read.** Take the just-finished skill's `next-skills:` front-matter list. Each entry has a
   `skill`, a `phrase` (its activation phrase), and a `why` (one line: why it might be useful
   next). If the list is absent or empty, **stop silently** — NSP surfaces nothing.
2. **Surface.** Present the recommendations for the caller to pick (runtime-mapped, below).
   Recommendations are *offered*, never auto-invoked.
3. **Activate.** On the caller's pick, activate the chosen skill(s) via their activation phrase.
   On no pick, end quietly.

## Surface step — runtime mapping

- **Claude Code** → `AskUserQuestion` (multiSelect). One option per recommendation: the label is
  the skill name, the description is its `why`. The user may pick one, several, or none ("Other"
  / dismiss always declines).
- **Codex, or any runtime without a structured-question tool** → present a numbered prose list,
  each line `N. <phrase> — <why>`, and wait for the caller's reply.

The Read and Activate steps are runtime-agnostic.

## Data contract

The `next-skills:` front-matter field on a participating skill is **canonical**:

```yaml
next-skills:
  - skill: insight-assess
    phrase: "/assess"
    why: "Evaluate the options you just generated and pick one"
```

Any prose `## Next steps` section in a skill is derived/explanatory — keep it for nuance the
flat list cannot carry. Recommendations are **unconditional offers**: a flat list cannot encode
"if verdict X". A skill whose successors are conditional (e.g. `insight-assess` recommends
`/plan-create` only *if* the verdict is PROCEED) keeps that nuance in its prose section; the
`why` field may hint the condition ("…if the plan is sound").

## Loop safety

Recommendations are **offered**, never auto-invoked — the caller gates every hop. NSP therefore
cannot chain `A → B → A` autonomously; a ping-pong would require the user to choose it each time.
This is NSP's equivalent of COP's depth guard. NSP also never blocks: if a skill declares no
successors, or the `next-skills` skill is itself unavailable, the skill completes normally.

## Lifecycle position

NSP and **Caller Options (COP)** hook opposite ends of a skill invocation and never conflict:
COP runs *before* execution (it routes venue/mode), NSP runs *after* (it recommends successors).
A skill may carry both opt-in blocks; they are independent.

## The opt-in block

A skill joins NSP by adding (1) the front-matter field, (2) a prose pointer in `SKILL.md`, and —
for dual-doc skills — (3) a closing `@STEP` in `protocol.yon`. **Per-skill front-matter is
canonical.** Unlike COP's pointer (placed near the top, since COP runs before the skill), the
NSP pointer goes at the **end** of the skill — NSP runs on completion.

### 1. Front-matter field

Add a `next-skills:` list (see *Data contract* above). It is metadata — the harness does not
execute it; it is read by NSP, by audit tooling, and by humans.

### 2. SKILL.md prose block

Paste at the **end** of the `SKILL.md` body, as the last section:

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface
> the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never
> auto-invoke.

### 3. protocol.yon @STEP (dual-doc skills only)

Insert as the **last** `@STEP`, after the skill's own steps:

```
@STEP rid=step:nsp | n:int=99 | op=std:ai.prompt@v1 | args=[task="Run the Next Skills protocol: surface the next-skills front-matter recommendations for the caller to pick. Offer only; never auto-invoke. Skip silently if the next-skills list is empty."] | in=[] | out=[ref:nsp-offer]
```

Use `n:int=99` (or any number after the skill's last real step) so NSP stays last. Refresh the
`@STAMP` date when adding it.

## Graceful degradation

If the `next-skills` skill is missing, unlinked, or unreadable, the opt-in block is a **no-op** —
the participating skill completes normally with no recommendations surfaced. NSP never blocks a
skill from finishing.

## Standalone use

`/next-skills <skill>` reads a named skill's `next-skills:` field and previews its declared
successors without that skill having run — useful for inspecting or smoke-testing the chain.

## Boundary

Not [`caller-options`](../caller-options/SKILL.md) — COP routes a single invocation's venue and
mode *before* it runs. Not [`skills-help`](../skills-help/SKILL.md) — that is the static library
menu. NSP recommends *successor* skills *after* one completes.
