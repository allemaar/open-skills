# yon-write

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Encode source content as YON while preserving meaning and uncertainty.

**Family:** YON. **Subagents:** No subagent step prescribed.

## When to use it

- Convert a workflow to YON
- Create an agent instruction record

## When not to use it

- Simple configuration, API data or short messages better served by other formats

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/yon-write encode this workflow as YON
```

## Flow

1. Choose profile, format and document kind
2. Encode the source without resolving its uncertainty
3. Validate required fields, references, blocks and separators
4. Present pure records in a file or explain choices in conversation

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Validated YON records.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/yon-write/SKILL.md](../../skills/yon-write/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
