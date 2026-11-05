# github-sync

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Reviews session changes, obtains approval for commits, then commits and pushes.

**Family:** Git & sync. **Subagents:** No subagent step prescribed.

## When to use it

- You want selected changes committed and pushed.
- The destination and outgoing commits need review.

## When not to use it

- You want commit-only work or partial staging.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/github-sync Commit and push this session's approved changes.
```

## Flow

1. Inspect changes, destination and all outgoing commits.
2. Group intended changes and exclude unrelated or unsafe files.
3. Present the destination, complete outgoing set and exact full ordered commit messages; obtain explicit approval for that plan.
4. Stage approved paths, check messages and attribution, and permit at most one authorized exact-message correction before stopping on persistent mismatch; push only the approved candidate and report.
5. Distinguish no new commit from outgoing history; push-only work retains its separate owner and exact authorization.

## Subagents

The workflow does not require subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Approved commits pushed or a reported stop.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/github-sync/SKILL.md](../../skills/github-sync/SKILL.md)
- [skills/github-sync/protocol.yon](../../skills/github-sync/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
