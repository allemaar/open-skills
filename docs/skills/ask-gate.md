# ask-gate

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Triages a pending question and prepares it according to stakes.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- You are about to ask the Handler.
- A consequential decision needs sound framing.

## When not to use it

- The answer can be resolved from the request or available context.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/ask-gate Check whether I should ask about this choice.
```

## Flow

1. Resolve answerable questions without asking.
2. Classify necessary questions as routine or high stakes.
3. Use the checklist for routine questions, or critique and assess high-stakes options.
4. Ask a clear, appropriately framed question.

## Subagents

Deliberation does not require a subagent.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A resolved choice or quality-checked question.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/ask-gate/SKILL.md](../../skills/ask-gate/SKILL.md)
- [skills/ask-gate/protocol.yon](../../skills/ask-gate/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
