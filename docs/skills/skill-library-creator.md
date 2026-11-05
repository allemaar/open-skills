# skill-library-creator

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Creates a portable skill library with its own family manager, guidance, authoring resources, and optional local links into selected harness locations.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- You want a shared skills pool under a chosen folder.
- You want teammates to use the library through independently selected local installations.

## When not to use it

- You want to author one skill; use skill-smith.
- You want external publication, provider sync, permission administration, or global directive changes.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/skill-library-creator Create a shared research-skills library under the project folder.
```

## Flow

1. Set parent folder and family prefix; identify installation scope and actual targets.
2. Reuse supplied choices and discoverable facts; ask only consequential gaps, with an optional deeper interview. Preferences do not authorize creation or installation, and a preview-only request stays preview-only.
3. Inspect paths and preview the proposed tree and local targets.
4. Create manager, README, resources, and selected links.
5. Verify source files and linked content separately from runtime discovery.
6. Report manager location, installation results, blockers, and starter requests.
7. Pass the exact selected target subset explicitly; all-default scope is valid only when all displayed defaults were selected.

## Subagents

The creation and upgrade guides specify no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A portable library and standalone family manager with selected installation links and a creation summary. Updating the creator does not change existing generated managers; their upgrades remain separate.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/skill-library-creator/SKILL.md](../../skills/skill-library-creator/SKILL.md)
- [skills/skill-library-creator/references/create-library.md](../../skills/skill-library-creator/references/create-library.md)
- [skills/skill-library-creator/references/upgrades.md](../../skills/skill-library-creator/references/upgrades.md)
- [skills/skill-library-creator/protocol.yon](../../skills/skill-library-creator/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
