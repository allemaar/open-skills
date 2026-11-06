# insight-explore

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You know the problem but have not chosen how to solve it. The skill separates requirements from preferences and searches through different lenses, such as a familiar pattern, a performance-oriented approach and a minimal approach, before comparing the feasible candidates.

Compare the entire candidate set on developer experience, robustness, timeline and alignment. Recommend a winner only if evidence supports one; otherwise explain the constrained or unresolved outcome, search scope and decisive gap.

## Where it fits

Use insight-explore before committing to a direction. Insight-assess evaluates established options in greater depth, and plan-create designs the chosen implementation.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- You want a brainstorm of ways to solve a problem.
- You need plausible alternatives before committing.

## When not to use it

- You have fixed options to evaluate; use insight-assess.
- You need a detailed implementation plan; use plan-create.

## How to use it

Start with a concrete request. For example:

```text
/insight-explore Explore ways to add offline support to this app, keeping existing authentication and a two-week delivery constraint in view.
```

## Flow

1. Clarify constraints, requirements, and preferences.
2. Generate distinct approaches, including standard, performance-oriented, and minimal options where useful.
3. Collect every actual feasible candidate from the lenses and justified additions; compare the complete set on developer experience, robustness, timeline and alignment. Keep bounded-search evidence for single-option, no-feasible-option or unresolved outcomes without inventing alternatives.
4. Recommend a supported option or report a constrained or unresolved outcome, then suggest the next useful step.

## Common questions

**What if the bounded search finds fewer than three feasible options?**

Report the actual two-, one- or zero-option result and its evidence and gaps. Do not invent options or a winner to meet a count.

## It is working when

- The result distinguishes constraints and compares all actual candidates rather than only the first three.
- A recommendation is supported by the comparison, or the unresolved outcome and decisive gap are explicit.

## Subagents

Specifies ideation and comparison, with no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Distinct options, comparison, recommendation, and proposed next step; no code or implementation plan.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-explore/SKILL.md](../../skills/insight-explore/SKILL.md)
- [skills/insight-explore/protocol.yon](../../skills/insight-explore/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
