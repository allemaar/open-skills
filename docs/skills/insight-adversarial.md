# insight-adversarial

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A plan or design seems plausible, but you want to know what different critics would attack. This skill selects distinct lenses for the target, develops specific supported objections and synthesizes them into a verdict and minimum remedies.

A lens need not find a flaw. Overlapping findings are combined with their evidence, and additional passes use new substantive perspectives on unresolved issues.

## Where it fits

Use it for multi-angle stress testing. Insight-critique gives focused feedback on one output; cold-review brings fresh reviewers to actual artifacts.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want a red-team or multi-angle challenge.
- You want rigorous scrutiny of assumptions, failure points, or objections.

## When not to use it

- You want a focused review of one output; use insight-critique.
- You want unseen frames rather than attacks; use insight-angles.

## How to use it

Start with a concrete request. For example:

```text
/insight-adversarial Stress-test this rollout plan against its stated dependencies and rollback constraints; identify the strongest supported objections.
```

## Flow

1. Classify the target and choose distinct relevant personas.
2. Run focused critiques with specific evidenced findings, or state no material finding supported with scope and uncertainty.
3. Merge convergent findings and rank up to three supported issues by actual severity, retaining disagreements.
4. Apply the pass rules and return the verdict and next step.

## Common questions

**Must every persona find a different issue?**

No. It can report no supported material finding in its inspected scope; the synthesis must not invent distinctions.

## It is working when

- The verdict ranks supported objections by actual severity, preserves uncertainty and pairs material issues with concrete remedies.

## Subagents

Caller Options resolves inline or delegated venue for the invocation; the skill specifies no automatic fan-out.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A multi-persona critique with findings, synthesis, verdict, and next step.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-adversarial/SKILL.md](../../skills/insight-adversarial/SKILL.md)
- [skills/insight-adversarial/protocol.yon](../../skills/insight-adversarial/protocol.yon)
- [skills/insight-adversarial/personas/roster.md](../../skills/insight-adversarial/personas/roster.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
