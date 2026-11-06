# human-rewrite

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A report contains the right facts but the reader cannot see the decision. Human-rewrite inventories the claims that must survive, brings decision-reversing caveats up with the verdict, and restacks one existing text by what the reader needs.

It preserves strength, scope, numbers, attribution and missing results. For example, a possible relationship must not become a proven cause. A source error is flagged separately rather than silently corrected.

## Where it fits

Use it to repair one text. Human-merge reconciles several reports; human-output governs new writing; double-check investigates a contested claim.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- An existing report or answer is too dense, confusing, or hard to act on.
- You need a clearer version that preserves numbers, scope, attribution, and caveats.

## When not to use it

- You need to merge reports and reconcile claims; use human-merge.
- You want fresh writing rather than a meaning-preserving repair; use human-output.

## How to use it

Start with a concrete request. For example:

```text
/human-rewrite Rewrite this client update around the release decision, keeping its untested configuration and estimated date visible.
```

## Flow

1. Identify the reader, decision need, and what makes the text hard to use.
2. Preserve claim strength, attribution, scope, numbers, units, uncertainty, and caveats.
3. Explain a missing connection only from the supplied text or explicitly supplied established context, attributing context separately and naming unsupported gaps.
4. Resolve shorthand and reorder by decision relevance without changing claims.
5. Restack for the destination while retaining necessary supporting detail.
6. Check fidelity and name unresolved ambiguity or missing source context.

## Common questions

**Can missing context explain a confusing connection?**

Only supplied text or explicitly supplied established context may support it; attribute that context separately and name unsupported gaps.

**Must an ordinary rewrite work through the bundled example?**

No. Read it only for explicitly selected onboarding or demonstration, or when procedural ambiguity remains after the core rules. Its facts and inventory counts are illustrative, never inputs to the current rewrite. When selected, inspect its inventory items individually, preserving exact windows, thresholds and tentative decisions.

## It is working when

- The rewrite puts the decision and qualifying caveats early, and the fidelity trace accounts for the source's material claims.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
