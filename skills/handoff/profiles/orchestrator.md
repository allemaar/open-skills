# Profile: `orchestrator` (UC4 — cold orchestrator dispatch)

A multi-step task delegated to a fresh agent that itself spawns sub-workers (orchestrator pattern). The cold orchestrator splits the work into N slices, dispatches each to a worker, validates worker output, aggregates retros into a single parent retro.

## When to use

- Task is multi-step and at least partly parallelizable
- Each slice has a clean boundary (non-overlapping file scope)
- The cold orchestrator agent has the cost budget for N+1 LLM sessions (orchestrator + workers)

If the task is solo, use `agent` profile. If you want to turn the *current* session into orchestrator mode, use `/orchestrate-mode` instead.

## Subtask flow

**Two paths depending on whether the user supplies subtasks:**

### Path A — user unspecified

LLM auto-decomposes: read the task + references, propose N slices `{slice_name, slice_brief, slice_acceptance}` per slice. Surface the proposal:

> "I propose N slices: [A, B, C]. Adjust, accept, or run `/insight-assess` on this decomposition?"

User accepts → emit brief with `@SUBTASKS` filled in. User can override slice list interactively.

### Path B — user specifies

LLM validates against 5 checks:
1. Each subtask has clear `slice_acceptance`.
2. Slices are non-overlapping in scope (no two workers editing the same file).
3. Slices are independently completable (no hidden cross-dependency forcing serialization).
4. The parallelism is real (slices won't all bottleneck on the same shared resource).
5. Each slice fits within `time_budget` divided by topology branching factor.

**All checks pass** → emit brief.
**Any check fails** → emit specific findings ("Slice B and C both modify `auth.ts` — file race risk") AND auto-invoke `/insight-assess` to weigh: keep user's split with mitigations, merge slices, or re-split. User picks resolution; emit brief.

## Body template

After the universal frontmatter (with `profile: orchestrator`), the body looks like:

````markdown
# Handoff: {short-task-summary}

> [!info]
> Profile: **orchestrator** · Project: **{project}** · Created: **{date}**
> Paste this entire file into a fresh agent session as the opening message.
> You will spawn N workers (one per subtask), validate each, and aggregate retros.

## Task

@TASK
  text="{task}"
  where=[{paths}]
  evidence="{evidence pointer}"

## Outcome required (parent)

@OUTCOME
  acceptance="{parent acceptance sentence}"
  verify=[{parent-level shell commands}]

## Sources

@SOURCES
  required=[
    /c/Projects/younndai/apps/x/y.ts          # parent-level must-understand context — gated
    [[Skills/frontmatter-schema]]             # vault wikilink — gated
  ]
  optional=[
    /c/Projects/younndai/apps/x/z.ts          # surfaced, cold orchestrator reads if needed
  ]

(Canonical schema and tier semantics: [`handoff-execute/references/SOURCES-BLOCK.md`](../../handoff-execute/references/SOURCES-BLOCK.md). For orchestrator profile, `@SOURCES` declares the parent-level sources the orchestrator must read. Per-slice sources go inside each `@SUBTASKS` entry's `slice_brief`.)

## Subtasks

@SUBTASKS
  - slice="{name-1}" | brief="{slice_brief}" | acceptance="{slice_acceptance}"
  - slice="{name-2}" | brief="{slice_brief}" | acceptance="{slice_acceptance}"
  - slice="{name-3}" | brief="{slice_brief}" | acceptance="{slice_acceptance}"

## Orchestration rules

- Spawn each worker in an **isolated workspace** (file-modifying work cannot share filesystem). On Claude Code: `Agent` tool with `isolation: "worktree"`. On other agents: equivalent.
- For long-running workers: kick off in background; react to completion notifications. Do not poll continuously.
- **Inspect each worker's diff before accepting.** Reject narrative-only reports.
- Recurse depth limit: workers must NOT spawn sub-workers. If a slice itself needs splitting, surface to the user as escalation.
- Max parallelism: 3 workers without explicit user confirmation.

## Scope guards

@SCOPE
  forbidden=[{guard strings}]
  time_budget_min={N}

## Ground truth required (parent + per worker)

@GROUND_TRUTH_REQUIRED
  artifacts_modified=true
  git_diff_summary=true
  file_hashes=true

## Sign-off

> [!warning]
> **Aggregated retro file is canonical.** Write your aggregated retro to:
> `$VAULT/Handoffs/{project}/retros/{date}-{slug}-retro.md`
>
> Per-worker retros (worker outputs) should be referenced in `@DELTA_FROM_BRIEF` of the aggregated retro, not filed as separate vault entries. Optionally save them as `{date}-{slug}-retro-{slice_name}.md` if useful for record-keeping.
>
> ALSO emit the aggregated retro as a chat block so the user can paste back for second-assessment.
>
> Your retro MUST include `@GROUND_TRUTH` with the union of all workers' artifacts_modified + git_diff_summary. Narrative-only retros are rejected.
````

## Field defaults specific to this profile

- Minimum `subtasks` count: 2
- `time-budget-min` should accommodate parallel workers (don't divide by N for budget)
- Per-worker briefs are NOT separately filed; they live inside the orchestrator brief's `@SUBTASKS` block
