# map-maintain

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Perform one bounded check, selected repair and recheck cycle.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Tend an existing map
- Repair selected confirmed findings

## When not to use it

- Autonomous monitoring or future repairs

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/map-maintain tend this project map
```

**Required skills:** [map-rules](map-rules.md), [map-check](map-check.md), [map-this](map-this.md). Install these first.

## Flow

1. Load the mapping rules and check the selected scope
2. Present findings for the user's selection
3. Apply selected repairs using map-this semantics
4. Recheck affected areas and report remaining gaps

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A maintenance report with checked repairs.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/map-maintain/SKILL.md](../../skills/map-maintain/SKILL.md)
- [skills/map-maintain/protocol.yon](../../skills/map-maintain/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
