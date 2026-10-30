# prime-expand

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Turns a vague gap into questions and candidate sources via a bounded subagent.

**Family:** Priming. **Subagents:** Part of the workflow.

## When to use it

- A research target needs sharpening.
- A thin handoff needs a clear priming target.

## When not to use it

- You want the investigation itself performed now.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/prime-expand Expand this gap about onboarding failures.
```

## Flow

1. Provide the seed gap and context.
2. A subagent proposes questions and named sources with limited spot checks.
3. Confirm, edit or refuse the pair.
4. Use an accepted target for downstream priming.

## Subagents

One subagent performs one turn with at most three source spot checks.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A proposed question and source pair.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prime-expand/SKILL.md](../../skills/prime-expand/SKILL.md)
- [skills/prime-expand/protocol.yon](../../skills/prime-expand/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
