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

Before confirmation, establish the exact physical target of each candidate using no-follow leaf and parent-chain identity, and prove it remains within the project. For recursive removal, enumerate links and prove containment. Stop if proof is unavailable or a redirect escapes or is unknown. Present the exact physical target list and irreversible effects to the user:

> "Found the following planning artifacts and exact physical targets; removal is irreversible:
> - [file 1]
> - [file 2]
>
> Remove all? (y / skip [filename] / cancel)"

On confirmation:

- Immediately before each deletion, recheck that the target and proof match the physical identity shown and approved. Stop on changed identity, missing proof, a forbidden redirect, or an unapproved target.
- Remove each confirmed artifact
- For git repos: use `git rm` if tracked and its exact index effects are proven to preserve unrelated staged and worktree changes; otherwise stop the Git portion. Use `rm` if untracked.
- Never remove files outside the current project scope

**Gate:** do not remove any file not explicitly identified in Phase 1. Do not remove files the user skipped.

## Phase 3 — Verify and Commit

1. Confirm each artifact is gone — list what was removed.
2. If in a git repo and files were tracked: establish the exact authorized removal paths and proposed commit contents. Commit with message `chore: remove planning artifacts` only if the actual effects match the authorization and preserve unrelated index and worktree state. If that cannot be proven, stop the Git portion and report what was already removed and skipped.
3. Push only when separately authorized and the exact destination and outgoing effects are bound to that authorization. Prior pushes alone do not authorize a push.

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

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): apply its signal taxonomy and threshold to this run; surface any surviving proposal for handler approval. Conservative — silent otherwise. Never auto-apply.
