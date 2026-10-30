# synthesize

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Shapes reader-facing output around its purpose while preserving meaning and caveats.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- A substantive report is hard to scan.
- Claims and caveats need a clear decision surface.

## When not to use it

- A simple answer is already clear or independent verification is needed.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/synthesize Synthesize this evidence into a decision brief.
```

## Flow

1. Inventory protected claims, evidence, uncertainty and gates.
2. Load the matching grammar and reader-need recipe.
3. Compose and reconcile every protected unit.
4. Name gaps and require separate confirmation before consequential action.

## Subagents

The compiler defines no subagent step. Several supplied reports route to human-merge when available.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A faithful scannable response or no-op.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/synthesize/SKILL.md](../../skills/synthesize/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
