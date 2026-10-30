# insight-value-of-information

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Assesses whether information could improve a pending choice enough to justify research, testing, and delay costs.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You are unsure whether to research or test before deciding.
- You need to compare a decision-changing signal's value with its acquisition cost.

## When not to use it

- You need a test designed; use insight-test-assumption.
- You want information purchased or research performed; this skill evaluates but does not acquire it.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-value-of-information Is a customer pilot worth running before we choose a launch date?
```

## Flow

1. Frame feasible actions, current best choice, horizon, and uncertain inputs.
2. Describe information, signals, reliability, action changes, and costs.
3. Calculate EVSI/EVPI only when probabilities, payoffs, and signal accuracy are supported.
4. Recommend gathering information, deciding now, or remaining unresolved, with a stopping rule.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; useful slices include decision model, source reliability, and arithmetic checks.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A supported information-value estimate or qualitative switching conditions with cost, gaps, and stopping rule.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-value-of-information/SKILL.md](../../skills/insight-value-of-information/SKILL.md)
- [skills/insight-value-of-information/protocol.yon](../../skills/insight-value-of-information/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
