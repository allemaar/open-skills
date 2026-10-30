# orient-gaps

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Identify blockers, open choices, loose ends and inferred gaps.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask what is stuck
- Check claims against evidence with --audit

## When not to use it

- A full progress estimate or roadmap

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/orient-gaps what is blocking this project?
```

## Flow

1. Name the subject and optional audit mode
2. Gather evidence through the required bounded read-only worker
3. Separate confirmed blockers from inferred gaps
4. Return the consumer-appropriate result and evidence limits

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh gap and blocker orientation.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-gaps/SKILL.md](../../skills/orient-gaps/SKILL.md)
- [skills/orient-gaps/protocol.yon](../../skills/orient-gaps/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
