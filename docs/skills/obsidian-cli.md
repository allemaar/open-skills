# obsidian-cli

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Operate a running Obsidian instance through its CLI.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Search or open a note
- Run a live vault operation

## When not to use it

- Raw Markdown editing that needs no running application

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/obsidian-cli open my project note
```

## Flow

1. Confirm Obsidian is running and inspect current CLI help
2. Select the vault and requested operation
3. Run the appropriate command with exact arguments
4. Inspect the result or report the unavailable capability

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

The requested live Obsidian action or search result.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/obsidian-cli/SKILL.md](../../skills/obsidian-cli/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
