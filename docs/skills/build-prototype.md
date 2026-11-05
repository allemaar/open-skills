# build-prototype

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Builds and exercises a bounded runnable experiment to answer a design question.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- State, logic or interface behavior needs a runnable experiment.
- A decision needs observations against independently derived expectations.

## When not to use it

- A static explanation or unrequested production implementation is needed.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/build-prototype Test reservation cancellation and capacity rules using synthetic data.
```

## Flow

1. Frame the question, expected observations, scenarios, effects and effort bound.
2. Choose the state and logic or UI route and verify isolated work and runtime.
3. Build and exercise the minimum artifact within the boundary.
4. Report expectations, observations, limitations, instructions and a recommendation.
5. Use design-an-interface for module/API alternatives; visual interaction experiments may remain runnable prototypes.

## Subagents

A subagent is not required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A bounded artifact and an evidence report, or a named prerequisite gap.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/build-prototype/SKILL.md](../../skills/build-prototype/SKILL.md)
- [skills/build-prototype/protocol.yon](../../skills/build-prototype/protocol.yon)
- [skills/build-prototype/references/state-and-logic.md](../../skills/build-prototype/references/state-and-logic.md)
- [skills/build-prototype/references/ui.md](../../skills/build-prototype/references/ui.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
