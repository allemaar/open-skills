# debug-task

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A reported bug has a symptom but its cause is uncertain. This workflow first finds a path that distinguishes the failure from expected behavior, then uses observations to test explanations before making an authorized repair.

Bounded probes compare competing explanations. A supported repair is made only within authorization, then the original scenario and relevant affected paths are checked.

## Where it fits

Use investigate for read-only fact gathering and this skill when reproduction and executed diagnosis are needed.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- A specific failure needs executed reproduction and diagnosis.
- An authorized fix needs verification against its original scenario.

## When not to use it

- You need only read-only fact gathering or a non-executed causal analysis.

## How to use it

Start with a concrete request. For example:

```text
/debug-task Reproduce and fix the reservation cancellation failure locally. The expected result is that a cancelled booking releases one slot; use the existing test environment.
```

## Flow

1. Bind the symptom, expected behavior, environment, candidate, effects and effort bound.
2. Use or establish a safe discriminator for the reported path and record actual observations.
3. Compare competing hypotheses using bounded probes and symptom-preserving minimization.
4. When authorized, repair the supported mechanism and check appropriate affected callers.
5. Rerun the original scenario and sanctioned checks; report evidence, gaps and effects.

## Common questions

**What if the failure cannot be reproduced safely?**

Report the missing discriminator and evidence gap; do not present a speculative cause as verified.

**What if an intermittent failure does not recur?**

Report the attempts and conditions, and leave reproduction unresolved. A non-reproduction does not prove a cause or a successful fix.

## It is working when

- The report states the reproduction conditions, observations and causal evidence.
- Any repair is checked against the original failure and limitations of the checks remain visible.

## Subagents

No worker or paid service is required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Reproduction and causal evidence, an authorized repair when supported, verification limits and an effect inventory.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/debug-task/SKILL.md](../../skills/debug-task/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
