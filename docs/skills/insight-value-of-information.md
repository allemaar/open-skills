# insight-value-of-information

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You must choose a launch date and wonder whether a pilot is worth delaying the decision. This skill asks what signal the pilot could produce, which action would change for each signal, and whether the benefit could exceed acquisition and delay costs.

With defensible probabilities, payoffs and signal accuracy it can calculate expected information value and check the perfect-information upper bound. Otherwise it gives qualitative switching conditions and missing evidence instead of invented numbers.

## Where it fits

Use it to decide whether more information is worth pursuing. Insight-test-assumption can design a selected test; this assessment does not launch it.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You are unsure whether to research or test before deciding.
- You need to compare a decision-changing signal's value with its acquisition cost.

## When not to use it

- You need a test designed; use insight-test-assumption.
- You want information purchased or research performed; this skill evaluates but does not acquire it.

## How to use it

Start with a concrete request. For example:

```text
/insight-value-of-information Compare deciding the launch date now with this proposed customer pilot, using the attached deadline, costs and possible decisions.
```

## Flow

1. Frame feasible actions, current best choice, horizon, and uncertain inputs.
2. Describe information, signals, reliability, action changes, and costs.
3. Calculate EVSI/EVPI only when probabilities, payoffs, and signal accuracy are supported.
4. Recommend gathering information, deciding now, or remaining unresolved, with a stopping rule.

## Common questions

**What if the result arrives after the decision deadline?**

It cannot improve that choice if it cannot affect the action in time, although a separate learning or compliance purpose may remain.

## It is working when

- The recommendation says gather, decide now or unresolved, and identifies switching conditions, costs, gaps and a stopping rule.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; useful slices include decision model, source reliability, and arithmetic checks.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A supported information-value estimate or qualitative switching conditions with cost, gaps, and stopping rule.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-value-of-information/SKILL.md](../../skills/insight-value-of-information/SKILL.md)
- [skills/insight-value-of-information/protocol.yon](../../skills/insight-value-of-information/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
