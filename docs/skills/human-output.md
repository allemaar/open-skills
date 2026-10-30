# human-output

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Guides writing as it happens so a reader can understand the decision, consequence, evidence, and unchecked scope.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- You are preparing an answer, report, finding, or decision request.
- You want the verdict and decision-changing caveat visible immediately.

## When not to use it

- You need to repair existing text while preserving claims; use human-rewrite.
- You need to combine reports or draw relationships; use human-merge or human-draw.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/human-output Write a concise decision memo on whether to accept this vendor proposal.
```

## Flow

1. Lead with the verdict and any caveat that could reverse it.
2. State the ask or next action, then explain what it means.
3. Order details by decision relevance and put claims before supporting evidence.
4. Label confirmed claims, judgments, and estimates; state what was not checked.
5. Keep reference detail below the decision and mechanically check figures when present.

## Subagents

Defines reader-facing writing practices and no subagent workflow.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A reader-oriented response with decision, action, consequences, evidence, and unchecked scope.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/human-output/SKILL.md](../../skills/human-output/SKILL.md)
- [skills/human-output/references/human-contract.md](../../skills/human-output/references/human-contract.md)
- [skills/human-output/references/tools/human-output-check.mjs](../../skills/human-output/references/tools/human-output-check.mjs)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
