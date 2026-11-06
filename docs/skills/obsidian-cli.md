# obsidian-cli

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want to search, open or operate on a note in a running Obsidian instance. This skill uses the live CLI and its current help, with vault and file targeting appropriate to the command.

For a mutation it resolves the intended vault and exact vault-relative path, inspects current content and rechecks the target before acting. It then reads back the artifact and reports the actual delta.

## Where it fits

Use it for actions requiring the running app. Obsidian-markdown covers raw Markdown editing without a live session.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Search or open a note
- Run a live vault operation

## When not to use it

- Raw Markdown editing that needs no running application

## How to use it

Start with a concrete request. For example:

```text
/obsidian-cli In the selected vault, open Projects/Atlas/plan.md and show its current tasks.
```

## Flow

1. Confirm Obsidian is running and inspect current CLI help
2. Resolve the intended vault and exact path for mutations, including an explicitly selected active note; recheck identity before acting.
3. Run the appropriate command with exact arguments
4. Read back the affected artifact and actual delta, or report the unavailable capability.

## Common questions

**Why not rely on the active note for a change?**

Focus can move and a basename may resolve ambiguously. An explicitly requested active note can be used after its identity is checked.

## It is working when

- The requested live action or result is returned, with the actual affected note and change identified for a mutation.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

The requested live Obsidian action or search result.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/obsidian-cli/SKILL.md](../../skills/obsidian-cli/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
