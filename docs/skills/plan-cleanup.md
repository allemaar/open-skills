# plan-cleanup

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A completed plan left temporary files and you want to remove only those no longer needed. The skill identifies candidates, resolves their physical targets and presents the irreversible removal before acting on the confirmed set.

Cleanup resolves physical targets and link containment, then presents irreversible effects for confirmation. Tracked removals and any commit must preserve unrelated work and stay within the authorized contents.

## Where it fits

Use this for confirmed disposable leftovers after a plan, not new implementation work.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A completed plan left scaffolding.
- You want verified artifact cleanup.

## When not to use it

- You want new work or removal of needed project files.

## How to use it

Start with a concrete request. For example:

```text
/plan-cleanup Review the completed migration plan’s temporary scaffolding and propose only files that are no longer needed by the project.
```

## Flow

1. Identify candidates and determine whether they remain needed.
2. Resolve exact physical targets and prove containment, including recursive links.
3. Present irreversible effects and obtain confirmation.
4. Remove only confirmed artifacts; for tracked removals, commit only when the exact contents are authorized and unrelated index and worktree state is preserved.
5. Verify and report removals and skipped Git work; push only with separate authorization.

## Common questions

**Does cleanup also push a commit?**

A push needs separate authorization; report skipped Git work and retained artifacts.

**What if a tracked removal would disturb other staged work?**

Stop the Git portion and report the removals already performed and the work skipped; do not commit unrelated index changes.

## It is working when

- Candidates are classified as removed, retained or unresolved with reasons.
- The report identifies confirmed effects and any authorized commit or skipped Git operation.

## Subagents

Cleanup does not prescribe delegation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Removed or retained artifacts, any authorized cleanup commit, and unresolved gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-cleanup/SKILL.md](../../skills/plan-cleanup/SKILL.md)
- [skills/plan-cleanup/protocol.yon](../../skills/plan-cleanup/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
