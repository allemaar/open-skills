# improve-codebase-architecture

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Find opportunities to deepen modules and reduce coupling.

**Family:** Code & architecture. **Subagents:** Conditional.

## When to use it

- Investigate brittle tests
- Explore a targeted architectural refactor

## When not to use it

- Implementing a candidate before selection

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/improve-codebase-architecture find coupling in the upload module
```

## Flow

1. Explore the code and identify candidates
2. Present candidates and let the user select one
3. Frame dependencies and design alternative interfaces
4. Compare designs and develop the selected direction
5. Draft the RFC; create a GitHub issue only after explicit confirmation, or provide the draft for manual use.

## Subagents

Use bounded fresh independent contexts when available; otherwise develop contrasting designs sequentially and label the same-context results correlated.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Evidence-backed candidates, a selected design and an RFC draft; a GitHub issue only when explicitly approved.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/improve-codebase-architecture/SKILL.md](../../skills/improve-codebase-architecture/SKILL.md)
- [skills/improve-codebase-architecture/protocol.yon](../../skills/improve-codebase-architecture/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
