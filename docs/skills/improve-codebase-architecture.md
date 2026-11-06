# improve-codebase-architecture

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A small change keeps touching several modules and their tests break together. This skill follows the code and call patterns to find genuine coupling, then asks whether a combined module could expose a smaller interface while hiding the shared complexity.

After the user selects a candidate, classify its dependencies, compare distinct interface designs and draft an RFC for the chosen direction. A proposed test deletion needs a mapping to retained or replacement behavioral coverage; no deletion may be the correct result.

## Where it fits

Use this skill to explore module boundaries and prepare a refactor proposal. Implementation and publication are separate actions; a GitHub issue needs the exact destination and draft confirmed first.

**Family:** Code & architecture. **Subagents:** Conditional.

## When to use it

- Investigate brittle tests
- Explore a targeted architectural refactor

## When not to use it

- Implementing a candidate before selection

## How to use it

Start with a concrete request. For example:

```text
/improve-codebase-architecture Inspect the upload pipeline for coupled modules and brittle tests; present candidates before proposing an interface.
```

## Flow

1. Explore the code and identify candidates
2. Present candidates and let the user select one
3. Frame dependencies and design alternative interfaces
4. Compare designs and develop the selected direction
5. Draft the RFC; create a GitHub issue only after explicit confirmation, or provide the draft for manual use.

## Common questions

**Is moving code into a new file automatically a deepening?**

No. The proposed combined interface must be smaller than the existing surfaces; otherwise the change may only reorganize code.

**Must old tests always be deleted?**

No. Name deletions only when behavioral coverage is mapped to retained or replacement boundary tests; an evidenced none is valid.

## It is working when

- Each presented candidate has evidence of coupling, a dependency category and a defensible test strategy.
- The selected interface and complete RFC are reviewable before any issue is created.

## Subagents

Use bounded fresh independent contexts when available; otherwise develop contrasting designs sequentially and label the same-context results correlated.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Evidence-backed candidates, a selected design and an RFC draft; a GitHub issue only when explicitly approved.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/improve-codebase-architecture/SKILL.md](../../skills/improve-codebase-architecture/SKILL.md)
- [skills/improve-codebase-architecture/protocol.yon](../../skills/improve-codebase-architecture/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
