# insight-angles

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A proposal feels narrow, but you do not yet know which perspective is missing. The skill selects lenses for the subject and looks for alternative frames, hidden assumptions, connections and second-order effects.

It selects lenses for the subject and returns an angle map, including candidate expansions and material assumptions. Findings remain leads to assess rather than established facts simply because they sound novel.

## Where it fits

Choose this for missing perspectives without requiring a decision; cross-examine combines discovery with evaluation.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want to widen or reframe a subject.
- You want connections surfaced before choosing an option.

## When not to use it

- You want implementation alternatives; use insight-explore.
- You want flaw-focused review or a decision over options; use insight-adversarial or insight-cross-examine.

## How to use it

Start with a concrete request. For example:

```text
/insight-angles Examine this onboarding proposal. We currently optimize completion rate; surface missing stakeholder perspectives, assumptions and possible downstream effects.
```

## Flow

1. Frame the subject and current view.
2. Classify domain, type, maturity, and current trends.
3. Choose roster and subject-specific lenses; note skips.
4. Run context-appropriate passes and connect and score findings.
5. Return an angle map and synthesis.

## Common questions

**Is this an implementation brainstorm?**

Its focus is reframing and connections; use insight-explore for competing implementations.

**Does every surprising connection become a recommendation?**

No. Connections are leads, with their relevance and implications stated; the skill does not decide or implement them.

## It is working when

- The angle map distinguishes frames, connections, assumptions and possible effects.
- The synthesis identifies useful implications and states the limits of coverage.

## Subagents

Selects inline or cold isolated-worker passes by subject; asks when uncertain. Quick/resolved runs are inline. Deep passes and fan-out above about six workers require Handler consent. Cold workers each handle one lens and do not delegate. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An angle map of frames, typed connections, assumptions, expansions, and second-order effects with a synthesis.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-angles/SKILL.md](../../skills/insight-angles/SKILL.md)
- [skills/insight-angles/protocol.yon](../../skills/insight-angles/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
