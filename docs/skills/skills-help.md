# skills-help

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Shows a live installed-skills menu using the bundled taxonomy.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- You want to browse skills.
- You want family details or a route for a need.

## When not to use it

- You want to install, edit or execute a skill.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/skills-help Show skills for reviewing work.
```

## Flow

1. Read installed siblings, taxonomy and metadata.
2. Intersect assignments with installed skills and identify unclassified entries.
3. Render the requested menu and report failures or no matches honestly.
4. When asked where to start, offer proportionate advice based on installed capabilities without executing it.

## Subagents

The menu does not dispatch agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A live menu or source-based route suggestions.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/skills-help/SKILL.md](../../skills/skills-help/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
