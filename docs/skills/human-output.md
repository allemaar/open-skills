# human-output

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A decision maker needs to know what to do before reading a long investigation. Put the verdict and any reversing condition first, then state the practical consequence, evidence and unchecked scope in the order they matter to that decision.

The bundled checker detects selected mechanical patterns in drafted text. It cannot determine whether the verdict is correct, confidence is warranted or a number matches its source; those require direct inspection. A simple answer need not carry a full report structure.

## Where it fits

Human-output governs writing as it happens. Human-rewrite repairs an existing text, human-merge reconciles reports, and human-draw owns the inside of a useful figure.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- You are preparing an answer, report, finding, or decision request.
- You want the verdict and decision-changing caveat visible immediately.

## When not to use it

- You need to repair existing text while preserving claims; use human-rewrite.
- You need to combine reports or draw relationships; use human-merge or human-draw.

## How to use it

Start with a concrete request. For example:

```text
/human-output Write a decision memo from these vendor findings, including the cost, the condition that could reverse the recommendation and what was not checked.
```

## Flow

1. Lead with the verdict and any caveat that could reverse it.
2. State the ask or next action, then explain what it means.
3. Order details by decision relevance and put claims before supporting evidence.
4. Label confirmed claims, judgments, and estimates; state what was not checked.
5. Keep reference detail below the decision. Mechanical figure checks cover figures identified by a final [fig ...] receipt line; other code and quotations remain outside those figure checks.

## Common questions

**Why must a reversing caveat appear with the verdict?**

A reader may stop before later detail; placing a condition that changes the decision below that point can leave the reader wrong.

**Does a green checker result prove the report is faithful?**

No. It only means the implemented mechanical checks detected no errors; source fidelity and judgment still require checking.

## It is working when

- A reader can identify the verdict, material condition, practical consequence and needed action without decoding internal shorthand.
- Claims, evidence and unchecked scope are distinguishable, with mechanical-check limitations stated when relevant.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
