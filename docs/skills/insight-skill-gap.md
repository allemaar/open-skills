# insight-skill-gap

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Compares recent work with the existing skill index to find reusable patterns that are missing or under-covered.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- You want to know whether recent work exposed a skill gap.
- A retrospective identified patterns worth comparing with existing skills.

## When not to use it

- You want to create or edit a skill now; use skill-smith after choosing a proposal.
- You need a full retrospective of changes and technical debt; use insight-retro.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-skill-gap Check whether the caching work exposed a skill worth adding.
```

## Flow

1. Gather recent work and summarize patterns and technologies.
2. Read the current skill index.
3. Classify patterns as covered, incomplete, or absent and apply reuse criteria.
4. Present a targeted update or new-skill proposal for approval.
5. Only after approval, use skill-smith to create the chosen skills or apply targeted updates.

## Subagents

Specifies a scan and proposal flow and no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Coverage findings and justified proposals, followed by skill creation or targeted updates only when approved.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-skill-gap/SKILL.md](../../skills/insight-skill-gap/SKILL.md)
- [skills/insight-skill-gap/protocol.yon](../../skills/insight-skill-gap/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
