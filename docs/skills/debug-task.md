# debug-task

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Reproduces and diagnoses a specific defect through bounded probes and verifies an authorized repair.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- A specific failure needs executed reproduction and diagnosis.
- An authorized fix needs verification against its original scenario.

## When not to use it

- You need only read-only fact gathering or a non-executed causal analysis.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/debug-task Reproduce and fix the reported reservation failure using the local test environment.
```

## Flow

1. Bind the symptom, expected behavior, environment, candidate, effects and effort bound.
2. Use or establish a safe discriminator for the reported path and record actual observations.
3. Compare competing hypotheses using bounded probes and symptom-preserving minimization.
4. When authorized, repair the supported mechanism and check appropriate affected callers.
5. Rerun the original scenario and sanctioned checks; report evidence, gaps and effects.

## Subagents

No worker or paid service is required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Reproduction and causal evidence, an authorized repair when supported, verification limits and an effect inventory.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/debug-task/SKILL.md](../../skills/debug-task/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
