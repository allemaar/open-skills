# insight-cross-examine

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You need a recommendation among candidates and the available evidence is uneven. This workflow adjusts its depth to the question, discovers useful angles, then compares the choices and any justified combinations against consistent criteria.

It reuses applicable findings, evaluates selected options consistently and may recommend deferral when the evidence is insufficient. Deeper reassessment or large fan-out is offered rather than launched automatically.

## Where it fits

Use a focused insight skill for a single method; choose cross-examine for a recommendation that combines methods.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want a recommendation across candidates or a complex decision.
- You want discovery and critique combined without running every method by default.

## When not to use it

- You want only one critique, assessment, or brainstorm; use that focused skill.
- You want phase-by-phase inspection of an existing plan; use plan-deep-dive.

## How to use it

Start with a concrete request. For example:

```text
/insight-cross-examine Recommend among these three storage options for a small team. Compare migration effort, operating cost and recovery; flag missing evidence that could reverse the choice.
```

## Flow

1. Classify the question and evidence context; select depth.
2. Discover angles inline at the selected depth.
3. Run only selected critique, assessment, or one relevant specialist method.
4. For sets, compare consistently and consider justified hybrids.
5. Report recommendation, alternatives, uncertainty, and coverage.

## Common questions

**What if the problem is missing evidence rather than missing options?**

Name the decision-changing evidence gap instead of generating extra candidates to fill it.

**What if the evidence cannot support a winner?**

Recommend a specific evidence-gathering step or deferral. More candidate options do not resolve an evidence gap.

## It is working when

- The decision surface includes a recommendation, alternatives, the weak assumption and what could change the result.
- Coverage, intentionally skipped angles and material uncertainty are stated.

## Subagents

Normal sub-skills run inline. Large-set fan-out, L5 depth, and extra reassessment are offered for explicit consent and never automatic. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A decision surface with recommendation, alternatives, decisive assumptions, coverage, and analysis trail.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-cross-examine/SKILL.md](../../skills/insight-cross-examine/SKILL.md)
- [skills/insight-cross-examine/protocol.yon](../../skills/insight-cross-examine/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
