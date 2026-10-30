# insight-test-assumption

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Designs a bounded test that could support or disprove a decision-critical assumption; it does not run the test.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- A decision depends on an uncertain assumption.
- You need a test with observable outcomes and a decision rule.

## When not to use it

- You want to decide whether information is worth its cost; use insight-value-of-information.
- You want the test executed, participants recruited, or spending/deployment performed.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-test-assumption Design a test for whether customers can complete onboarding without help.
```

## Flow

1. Name the decision, assumption, current evidence, and consequence if false.
2. Use existing evidence or design the smallest credible bounded test.
3. Set support, disconfirmation, and inconclusive criteria before results.
4. Return the test card, bounds, costs, risks, and interpretation limits.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; possible slices include evidence retrieval, test design, and challenging the measurement or rule.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A proposed test card and decision rule; no experiment execution, recruitment, spending, or deployment.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-test-assumption/SKILL.md](../../skills/insight-test-assumption/SKILL.md)
- [skills/insight-test-assumption/protocol.yon](../../skills/insight-test-assumption/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
