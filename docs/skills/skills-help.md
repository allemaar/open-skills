# skills-help

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You want to know which installed skill fits your task, or browse one family. The menu reads current sibling metadata and intersects it with the bundled taxonomy instead of assuming every catalog entry is installed.

Installed skills absent from the taxonomy remain visible as Unclassified. A parsing failure is reported and does not become an invented categorized roster.

## Where it fits

Use this to discover installed capabilities; use skill-smith to author a skill and next-skills for declared successors.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- You want to browse skills.
- You want family details or a route for a need.

## When not to use it

- You want to install, edit or execute a skill.

## How to use it

Start with a concrete request. For example:

```text
/skills-help Which installed skills can help review a changed implementation?
```

## Flow

1. Read installed siblings, taxonomy and metadata.
2. Intersect assignments with installed skills and identify unclassified entries.
3. Render the requested menu and report failures or no matches honestly.
4. When asked where to start, offer proportionate advice based on installed capabilities without executing it.

## Common questions

**Does a suggested journey execute its skills?**

No. It is proportionate advice based on installed capabilities; the caller chooses any next step.

**What does Unclassified mean?**

The skill is installed but has no assignment in this pack’s taxonomy. It is not a safety or quality rating.

## It is working when

- The menu distinguishes installed entries, family assignments and unclassified siblings.
- A need with no supported match is reported without inventing a route.

## Subagents

The menu does not dispatch agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A live menu or source-based route suggestions.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/skills-help/SKILL.md](../../skills/skills-help/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
