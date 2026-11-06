# design-an-interface

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You know the job a module must do but have not settled what callers should see. Compare three concrete boundaries, including their call sites and failure cases, before committing to one interface.

Three substantially different designs include signatures and usage examples, allowing a comparison of tradeoffs before a recommendation is synthesized.

## Where it fits

Use this for competing module or API boundaries. Build-prototype is suited to testing behavior in a runnable artifact.

**Family:** Code & architecture. **Subagents:** Conditional.

## When to use it

- Design a nontrivial API
- Compare module boundaries

## When not to use it

- Implementing the chosen internals

## How to use it

Start with a concrete request. For example:

```text
/design-an-interface Compare APIs for an upload module used by a web form and a batch importer. Cover validation errors, retries and the common single-file case.
```

## Flow

1. Establish callers, cases, failures and constraints
2. Produce three different designs with signatures and examples
3. Compare tradeoffs and synthesize a concrete recommendation
4. Ask whether the result fits the primary use case

## Common questions

**Do three designs have to come from independent workers?**

Fresh isolated workers are useful when available; sequential alternatives are correlated and should not be described as independent.

**How different must the designs be?**

They should hide and expose different information, not merely rename the same methods. Each includes concrete signatures and happy, error and awkward usage cases.

## It is working when

- Each design shows a concrete caller interaction and failure handling.
- The recommendation explains its tradeoffs against the principal use case.

## Subagents

Use fresh isolated worker contexts when available; sequential same-context alternatives are useful but correlated, not independent.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Designs, comparison and recommended interface.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/design-an-interface/SKILL.md](../../skills/design-an-interface/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
