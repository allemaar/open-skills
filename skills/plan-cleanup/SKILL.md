---
name: plan-cleanup
description: "Post-execution cleanup — remove planning artifacts and tech debt left behind after a plan runs. Trigger when the user runs /plan-cleanup, says 'clean up artifacts', 'remove the plan file', or 'no tech debt'. Not /plan-evolve (plans the next version) — plan-cleanup only removes leftovers and adds no new work."
disable-model-invocation: true
visibility: public
self-improvable: true
triggers:
  - "/plan-cleanup"
  - "clean up artifacts"
  - "remove the plan file"
  - "no tech debt"
next-skills:
  - skill: github-sync
    phrase: "/github-sync"
    why: "Commit and push the cleaned tree once artifacts and tech debt are removed"
  - skill: insight-retro
    phrase: "/insight-retro"
    why: "Run a retrospective on the completed work now that leftovers are cleared"
  - skill: plan-evolve
    phrase: "/plan-evolve"
    why: "Treat the shipped work as v1 and plan the next iteration"
---

# /plan-cleanup

Remove planning artifacts and tech debt after a plan has been executed. No new work. No scope additions. Just cleanup.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Phase 1 — Identify Artifacts

Scan for artifacts left behind by the planning and execution cycle:

**Planning docs** (created by `/plan-create`, `/plan-phases`, `/plan-deep-dive`):

- `PLAN.md`
- `implementation_plan.md`
- `task.md` (if created as a plan artifact, not a pre-existing project file)
- Any `*-plan.md` files in the project root

**Execution scaffolding** (created by `/plan-execute` or setup steps):

- Temp files, stub files, or files explicitly marked as temporary in the plan
- Any file whose sole purpose was to scaffold or support the plan run

**Tool artifacts:**

- `.claude/` directories created incidentally in skill or tool folders (not the user's project `.claude/`)

For each candidate, verify: **is this file needed by the project going forward?** If yes, leave it. If it exists only because of the planning cycle, it's an artifact.

**Gate:** list every artifact found before removing anything. If none found, declare "No artifacts found — workspace is clean" and stop.

## Phase 2 — Confirm and Remove

Present the artifact list to the user:

> "Found the following planning artifacts:
> - [file 1]
> - [file 2]
>
> Remove all? (y / skip [filename] / cancel)"

On confirmation:

- Remove each confirmed artifact
- For git repos: use `git rm` if the file is tracked, `rm` if untracked
- Never remove files outside the current project scope

**Gate:** do not remove any file not explicitly identified in Phase 1. Do not remove files the user skipped.

## Phase 3 — Verify and Commit

1. Confirm each artifact is gone — list what was removed.
2. If in a git repo and files were tracked: commit with message `chore: remove planning artifacts`.
3. Push if the user's workflow includes pushing (check if prior commits in this session were pushed).

**Terminal declaration (required):**

- `Cleanup complete — [N] artifacts removed.`
- `Cleanup complete — workspace was already clean.`
- `Cleanup halted — [reason]. Removed: [list]. Skipped: [list].`

## Rules

- MUST list artifacts before removing — never silently delete
- MUST verify each candidate is a planning artifact, not a project file
- MUST NOT remove files outside the current project scope
- MUST NOT remove files the user explicitly skipped
- MUST end with a terminal declaration

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
