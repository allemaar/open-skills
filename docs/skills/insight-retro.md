# insight-retro

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Reviews significant completed implementation work to map impact, capture patterns, check documentation, and list follow-up work.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- A substantial implementation has finished and its effects should be recorded.
- You need to check documentation, reusable knowledge, difficulty, and technical debt.

## When not to use it

- You only want candidate skill gaps; use insight-skill-gap.
- There is no reliable inventory of completed changes yet.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-retro Review the completed authentication rollout and identify follow-up work.
```

## Flow

1. Map changed packages, files, interfaces, and effects.
2. Extract reusable patterns and recommend skill, documentation, or no action.
3. Audit documentation and knowledge items against the change map.
4. Assess execution difficulty and technical debt.
5. Return findings with gate status and unverified criteria.
6. Resolve actual repository documentation conventions and catalog scope; missing sidecar conventions or indexes do not establish defects or an empty library.

## Subagents

Specifies a retrospective workflow and no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Blast-radius summary, pattern and documentation findings, knowledge updates, difficulty notes, technical debt, and gate status.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-retro/SKILL.md](../../skills/insight-retro/SKILL.md)
- [skills/insight-retro/protocol.yon](../../skills/insight-retro/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
