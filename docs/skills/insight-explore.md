# insight-explore

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Generates distinct approaches to a problem and compares them before a plan is chosen.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- You want a brainstorm of ways to solve a problem.
- You need plausible alternatives before committing.

## When not to use it

- You have fixed options to evaluate; use insight-assess.
- You need a detailed implementation plan; use plan-create.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-explore Explore three ways to add offline support to this app.
```

## Flow

1. Clarify constraints, requirements, and preferences.
2. Generate distinct approaches, including standard, performance-oriented, and minimal options where useful.
3. Compare on developer experience, robustness, timeline, and alignment.
4. Recommend a winner and suggest the next step.
5. Compare the full actual candidate set, including additions; report evidenced single/no-feasible or unresolved outcomes without invented alternatives.

## Subagents

Specifies ideation and comparison, with no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Distinct options, comparison, recommendation, and proposed next step; no code or implementation plan.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-explore/SKILL.md](../../skills/insight-explore/SKILL.md)
- [skills/insight-explore/protocol.yon](../../skills/insight-explore/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
