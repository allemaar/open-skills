# next-skills

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Offers declared successor skills without running them automatically.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- A participating skill completes.
- You want to preview recommended successors.

## When not to use it

- You need a full installed-skills inventory.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/next-skills Show the next skills for verify.
```

## Flow

1. Read the declared successor list.
2. Stop silently if it is empty.
3. Offer phrases and reasons, and activate only on selection.

## Subagents

The recommendation protocol does not spawn agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An optional list of successor choices.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/next-skills/SKILL.md](../../skills/next-skills/SKILL.md)
- [skills/next-skills/protocol.yon](../../skills/next-skills/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
