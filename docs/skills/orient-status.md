# orient-status

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Show current position, remaining work and an estimated completion band.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask how far along a task is
- Rebuild context with --resume

## When not to use it

- A detailed blocker audit or forward roadmap

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/orient-status where are we on this project?
```

## Flow

1. Name the subject and any resume context
2. Gather bounded read-only evidence
3. Assess position, remaining work and ETA uncertainty
4. Return the appropriate result with source limits

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh status and banded ETA when evidence supports one.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-status/SKILL.md](../../skills/orient-status/SKILL.md)
- [skills/orient-status/protocol.yon](../../skills/orient-status/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
