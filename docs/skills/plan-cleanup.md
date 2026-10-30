# plan-cleanup

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Removes confirmed disposable planning leftovers after execution.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A completed plan left scaffolding.
- You want verified artifact cleanup.

## When not to use it

- You want new work or removal of needed project files.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/plan-cleanup Clean up the completed plan's temporary artifacts.
```

## Flow

1. Identify candidates and determine whether they remain needed.
2. Resolve exact physical targets and prove containment, including recursive links.
3. Present irreversible effects and obtain confirmation.
4. Remove only confirmed artifacts; for tracked removals, commit only when the exact contents are authorized and unrelated index and worktree state is preserved.
5. Verify and report removals and skipped Git work; push only with separate authorization.

## Subagents

Cleanup does not prescribe delegation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Removed or retained artifacts, any authorized cleanup commit, and unresolved gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-cleanup/SKILL.md](../../skills/plan-cleanup/SKILL.md)
- [skills/plan-cleanup/protocol.yon](../../skills/plan-cleanup/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
