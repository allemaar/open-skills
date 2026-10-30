# insight-angles

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Finds less-visible frames, connections, assumptions, candidate expansions, and second-order effects around a subject.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want to widen or reframe a subject.
- You want connections surfaced before choosing an option.

## When not to use it

- You want implementation alternatives; use insight-explore.
- You want flaw-focused review or a decision over options; use insight-adversarial or insight-cross-examine.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-angles Find missing perspectives and connections in this proposal.
```

## Flow

1. Frame the subject and current view.
2. Classify domain, type, maturity, and current trends.
3. Choose roster and subject-specific lenses; note skips.
4. Run context-appropriate passes and connect and score findings.
5. Return an angle map and synthesis.

## Subagents

Selects inline or cold isolated-worker passes by subject; asks when uncertain. Quick/resolved runs are inline. Deep passes and fan-out above about six workers require Handler consent. Cold workers each handle one lens and do not delegate.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An angle map of frames, typed connections, assumptions, expansions, and second-order effects with a synthesis.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-angles/SKILL.md](../../skills/insight-angles/SKILL.md)
- [skills/insight-angles/protocol.yon](../../skills/insight-angles/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
