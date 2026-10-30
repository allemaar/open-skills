# plan-phases

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Restructures an existing plan into phases with verification and safety gates.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A flat plan needs checkpoints.
- Original content must be preserved while sequencing it.

## When not to use it

- You need a plan created from scratch.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/plan-phases Add phases and verification gates to this plan.
```

## Flow

1. Locate the intended plan and preserve its content.
2. Group actions into ordered phases.
3. Add post-phase verification and pre-action safety gates; if verify is unavailable, require explicit user confirmation at the gate.
4. Rewrite a sourced plan in its original format within the authorized scope, or return a conversation-only plan as a fenced block; report the restructuring.

## Subagents

The restructuring does not prescribe subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A restructured source plan or conversation block with explicit gates and a change summary.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-phases/SKILL.md](../../skills/plan-phases/SKILL.md)
- [skills/plan-phases/protocol.yon](../../skills/plan-phases/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
