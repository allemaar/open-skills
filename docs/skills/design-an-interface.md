# design-an-interface

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Compare concrete module interfaces and synthesize a recommendation.

**Family:** Code & architecture. **Subagents:** Conditional.

## When to use it

- Design a nontrivial API
- Compare module boundaries

## When not to use it

- Implementing the chosen internals

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/design-an-interface compare interfaces for a file upload module
```

## Flow

1. Establish callers, cases, failures and constraints
2. Produce three different designs with signatures and examples
3. Compare tradeoffs and synthesize a concrete recommendation
4. Ask whether the result fits the primary use case

## Subagents

Use independent subagents when available; otherwise develop each design sequentially without cross-contamination.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Designs, comparison and recommended interface.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/design-an-interface/SKILL.md](../../skills/design-an-interface/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
