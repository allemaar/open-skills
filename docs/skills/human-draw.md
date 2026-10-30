# human-draw

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Turns relational, positional, or proportional information into a text figure that carries meaning alongside concise prose.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- Relationships, sequence, branching, or proportion are central.
- You need a compact figure legible in a monospace transcript.

## When not to use it

- The material is records with shared attributes; use a table.
- You need a rendered chart for a graphical surface.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/human-draw Show the three rollout stages and rollback branches as a diagram.
```

## Flow

1. Choose the shape matching the information.
2. Read the selected shape guidance and encode it in printable ASCII.
3. Keep labels and values informative if the figure wraps.
4. Check width, glyphs, alignment, arithmetic, node limits, and honesty.
5. Return the figure with its check receipt and surrounding explanation.

## Subagents

Defines a figure-design workflow and no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A checked ASCII figure with explanation; it supplements prose and adds no unsupported facts.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/human-draw/SKILL.md](../../skills/human-draw/SKILL.md)
- [skills/human-draw/references/human-contract.md](../../skills/human-draw/references/human-contract.md)
- [skills/human-draw/references/tools/human-output-check.mjs](../../skills/human-draw/references/tools/human-output-check.mjs)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
