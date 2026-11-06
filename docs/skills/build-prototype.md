# build-prototype

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are unsure how a rule or interaction will behave and a description cannot settle it. Frame one decision question, then build a small runnable model and compare its observations with expectations derived before running it.

The smallest runnable artifact is exercised in an isolated setting. Its observations support a recommendation only within the scenarios actually tried.

## Where it fits

Use design-an-interface to compare module interfaces; use this when running state, logic or interaction will answer the question.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- State, logic or interface behavior needs a runnable experiment.
- A decision needs observations against independently derived expectations.

## When not to use it

- A static explanation or unrequested production implementation is needed.

## How to use it

Start with a concrete request. For example:

```text
/build-prototype Test whether a cancelled reservation releases capacity immediately. Use synthetic bookings and show valid, invalid and reset cases.
```

## Flow

1. Frame the question, expected observations, scenarios, effects and effort bound.
2. Choose the state and logic or UI route and verify isolated work and runtime.
3. Build and exercise the minimum artifact within the boundary.
4. Report expectations, observations, limitations, instructions and a recommendation.
5. Use design-an-interface for module/API alternatives; visual interaction experiments may remain runnable prototypes.

## Common questions

**Is a prototype the production implementation?**

No. It is an experiment; production work needs its own scope and authorization.

**What if the runtime is missing?**

The dependent execution stops. The result can include useful unexecuted source, but must identify the missing runtime and cannot invent observations.

## It is working when

- The report connects each exercised scenario to its expected and observed result.
- The artifact can be run with the supplied instructions, or a missing prerequisite is named.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
