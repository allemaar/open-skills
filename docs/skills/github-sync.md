# github-sync

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A working tree contains the intended changes alongside files that should stay local, and the branch may already have unpushed commits. The skill groups the intended changes, identifies exclusions and shows the exact destination, history, paths and full messages for approval before staging.

The approval plan contains exact paths and full commit messages as well as the destination and existing outgoing identities. After approval, stage only listed paths, verify the staged set and committed messages, and recheck destination and history before pushing. Drift or a failed push stops the flow.

## Where it fits

Use github-sync for the combined commit-and-push flow. Commit-only, partial staging and push-only requests follow their own workflows.

**Family:** Git & sync. **Subagents:** No subagent step prescribed.

## When to use it

- You want selected changes committed and pushed.
- The destination and outgoing commits need review.

## When not to use it

- You want commit-only work or partial staging.

## How to use it

Start with a concrete request. For example:

```text
/github-sync Review this session's changes and propose an ordered commit-and-push plan for the current branch, including the actual destination and outgoing history.
```

## Flow

1. Inspect changes, destination and all outgoing commits.
2. Group intended changes and exclude unrelated or unsafe files.
3. Present the destination, complete outgoing set and exact full ordered commit messages; obtain explicit approval for that plan.
4. Stage approved paths, check messages and attribution, and permit at most one authorized exact-message correction before stopping on persistent mismatch; push only the approved candidate and report.
5. Distinguish no new commit from outgoing history; push-only work retains its separate owner and exact authorization.

## Common questions

**Does approving a subject approve a later commit body or trailer?**

No. Approval covers the complete message shown, and the committed message must match it before push.

**What if there are no new changes but older commits remain unpushed?**

Report the outgoing history and destination. Do not invent a commit or implicitly push through this combined flow.

## It is working when

- The approved plan identifies the exact destination, outgoing history, staged paths, commit messages and exclusions.
- The report records commits and push results, or the specific drift or failure that stopped the operation.

## Subagents

The workflow does not require subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Approved commits pushed or a reported stop.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/github-sync/SKILL.md](../../skills/github-sync/SKILL.md)
- [skills/github-sync/protocol.yon](../../skills/github-sync/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
