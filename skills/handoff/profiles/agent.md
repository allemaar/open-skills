# Profile: `agent` (UC1 — solo cold dispatch)

A self-contained task delegated to a fresh single agent in a new session. The cold agent runs the work end-to-end (plan → execute → verify → fix → retro) and reports back via the canonical retro file + chat block.

## When to use

- Task is bounded (one logical concern, one acceptance criterion)
- No need to split into parallel sub-tasks
- A single LLM session can complete it within the time budget

If the task is multi-step and parallelizable, use the `orchestrator` profile instead.

## Body template

After the universal frontmatter (see router `SKILL.md`), the body looks like:

````markdown
# Handoff: {short-task-summary}

> [!info]
> Profile: **agent** · Project: **{project}** · Created: **{date}**
> Paste this entire file into a fresh agent session as the opening message.

## Task

@TASK
  text="{task}"
  where=[{paths}]
  evidence="{evidence pointer}"

## Outcome required

@OUTCOME
  acceptance="{acceptance sentence}"
  verify=[{shell commands}]

## Sources

@SOURCES
  required=[
    /c/Projects/younndai/apps/x/y.ts          # must-understand context — gated
    [[Skills/frontmatter-schema]]             # vault wikilink — gated
  ]
  optional=[
    /c/Projects/younndai/apps/x/z.ts          # surfaced, cold agent reads if needed
    [[Architecture/overview]]                 # background reading
  ]

(Canonical schema and tier semantics: [`handoff-execute/references/SOURCES-BLOCK.md`](../../handoff-execute/references/SOURCES-BLOCK.md). Empty `required=[]` drops `/handoff-execute` into advisory mode — no gate.)

## Scope guards

@SCOPE
  forbidden=[{guard strings}]
  time_budget_min={N}

## Ground truth required

@GROUND_TRUTH_REQUIRED
  artifacts_modified=true
  git_diff_summary=true
  file_hashes=true

## Sign-off

> [!warning]
> **Retro file is canonical.** Write your retro to:
> `$VAULT/Handoffs/{project}/retros/{date}-{slug}-retro.md`
>
> ALSO emit it as a chat block — full content if <500 lines, otherwise summary + path —
> so the user can paste into the originating session for second-assessment.
>
> Your retro MUST include `@GROUND_TRUTH` with `artifacts_modified` (paths + hashes) and `git_diff_summary`. Narrative-only retros are rejected.
````

## Field defaults specific to this profile

- `time-budget-min: 60` (override per-task)
- No `@SUBTASKS` block (this profile is solo)
- No `@CONTINUATION` block (this profile is fresh-start, not continuation)
