---
name: orchestrate-mode
description: >
  Activate orchestrator mode in the current session: the lead agent dispatches governed worker subagents and does not execute concrete work directly. Trigger on /orchestrate-mode, "become an orchestrator", "orchestrator mode", "delegate everything", or "do not execute". Use multi-agent-mode instead when the lead agent should still work directly while delegating helper slices.
disable-model-invocation: true
visibility: public
triggers:
  - "/orchestrate-mode"
  - "become an orchestrator"
  - "orchestrator mode"
  - "delegate everything"
  - "do not execute"
next-skills:
  - skill: handoff
    phrase: "/handoff"
    why: "Package a worker slice into a cold-agent brief to dispatch under the orchestrator"
  - skill: cold-review
    phrase: "/cold-review"
    why: "Have fresh agents inspect the artifacts the dispatched workers produced"
  - skill: verify
    phrase: "/verify"
    why: "Gate the assembled worker output against intent before declaring done"
---

# /orchestrate-mode

Switch the current session into pure orchestrator behavior. The lead agent coordinates, dispatches, reviews, and integrates. It does not edit files, run code, make commits, or perform concrete work directly while this mode is active.

## Platform mapping

Resolve the workspace behavior the current runtime actually proves:

- Claude Code: use the `Agent` tool with `isolation: "worktree"` for concrete worker tasks.
- Codex and other runtimes: inspect the surfaced worker contract. Do not infer isolation from `spawn_agent`, another API name, or vendor identity.
- Proven isolated workspaces: parallel code-changing workers may use disjoint worktrees.
- Shared filesystem or working tree: read-only work may run concurrently. Code-changing workers require disjoint write scopes plus explicit coordination of branch selection, staging, commits, generated files, and cleanup; otherwise serialize them. If neither isolation nor a safe shared-workspace plan exists, stop and report that concrete work cannot be dispatched safely.

## Activation announcement

When invoked, immediately announce:

> Orchestrator mode active.
>
> I will dispatch only, not execute. I will resolve whether this runtime isolates workers or shares their filesystem, assign safe worker boundaries accordingly, and inspect output before accepting it. Max 3 parallel workers without confirmation; depth limit 1. To exit, say "exit orchestrator mode" or switch to another mode.

Then ask for the work item if none was provided.

## Mode switching

- This is a persistent session mode until the user exits it, restarts the session, or explicitly switches to another mode.
- If the user invokes `multi-agent-mode`, announce the switch: the lead agent is now allowed to work directly and delegate helper slices.
- If the user exits orchestrator mode without choosing another mode, return to normal single-agent behavior.
- Latest explicit mode wins. Do not maintain a hidden mode stack.

## Rules

- MUST spawn a worker under a proven safe workspace boundary for any concrete work action: file edits, code execution, multi-step implementation, migrations, commits, or test fixing.
- MUST provide each worker a self-contained brief: goal, scope, owned files or subsystem, explicit non-goals, acceptance criteria, verification command, and expected report.
- MUST state the worker workspace path and whether it is isolated or shared when spawning a worker.
- MUST inspect each worker's diff, changed paths, or concrete output before accepting the result.
- MUST independently recompute any verification figure before acting on it. Worker self-reports (word counts, row counts, sweep counts, arithmetic) and reviewer findings are both fallible. Recompute, do not relay.
- MUST keep worker ownership disjoint. Do not let two workers edit the same files or tightly coupled files in parallel.
- MUST serialize code-changing workers when a shared filesystem makes branch, staging, generated-output, or cleanup mutations unsafe to overlap.
- MUST surface worker failures, uncertainty, or missing evidence to the user.
- MUST NOT edit files, run code, or commit directly while this mode is active.
- MUST NOT spawn more than 3 parallel workers without explicit user confirmation.
- MUST NOT recurse beyond depth 1. Workers must not spawn their own workers.
- MUST NOT delegate ordinary factual questions. Answer factual or conversational questions directly.

## Worker prompt baseline

Every concrete worker brief should include:

```text
You are one worker in an orchestrated task. You are not alone in the codebase. Do not revert or overwrite changes from other workers. Stay within your assigned scope.

Goal:
Scope / owned files:
Do not touch:
Relevant context:
Acceptance criteria:
Verification to run:
Final report must include: changed paths, commands run, result, cross-scope references you chose to leave for the consolidation step, unresolved risks.
```

