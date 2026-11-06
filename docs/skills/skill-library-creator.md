# skill-library-creator

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A team has several related skills and wants a shared source with a manager that teammates can use independently. The creator establishes a physical library, family prefix and purpose, then previews the manager and the exact local installation targets before creating them.

Each machine selects its own local links. Verify source content and linked bytes separately from runtime discovery. Existing managers use a reviewed baseline/current/incoming upgrade comparison that preserves customizations and recovery instead of regenerating over them.

## Where it fits

Use skill-library-creator for a family and its manager. Skill-smith handles individual skill authoring; storage sharing and publication remain with their respective owners.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- You want a shared skills pool under a chosen folder.
- You want teammates to use the library through independently selected local installations.

## When not to use it

- You want to author one skill; use skill-smith.
- You want external publication, provider sync, permission administration, or global directive changes.

## How to use it

Start with a concrete request. For example:

```text
/skill-library-creator Create a research skills library under the project folder with the prefix research, and preview the selected project installation target before linking it.
```

## Flow

1. Set parent folder and family prefix; identify installation scope and actual targets.
2. Reuse supplied choices and discoverable facts; ask only consequential gaps, with an optional deeper interview. Preferences do not authorize creation or installation, and a preview-only request stays preview-only.
3. Inspect paths and preview the proposed tree and local targets.
4. Pass the exact selected target subset explicitly; all-default scope is valid only when all displayed defaults were selected.
5. Create manager, README, resources, and selected links.
6. Verify source files and linked content separately from runtime discovery.
7. Report manager location, installation results, blockers, and starter requests.

## Common questions

**Does creating a library configure sharing for teammates?**

No. Storage permissions and transport are external, and each teammate chooses and reconciles their own installation targets.

**Does updating the creator automatically update existing managers?**

No. An existing manager requires a separate reviewed upgrade, including a merge when both the local copy and incoming template changed.

## It is working when

- The result identifies the manager, exact selected targets, verified links and any unobserved runtime pickup.
- A reviewed upgrade preserves customizations and recoverable baselines or reports the conflict without overwriting them.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
