# insight-adversarial

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Stress-tests a plan, design, document, workflow, or system through distinct critic personas and synthesizes findings into a verdict.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want a red-team or multi-angle challenge.
- You want rigorous scrutiny of assumptions, failure points, or objections.

## When not to use it

- You want a focused review of one output; use insight-critique.
- You want unseen frames rather than attacks; use insight-angles.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-adversarial Stress-test this rollout plan for the strongest objections.
```

## Flow

1. Classify the target and choose distinct relevant personas.
2. Run focused critiques with specific findings.
3. Synthesize non-duplicate risks while retaining disagreements.
4. Apply the pass rules and return the verdict and next step.

## Subagents

Caller Options resolves inline or delegated venue for the invocation; the skill specifies no automatic fan-out.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A multi-persona critique with findings, synthesis, verdict, and next step.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-adversarial/SKILL.md](../../skills/insight-adversarial/SKILL.md)
- [skills/insight-adversarial/protocol.yon](../../skills/insight-adversarial/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
