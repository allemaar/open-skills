# insight-retro

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A substantial implementation is finished, but its effects and loose ends are spread across files, checks and conversation. The retrospective starts with an inventory of what actually changed, then uses it to inspect documentation, reusable patterns, difficulties and technical debt.

The retrospective reports observations and concrete follow-ups; fixes are separate work. Gate outcomes and unverified acceptance criteria remain visible, and a misleading documentation finding cites both the claim and contradictory code.

## Where it fits

Use insight-retro for a broad post-implementation account; insight-skill-gap focuses specifically on candidate skill improvements.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- A substantial implementation has finished and its effects should be recorded.
- You need to check documentation, reusable knowledge, difficulty, and technical debt.

## When not to use it

- You only want candidate skill gaps; use insight-skill-gap.
- There is no reliable inventory of completed changes yet.

## How to use it

Start with a concrete request. For example:

```text
/insight-retro Review the completed authentication rollout using the approved plan, current diff and verification results; identify documentation drift and follow-up debt.
```

## Flow

1. Map changed packages, files, interfaces, and effects.
2. Resolve actual repository documentation conventions and catalog scope; missing sidecar conventions or indexes do not establish defects or an empty library.
3. Extract reusable patterns and recommend skill, documentation, or no action.
4. Audit documentation and knowledge items against the change map.
5. Assess execution difficulty and technical debt.
6. Return findings with gate status and unverified criteria.

## Common questions

**Is a missing YON sidecar automatically a documentation defect?**

No. First establish the repository's documentation conventions; apply sidecar thresholds only when that convention is adopted or requested.

**What if the skill catalog cannot be found?**

Keep skill proposals provisional and state that duplicate coverage is incomplete; a missing index is not evidence of an empty library.

## It is working when

- The report ties documentation, patterns and debt to the actual changed scope and names actionable follow-ups.
- Skipped gates, unverified criteria and missing catalog coverage are disclosed rather than implied clean.

## Subagents

Specifies a retrospective workflow and no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Blast-radius summary, pattern and documentation findings, knowledge updates, difficulty notes, technical debt, and gate status.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-retro/SKILL.md](../../skills/insight-retro/SKILL.md)
- [skills/insight-retro/protocol.yon](../../skills/insight-retro/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
