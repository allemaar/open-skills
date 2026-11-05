# human-rewrite

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Repairs existing text so a person can read and act on it while preserving its claims and degree of certainty.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- An existing report or answer is too dense, confusing, or hard to act on.
- You need a clearer version that preserves numbers, scope, attribution, and caveats.

## When not to use it

- You need to merge reports and reconcile claims; use human-merge.
- You want fresh writing rather than a meaning-preserving repair; use human-output.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/human-rewrite Rewrite this update so a client can see the decision and what remains uncertain.
```

## Flow

1. Identify the reader, decision need, and what makes the text hard to use.
2. Preserve claim strength, attribution, scope, numbers, units, uncertainty, and caveats.
3. Explain a missing connection only from the supplied text or explicitly supplied established context, attributing context separately and naming unsupported gaps.
4. Resolve shorthand and reorder by decision relevance without changing claims.
5. Restack for the destination while retaining necessary supporting detail.
6. Check fidelity and name unresolved ambiguity or missing source context.
7. Check example inventory items individually, retaining exact time windows, threshold meaning and tentative decisions.

## Subagents

Transforms supplied or existing text and defines no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A clearer meaning-preserving rewrite with caveats and evidence limits intact.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/human-rewrite/SKILL.md](../../skills/human-rewrite/SKILL.md)
- [skills/human-rewrite/references/human-contract.md](../../skills/human-rewrite/references/human-contract.md)
- [skills/human-rewrite/references/examples/estuary-rewrite.md](../../skills/human-rewrite/references/examples/estuary-rewrite.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
