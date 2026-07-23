---
name: caller-options
description: >
  The Caller Options protocol (COP). When a participating skill runs, detect optionality in Venue (inline / delegated sub-agent / fan-out) and Mode, evaluate it, and surface the choice to the caller instead of picking silently. Trigger via /caller-options, or automatically when a skill carrying the COP opt-in block runs. Not a session mode — use orchestrate-mode or multi-agent-mode for that; COP routes one skill invocation.
visibility: public
self-improvable: true
triggers:
  - "/caller-options"
next-skills:
  - skill: multi-agent-mode
    phrase: "/multi-agent-mode"
    why: "After the caller picks a delegated/helper venue, enter the mode that owns lead-plus-helper delegation."
  - skill: orchestrate-mode
    phrase: "/orchestrate-mode"
    why: "If the caller chose pure fan-out, switch to the dispatch-only mode that governs worker boundaries and integration."
  - skill: ask-gate
    phrase: "/ask-gate"
    why: "The sibling protocol — once venue is routed, triage any handler-facing question the run raises."
---

# /caller-options

**Caller Options (COP)** makes a skill's hidden choices visible. When a participating skill runs, COP detects whether the invocation has *material optionality* along two dimensions, evaluates the live options, and surfaces them to the caller — instead of the skill silently picking. The caller (a human, or another agent) decides.

- **Venue** — *who* executes: `inline` (the active agent), `delegated` (one primed sub-agent, while the active agent orchestrates — the "agentic counterpart"), or `fan-out` (N parallel sub-agents).
- **Mode** — *which path* of the skill, when the skill already has more than one.

COP is invoked two ways: **automatically**, when a skill carrying the COP opt-in block is triggered; or **directly**, as `/caller-options <task or skill>` for an ad-hoc routing decision.

## The protocol — five steps

COP always runs in the **active agent** — the venue decision cannot itself be delegated.

1. **Triage.** Read the triggered skill's `caller-options` declaration and the task. If exactly one venue *and* one mode clearly dominate, **skip straight to execute** — do not prompt the caller. This anti-nag gate resolves most invocations.
2. **Enumerate.** List the viable `mode × venue` combinations. Drop `delegated`/`fan-out` if the skill is on the never-delegate list, is self-orchestrating (spawns its own sub-agents — wrapping it would nest to depth 2), or if a resolved-invocation marker is present (depth guard).
3. **Assess.** Evaluate the survivors for cost, context hygiene, and fit. Two or fewer options → compare inline. Three or more → invoke `/insight-assess`.
4. **Surface.** Human caller → `AskUserQuestion`, recommended option first. Agent caller → state the options and the pick visibly, honoring the skill's `default-policy`.
5. **Execute.** Run the chosen combination. For `delegated`/`fan-out`: build a primed brief (reusing the `handoff` brief schema), prepend the **`COP-RESOLVED` marker block** (literal format in [`OPT-IN-BLOCK.md`](references/OPT-IN-BLOCK.md)) — it carries `depth: 1`, so the sub-agent runs its skill and any COP participant it triggers *inline* and never re-enters COP; spawn; orchestrate; inspect the diff/output before accepting.

## Venue heuristics

Whether to delegate is decided by [`references/VENUE-HEURISTICS.md`](references/VENUE-HEURISTICS.md). In short — **delegate** when the skill does heavy throwaway reading, produces a bounded artifact, writes files, or the main context is large; **keep inline** when the skill needs the live conversation, is trivial, is interactive, or the caller needs to see the reasoning. A skill that spawns its own sub-agents is **inline only** — COP never wraps an orchestrator.

## The opt-in block & frontmatter contract

A skill joins COP by adding the standard **opt-in block** — see [`references/OPT-IN-BLOCK.md`](references/OPT-IN-BLOCK.md) for both forms (a `@SEC`/`@STEP` for `protocol.yon`, a prose block for `SKILL.md`) and the frontmatter-contract spec:

```yaml
caller-options:
  venue: [inline, delegated]      # venues this skill supports
  modes: [quick, deep]            # named paths; omit if single-mode
  default-policy: ask             # ask | recommend | auto
```

The frontmatter is **metadata** — the harness does not execute it; it is read by audit tooling and by humans. Behavior lives in the opt-in block + `protocol.yon`. **Per-skill frontmatter is canonical** for that skill's dimensions; [`references/CANDIDATES.md`](references/CANDIDATES.md) is a derived index.

## Depth & safety

- **Depth-1 only.** COP-spawned sub-agents must not delegate again. Every primed brief carries a `COP-RESOLVED` marker block with `depth: 1`; the receiving sub-agent runs its skill — and any COP participant it triggers — `inline`, which closes the depth-2 path. No harness signal detects sub-agent nesting, so the marker *is* the mechanism.
- **No orchestrator nesting.** Self-orchestrating skills are inline-forced.
- **Inspect before accept.** Delegated output is inspected (diff/changed paths), never accepted on narrative alone — reuses `orchestrate-mode`'s discipline.

## Platform mapping

COP runs on every runtime, but two steps need a runtime-specific form:

- **Surface (step 4)** — Claude Code: `AskUserQuestion`. Codex, or any runtime without a structured-question tool: present the options + recommendation in prose and wait for the caller's reply. The agent-caller path (visible pick) is already runtime-agnostic.
- **Execute `delegated`/`fan-out` (step 5)** — resolve the capability the current runtime actually provides. Use proven worktree isolation when available. When workers share a filesystem or working tree, read-only work may still fan out; code-changing work requires disjoint write scopes and explicit shared-state coordination, otherwise serialize it or run `inline`. Never infer isolation from a vendor or tool name.

Triage, Enumerate, Assess, and inline Execute are runtime-agnostic.

## Standalone use

`/caller-options <task>` runs the protocol ad-hoc on a task or a named skill, with no opt-in block involved — useful for a one-off routing decision or to smoke-test the protocol.

## Boundary

Not a session mode — for that use [`orchestrate-mode`](../orchestrate-mode/SKILL.md) (dispatch-only) or [`multi-agent-mode`](../multi-agent-mode/SKILL.md) (lead + helpers). COP routes a *single skill invocation*. COP *uses* [`insight-assess`](../insight-assess/SKILL.md) to evaluate 3+ options — it does not replace it.

**When `orchestrate-mode` or `multi-agent-mode` is active, the mode owns delegation** — COP drops the Venue dimension and surfaces only Mode; the orchestrator decides whether the skill runs in a worker. This avoids COP and an active orchestrator both trying to route the same invocation.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
