---
name: prime-expand
description: Expand a vague gap into concrete questions + named source candidates via a delegated sub-agent — caller sees only the proposed pair for confirm/edit/refuse, never the expansion reasoning. Trigger /prime-expand, "expand on this", or auto-fire on handoff receipt with a thin brief. (Not for ambient "I need to know X" phrasing — that would collide with /investigate.) Single sub-agent, single turn, ≤3 candidate-source spot-checks only. Pairs with /prime-fetch (single noisy tool call) and /prime-sweep (large source-surface investigation).
caller-options:
  venue: [inline]
  default-policy: ask
visibility: public
self-improvable: true
next-skills:
  - skill: prime-fetch
    phrase: "/prime-fetch"
    why: "When the expansion needs a single noisy data-fetch (Grep/WebFetch/MCP) on the proposed source"
  - skill: prime-sweep
    phrase: "/prime-sweep"
    why: "When the expansion's proposed sources are ≥3 distinct OR span >10k tokens — needs parallel sub-agent investigation"
  - skill: plan-create
    phrase: "/plan-create"
    why: "When the expansion sharpened the goal enough to plan the work directly (no priming needed)"
triggers:
  - "/prime-expand"
  - "expand on this"
---

# /prime-expand

Expand a vague gap statement into a concrete priming target — sharp question(s) + validated source candidates — via a delegated sub-agent, so the expansion reasoning never enters the caller's context. The caller sees only the proposed pair and confirms, edits, or refuses.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Caller Options.** Before executing, run the Caller Options protocol (`caller-options/SKILL.md`): triage this invocation for material optionality across the venues and modes declared in front-matter; if one path clearly dominates, proceed silently; otherwise surface the options to the caller.

> **Family invariant — `/prime-*` skills delegate.** Every `/prime-*` skill uses sub-agents so the caller's context stays clean. `/prime-expand` is the lightest member: one sub-agent, one turn, no deep reading.

## Boundary

Use `/prime-expand` to turn a fuzzy "I should know more about X" into a sharp `{question, sources[]}` pair ready to feed downstream priming. Do not use it for actual investigation — that is `/prime-fetch` (single noisy tool call) or `/prime-sweep` (large source-surface, parallel sub-agents). Do not use it to gather facts for the user — that is `/investigate`.

## Step 1 — Receive the seed gap

The seed can be a vague statement, a topic, or a worry. Examples:

- *"I need to know about auth"*
- *"what about the cache layer?"*
- *"expand on yesterday's bug"*
- *"prime me before I touch the rate-limiter"*

If the seed is already a sharp question with named sources, do not run this skill — pass straight to `/prime-fetch` or `/prime-sweep`.

## Step 2 — Build the context snapshot

Assemble a short snapshot for the sub-agent only. **This is the only context-bridge** — the sub-agent must not see the caller's full conversation history.

- CWD, project type (language/framework if known).
- Last few files mentioned in this turn.
- The caller's current task or objective if known.

## Step 3 — Brief and spawn the sub-agent

Spawn one sub-agent with a fresh context window. The brief contains:

- The seed gap, verbatim.
- The context snapshot from Step 2.
- Light scan permissions: `Glob` and `Read` to validate candidate sources exist and look plausible (≤3 files, ≤200 lines each). No deep reading, no `Grep`, no `WebFetch`, no `Bash`.
- Output contract requiring only the proposed pair (or a refusal line).

## Step 4 — Sub-agent expands

The sub-agent works in its own window:

1. Parses the seed for likely subject, scope, and missing specifics.
2. Generates 1–3 concrete declarative questions implied by the seed.
3. Proposes ≥1 source candidate per question (file path, URL, doc reference, `the conversation above`, `the search-result dump in turn N`).
4. Spot-checks candidates exist (`Glob` / `Read`, ≤200 lines each).
5. Discards proposals whose sources don't exist or don't look relevant.

## Step 5 — Sub-agent emits the proposed pair

Only the proposed pair returns to the lead. The sub-agent's working/reasoning stays in its own window.

```text
Seed: <original input verbatim>
Expanded:
  Q1: <concrete declarative question>
  Q2: <optional second question if seed implies more than one>
  Sources: [<source 1>, <source 2>, ...]
```

If the sub-agent cannot produce ≥1 question with ≥1 validated source, it emits:

```text
Seed: <original input verbatim>
Refused: cannot expand — <one-line reason>
```

## Step 6 — Surface for confirm / edit / refuse

The lead presents the proposed pair to the caller (or user) and waits for one of three responses:

- **Confirm** — emit `{question, sources[]}` to the caller for direct use, or chain into `/prime-fetch` / `/prime-sweep`.
- **Edit** — caller revises questions or sources; lead re-emits the revised pair.
- **Refuse** — caller proceeds without priming; skill exits.

## Rules

- MUST delegate the expansion work to one sub-agent — the lead never reads sources itself.
- MUST cap the sub-agent's reading to ≤3 candidate-source spot-checks of ≤200 lines each.
- MUST emit only the proposed pair (or a refusal line) to the lead — sub-agent reasoning stays in the sub-agent's window.
- MUST refuse with a one-line reason if the seed cannot be expanded into ≥1 concrete question + ≥1 plausible source.
- MUST NOT let the sub-agent run `Grep`, `WebFetch`, `Bash`, or any tool that produces large output — those belong to `/prime-fetch` or `/prime-sweep`.
- MUST NOT allow the sub-agent to spawn further sub-agents (depth-1 cap).
- MUST NOT require proof-of-work citations — this skill produces intent (a question + candidate sources), not factual findings.

## Next Steps

- `/prime-fetch` — if the confirmed pair needs a single noisy data-fetch resolved (`Grep`, `WebFetch`, MCP).
- `/prime-sweep` — if the confirmed pair's sources are large or numerous enough that direct reading would flood the caller's context.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
