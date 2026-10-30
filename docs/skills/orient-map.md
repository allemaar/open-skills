# orient-map

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Show change since a last look and the shape of the work.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask what changed
- See the current branch trajectory

## When not to use it

- A detailed roadmap or progress estimate

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/orient-map what changed in this project since my last look?
```

## Flow

1. Name the subject and last-look anchor if available
2. Gather bounded read-only evidence
3. Determine the delta and done-to-next trajectory
4. Return the appropriate visual or agent record with evidence limits

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh map and delta.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-map/SKILL.md](../../skills/orient-map/SKILL.md)
- [skills/orient-map/protocol.yon](../../skills/orient-map/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
