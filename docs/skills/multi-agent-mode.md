# multi-agent-mode

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Activates assisted mode: the lead works directly and delegates useful independent slices.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- Independent slices can run alongside lead work.
- You want explicit helper ownership.

## When not to use it

- You want the lead to dispatch only.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/multi-agent-mode Activate multi-agent mode for this implementation.
```

## Flow

1. Announce the mode and limits.
2. Decompose into lead work and independent slices.
3. Delegate useful bounded slices and inspect results.
4. Integrate and verify as lead.

## Subagents

Activation does not require immediate spawning; maximum three helpers without confirmation, no recursive subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A persistent assisted mode and integrated results.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/multi-agent-mode/SKILL.md](../../skills/multi-agent-mode/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
