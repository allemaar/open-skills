# map-init

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want selected agents to load mapping guidance before organizing Markdown. Map-init examines existing directive files and proposes an exact managed-block change for each selected surface.

Approval is bound to the displayed source and candidate bytes for each target. Backups, path checks, staging and atomic replacement protect the selected files; malformed markers and drift stop the affected operation.

## Where it fits

Choose map-init to manage the directive route, and map-this to assess and organize content.

**Family:** Obsidian & vault. **Subagents:** No subagent step prescribed.

## When to use it

- Set up the mapping directive
- Remove a previously installed route

## When not to use it

- Editing vault content or silently changing global directives

## How to use it

Start with a concrete request. For example:

```text
/map-init Install the mapping route in the selected project directive file. Show the exact diff and report whether the required mapping skills are available.
```

**Required skills:** [map-rules](map-rules.md), [map-this](map-this.md). Install these first.

## Flow

1. Detect selected surfaces and existing managed markers
2. Prepare exact proposed diffs and obtain scoped approval
3. Check target and auxiliary path chains before backup creation, retain verified preimages, then stage and atomically apply approved bytes.
4. Report results and any malformed markers

## Common questions

**Does installation organize the vault?**

No. It changes the selected directive route; map-this handles a separately selected organization scope.

**What if the file already has an untagged equivalent?**

It is a conflict, not automatically managed content. The skill reports it instead of replacing wording it cannot claim to own.

## It is working when

- Each selected surface is classified and receives an exact proposed diff or a stated conflict.
- The report distinguishes installed, updated, removed, unchanged and failed targets.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Approved directive changes and a per-surface report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/map-init/SKILL.md](../../skills/map-init/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