For code-changing workers, add runtime-specific workspace checks:

- Verify the current branch and workspace before editing.
- Before the first write, confirm whether the assigned workspace is isolated or shared. In an isolated workspace, verify every written path resolves inside it. In a shared workspace, recheck branch and status before each mutation and stay inside the assigned disjoint pen.
- Check for unexpected existing changes and report them before touching files.
- Commit or clearly preserve completed work according to the orchestrator's instructions.
- Before any cleanup, inspect for uncommitted changes and refuse destructive cleanup if work is present.

For mass-refactor workers, add to the "Do not touch" list by default:

- Files matching `*.generated.*` or any `*-gen.*` codegen output — the orchestrator regenerates these after consolidating source-of-truth changes.
- Files outside your owned scope, even if they reference your scope. Report cross-scope coupling as a single line in your final report; the consolidation worker fixes those.

## Wave consolidation

When workers run in proven isolated worktrees (`isolation: "worktree"` on Claude Code, or another runtime mechanism with equivalent evidence), each worktree is created from a commit. Uncommitted changes in another worktree are not visible to a freshly spawned worker.

This means: if Wave 2 depends on filesystem state Wave 1 produced (a directory rename, a regenerated file, an updated path constant), Wave 2 workers spawning from `main`'s HEAD will not see those changes unless the orchestrator consolidates them first.

For isolated worktrees, the integration pattern between waves is to spawn a consolidation worker whose job is to:

1. Generate a patch from each prior-wave worker's worktree:
   ```bash
   cd <worktree-path>
   git add -A
   git diff --staged --binary > <tmp>/wN.patch
   git reset
   ```
2. Apply each patch to main without committing:
   ```bash
   cd <main-repo>
   git apply --index --whitespace=fix <tmp>/wN.patch
   ```
3. Apply any cross-scope coupling fixes flagged by the wave's workers (e.g., a path constant in worker B that points into worker A's renamed directory).
4. Run codegen scripts on main when the next wave's edits depend on regenerated output from prior waves (e.g., `npm run sync:domains` after a spec-directory rename).
5. Leave changes staged but uncommitted unless the user has approved per-wave commits.

The consolidation worker targets the integration worktree by necessity. Treat it as a distinct worker spawn, not as direct orchestrator action. In a runtime where all workers already share one worktree, do not run this patch-consolidation recipe; serialize shared Git mutations and integrate directly from the assigned pens.

Skip the consolidation step between waves only when wave scopes are fully disjoint AND no later wave depends on filesystem state any earlier wave produced.

## Final cold-review gate

For orchestrated work with blast radius above roughly 50 files OR with ambiguous match patterns (where regex over-match is a real risk), spawn one final reviewer agent after all waves consolidate. Brief it as:

- A separate worker with NO planning context — pass it the diff and the goal description, not the plan or the worker reports.
- Read-only and advisory — no edits.
- Adversarial — find what looks wrong, half-done, inconsistent, or suspicious.

The orchestrator's own verification checks and the workers' verification checks tend to share patterns, and therefore share blind spots. A reviewer with fresh context breaks that symmetry and catches what the orchestrator rationalized as correct.

Inspect the cold reviewer's report carefully. Treat any "FIX-FIRST" or "BLOCK" verdict as a real gap, not a misunderstanding — dispatch a follow-up worker to close the gap before declaring done.

Spot-check the reviewer's findings, not only the work under review. A reviewer can miscount or misread. Confirm a flagged defect is real before dispatching a fix, and sample a clean verdict before trusting it. The orchestrator's own checks, the workers' checks, and the reviewer's checks are all fallible in different ways.

When a fix targets a value that appears in more than one place — a number repeated in a summary and a detail block, a name reused across files — the fix-worker brief must instruct enumerate-and-fix-all, not fix-one. An incomplete fix that corrects one occurrence and leaves a stale duplicate is a recurring failure mode. Brief the worker to find every occurrence of the old value and fix each one.

## When to use

Use orchestrator mode when the session should preserve coordination context and avoid filling the lead agent's context with implementation details, especially for multi-step or parallelizable work.

Use `multi-agent-mode` instead when the lead agent should still execute some work directly while using helper agents opportunistically.

Use `handoff` instead when the goal is to transfer the whole task to a fresh session as an artifact rather than switch behavior in the current session.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

