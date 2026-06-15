# Venue Heuristics — delegate vs. inline vs. fan-out

The rubric COP's **Phase 2 (Enumerate)** applies to decide which venues are viable for a triggered skill. The conservative default is **inline** — a venue is widened to `delegated` or `fan-out` only when the signals clearly favor it.

## Delegate to a sub-agent when

- **Heavy throwaway reads** — the skill reads widely but only its conclusion matters (e.g. `investigate`, a critique of a large target). Delegating keeps that reading out of the main context.
- **Bounded artifact output** — the skill produces a self-contained result (a report, a verdict, a file).
- **File writes** — the work mutates files and benefits from worktree isolation.
- **Large main context** — the active agent's context is already big; offloading protects against context rot.

## Fan-out (N sub-agents) when

- The work is **already N independent units** *and* the skill does not already parallelize internally. Reuse `orchestrate-mode`'s wave-consolidation pattern between waves.

## Keep inline when

- **Needs the live conversation** — the skill's quality depends on context the active agent holds; a sub-agent would be starved (documented failure mode #1: sub-agent context starvation).
- **Trivial** — delegation overhead exceeds the work itself.
- **Interactive** — the skill asks the caller questions mid-run.
- **Caller needs the reasoning** — not just the final result.

## Hard rules

- **Never-delegate list** — `reflect`, `verify`, `insight-retro`, `plan-*`, `yon-writer`, `obsidian-markdown`. These need live context or are conversational/interactive; venue is `inline` only.
- **Self-orchestrating skills are inline only.** A skill that spawns its own sub-agents (`cold-review`, `skills-audit`, `improve-codebase-architecture`) must not be wrapped in a `delegated` venue — COP-subagent → its-own-subagent = depth 2, violating the depth-1 limit. COP never wraps an orchestrator.
- **Depth guard** — when a resolved-invocation marker is present the invocation is itself COP-spawned; `delegated`/`fan-out` are dropped regardless of the signals above.

## How to read the signals

A skill rarely matches one signal cleanly. Weigh them: a strong delegate signal (heavy throwaway reads) with no inline signal → `delegated`. Any inline hard rule → `inline`, no matter the delegate signals. A genuine tie → default `inline` (rule `conservative-venue`) and let COP's triage surface the choice if the task makes it material.
