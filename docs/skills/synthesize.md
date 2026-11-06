# synthesize

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A report has the right evidence but the decision is buried in a wall of text. The skill first inventories the claims, numbers, conditions and disagreements that must survive, then selects a shape for the reader's task and checks the finished response against that inventory.

Restructuring does not verify claims or increase their confidence. A clear short answer may remain unchanged; when a required reference is unavailable, the skill names the gap and falls back to a minimal word-only shape.

## Where it fits

Use synthesize to shape an answer for its reader. Human-rewrite repairs existing prose, human-merge reconciles multiple reports, and independent verification remains separate.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- A substantive report is hard to scan.
- Claims and caveats need a clear decision surface.

## When not to use it

- A simple answer is already clear or independent verification is needed.

## How to use it

Start with a concrete request. For example:

```text
/synthesize Turn these attributed findings into a decision brief; preserve the disagreement, uncertainty and condition that would reverse the recommendation.
```

## Flow

1. Inventory protected claims, evidence, uncertainty and gates.
2. Load the matching grammar and reader-need recipe.
3. Compose and reconcile every protected unit.
4. Name gaps and require separate confirmation before consequential action.

## Common questions

**Can a caveat be moved to a footnote to make the conclusion shorter?**

A condition that could reverse the conclusion must remain visible with the conclusion; do not conceal protected meaning for brevity.

**Does reorganizing evidence verify it?**

No. Preserve the source's confidence and disclose unchecked evidence that could change the decision.

## It is working when

- Protected claims and their material qualifications survive the chosen shape without silent reconciliation of disagreements.
- The output fits the reader's need and identifies decision-changing gaps and any separate action gate.

## Subagents

The compiler defines no subagent step. Several supplied reports route to human-merge when available.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A faithful scannable response or no-op.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/synthesize/SKILL.md](../../skills/synthesize/SKILL.md)
- [skills/synthesize/references/grammar.md](../../skills/synthesize/references/grammar.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
