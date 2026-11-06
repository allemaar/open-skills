# caller-options

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A skill can sometimes run in the current conversation or delegate a bounded slice, and it may offer more than one mode. Caller Options compares the combinations that the skill and runtime actually permit; when one clearly dominates it proceeds without presenting a needless choice.

Delegation requires a resolved marker in the worker brief to prevent re-entry and nesting, plus inspection of the actual output. An active orchestration mode owns venue selection, so Caller Options considers only the skill mode.

## Where it fits

Use caller-options for a single invocation. Orchestrate-mode and multi-agent-mode govern persistent session behavior, while ask-gate triages whether a question belongs with the user.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- A skill declares meaningful venue choices.
- A skill has multiple viable execution paths.

## When not to use it

- You are selecting a persistent session mode.

## How to use it

Start with a concrete request. For example:

```text
/caller-options For this large read-only investigation, compare running inline with one delegated worker under the skill's declared options.
```

## Flow

1. Triage choices and proceed directly if one dominates.
2. Eliminate unavailable or unsafe combinations and compare survivors.
3. Surface material choices and execute the selected path.
4. For delegation, use the resolved marker and inspect the result.

## Common questions

**Why is a self-orchestrating skill not wrapped in another delegated venue?**

Wrapping it would create nested delegation. The self-orchestrating skill runs inline as the delegator under its own rules.

**Does the candidate register override the skill's declaration?**

No. The register is a derived index; the participating skill's frontmatter is canonical for its declared dimensions.

## It is working when

- The selected path respects the active venue owner, declared options and runtime workspace boundaries.
- Any delegated result is inspected, and the resolved marker prevents a nested invocation from re-entering the choice protocol.

## Subagents

Delegated or fan-out venues may be selected; self-orchestrators are not wrapped.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A chosen mode and venue.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/caller-options/SKILL.md](../../skills/caller-options/SKILL.md)
- [skills/caller-options/protocol.yon](../../skills/caller-options/protocol.yon)
- [skills/caller-options/references/VENUE-HEURISTICS.md](../../skills/caller-options/references/VENUE-HEURISTICS.md)
- [skills/caller-options/references/CANDIDATES.md](../../skills/caller-options/references/CANDIDATES.md)
- [skills/caller-options/references/OPT-IN-BLOCK.md](../../skills/caller-options/references/OPT-IN-BLOCK.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
