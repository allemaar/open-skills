# insight-test-assumption

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A product decision depends on a belief that new customers can complete onboarding without help. The skill identifies what decision would change, uses existing evidence if sufficient and otherwise designs a bounded check that could support, contradict or leave the belief unresolved.

Before results, specify what would support, contradict or leave the assumption unresolved and what each outcome would mean for the decision. A proxy is indirect evidence, and a pilot does not establish general validity.

## Where it fits

Use this to design a discriminating check. Insight-value-of-information addresses whether additional information is worth its cost; running a test requires separate authority.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- A decision depends on an uncertain assumption.
- You need a test with observable outcomes and a decision rule.

## When not to use it

- You want to decide whether information is worth its cost; use insight-value-of-information.
- You want the test executed, participants recruited, or spending/deployment performed.

## How to use it

Start with a concrete request. For example:

```text
/insight-test-assumption Design a bounded test of whether new customers can complete the supplied onboarding flow without help; the decision is whether to remove assisted setup.
```

## Flow

1. Name the decision, assumption, current evidence, and consequence if false.
2. Use existing evidence or design the smallest credible bounded test.
3. Set support, disconfirmation, and inconclusive criteria before results.
4. Return the test card, bounds, costs, risks, and interpretation limits.

## Common questions

**What if results already exist without a prior decision rule?**

Label the interpretation exploratory or post-hoc. Do not claim a pre-agreed test passed; propose a prospective check only if further evidence could affect the decision.

## It is working when

- The test card connects a falsifiable assumption to observable outcomes and the decision each would change.
- It states time, cost, risks, measurement limits and unknowns without inventing precision or executing the test.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; possible slices include evidence retrieval, test design, and challenging the measurement or rule.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A proposed test card and decision rule; no experiment execution, recruitment, spending, or deployment.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-test-assumption/SKILL.md](../../skills/insight-test-assumption/SKILL.md)
- [skills/insight-test-assumption/protocol.yon](../../skills/insight-test-assumption/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
