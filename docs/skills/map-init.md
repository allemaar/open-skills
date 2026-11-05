# map-init

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Install or remove the mapping route on selected agent directive surfaces.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Set up the mapping directive
- Remove a previously installed route

## When not to use it

- Editing vault content or silently changing global directives

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/map-init install the mapping route on my selected directive file
```

**Required skills:** [map-rules](map-rules.md), [map-this](map-this.md). Install these first.

## Flow

1. Detect selected surfaces and existing managed markers
2. Prepare exact proposed diffs and obtain scoped approval
3. Check target and auxiliary path chains before backup creation, retain verified preimages, then stage and atomically apply approved bytes.
4. Report results and any malformed markers

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Approved directive changes and a per-surface report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/map-init/SKILL.md](../../skills/map-init/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
