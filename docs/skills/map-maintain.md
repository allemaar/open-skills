# map-maintain

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

An existing knowledge map has accumulated broken links or ownership inconsistencies, and you want one controlled maintenance pass. The skill checks the exact governing scope, turns confirmed findings and link occurrences into case-bound proposals, and applies only the selected repairs.

The recheck walks the full governing scope under explicit inventory and time bounds, while interpreting selected repairs and their dependencies. Incomplete inventory or an operational error remains incomplete; new enrichment suggestions are separate from repairs and do not authorize writes.

## Where it fits

Map-check performs the read-only conformance check, map-this owns proposal and apply semantics, and map-maintain combines them for one selected repair cycle.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Tend an existing map
- Repair selected confirmed findings

## When not to use it

- Autonomous monitoring or future repairs

## How to use it

Start with a concrete request. For example:

```text
/map-maintain Check the named project map, propose repairs for confirmed findings and wait for my selection before applying them.
```

**Required skills:** [map-rules](map-rules.md), [map-check](map-check.md), [map-this](map-this.md). Install these first.

## Flow

1. Declare the selected scope and finite mutation, inventory and time bounds before checking; the 50-file default limits mutation targets, not scanning or recheck. Load the governing mapping rules.
2. Check the scope and occurrence cases. Zero conformance findings alone does not exclude actionable occurrences; honor an explicitly conformance-only request.
3. Present findings for the user's selection
4. Apply selected repairs using map-this semantics
5. Recheck the full governing scope with explicit inventory/time caps, interpret selected repairs and dependencies, and preserve incomplete outcomes.

## Common questions

**Does zero conformance findings mean there is nothing to repair?**

Not necessarily. Actionable missing or ambiguous link occurrences can exist separately; preserve the selected scope and intentional unresolved links.

**Does selecting one repair allow adjacent cleanup?**

No. Apply the exact selected set, including its coupled changes, and stop if drift or an out-of-set mutation is required.

## It is working when

- The report retains the checker's actual scope, inventory, qualifications and any incomplete coverage.
- Selected changes and their recheck are distinguished from deferred, unresolved or newly exposed findings.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A maintenance report with checked repairs.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/map-maintain/SKILL.md](../../skills/map-maintain/SKILL.md)
- [skills/map-maintain/protocol.yon](../../skills/map-maintain/protocol.yon)
- [skills/map-rules/SKILL.md](../../skills/map-rules/SKILL.md)
- [skills/map-rules/references/link-resolution.md](../../skills/map-rules/references/link-resolution.md)
- [skills/map-check/SKILL.md](../../skills/map-check/SKILL.md)
- [skills/map-this/SKILL.md](../../skills/map-this/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
