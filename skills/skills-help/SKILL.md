---
name: skills-help
description: The skills library menu — every skill grouped by family, each with a one-line description and a dual-doc/single-doc marker; pass a family name to drill into one family in full detail. Trigger with /skills-help, "list my skills", "which skill for X", "skills menu", "what skills do I have". Not /new-skill-creator (which scaffolds a new skill).
visibility: public
triggers:
  - "/skills-help"
  - "/skills-help {family}"
  - "list my skills"
  - "which skill for X"
  - "skills menu"
  - "what skills do I have"
next-skills:
  - skill: new-skill-creator
    phrase: "/new-skill-creator"
    why: "When the library menu shows no skill covers the need, create the missing one."
  - skill: insight-skill-gap
    phrase: "/insight-skill-gap"
    why: "After browsing the roster and finding a hole, run the gap analysis to decide what to add or update."
---

# /skills-help

The live menu for the **skills library**. Family membership comes from the bundled [`taxonomy.yon`](taxonomy.yon); names, descriptions, triggers, runtime declarations, and protocol presence come from the installed sibling skill folders. This is a reference card and changes nothing.

## How to use

- **`/skills-help`** — print every installed skill grouped by the taxonomy's family order.
- **`/skills-help {family}`** — resolve the argument against family ID, label, or aliases and print only that family in full detail.
- **`/skills-help {need}`** — when the argument is not a family, match the need against live descriptions and trigger phrases and show the closest routes without inventing capabilities.

## Build the live view

1. Locate the active skills root containing this `skills-help` folder. Enumerate only its immediate sibling directories that contain `SKILL.md`.
2. Read `taxonomy.yon`. Its `family:*` records define IDs, labels, aliases, and display order; `SkillFamilies` assigns the skills shipped by open-skills.
3. Intersect taxonomy assignments with the installed siblings. Do not show an absent pack skill as installed.
4. For every installed sibling, read current `SKILL.md` frontmatter for name, description, triggers, and optional runtime. Detect `protocol.yon` directly from that sibling folder.
5. Put an installed sibling absent from `SkillFamilies` under **Unclassified** with its source-derived description. Do not guess a best-fit family and do not modify the taxonomy.
6. If taxonomy parsing fails, report that the categorized menu is unavailable and list installed skill names alphabetically under **Unclassified**. Do not silently fall back to the old embedded roster.

## Render

- In full-menu mode, show each family label followed by one line per installed skill: marker, name, and the first complete sentence of its live description.
- In family mode, show name, full live description, trigger phrases, format, and runtime. Runtime defaults to `[claude, codex, agents]` when absent.
- In need-matching mode, name the matched phrases that support each route. If nothing matches, say so and offer `/new-skill-creator` or `/insight-skill-gap` rather than fabricating a recommendation.
- Keep **Unclassified** last. State that it means “installed but not assigned by this pack's taxonomy,” not “unsafe” or “low quality.”

Marker legend:

- **◆** `SKILL.md` plus a declarative, mechanically validatable `protocol.yon`
- **◇** `SKILL.md` without a protocol companion

## Boundary

This skill reads installed metadata and reports it. It does not install, edit, classify, or execute other skills. To scaffold a new skill use `/new-skill-creator`.
