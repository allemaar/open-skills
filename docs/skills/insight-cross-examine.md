# insight-cross-examine

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Routes a subject or option set through depth-scaled deliberation, discovers angles, critiques and assesses choices, then recommends.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want a recommendation across candidates or a complex decision.
- You want discovery and critique combined without running every method by default.

## When not to use it

- You want only one critique, assessment, or brainstorm; use that focused skill.
- You want phase-by-phase inspection of an existing plan; use plan-deep-dive.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-cross-examine Weigh these vendor options and recommend one.
```

## Flow

1. Classify the question and evidence context; select depth.
2. Discover angles inline at the selected depth.
3. Run only selected critique, assessment, or one relevant specialist method.
4. For sets, compare consistently and consider justified hybrids.
5. Report recommendation, alternatives, uncertainty, and coverage.

## Subagents

Normal sub-skills run inline. Large-set fan-out, L5 depth, and extra reassessment are offered for explicit consent and never automatic.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A decision surface with recommendation, alternatives, decisive assumptions, coverage, and analysis trail.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-cross-examine/SKILL.md](../../skills/insight-cross-examine/SKILL.md)
- [skills/insight-cross-examine/protocol.yon](../../skills/insight-cross-examine/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
