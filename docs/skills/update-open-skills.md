# update-open-skills

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have an existing installation and want to know whether a stable release can be adopted without losing local edits. The skill identifies the selected installation, its owner and method, compares the installed bytes and companions with an immutable release, and keeps a check-only request read-only.

When an update is needed, the method-specific route governs application. Preserve local edits and recoverable preimages, stop on conflicts or uncertain ownership, and verify the actual installed state after the operation. A successful manager command or matching source repository alone does not prove that the runtime consumes the updated files.

## Where it fits

Use update-open-skills for an existing installation. Upstream maintenance, publication, new installations and changing installation methods are separate operations.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- Check whether a selected installation is current.
- Update installed skills to a verified stable release.

## When not to use it

- You want to maintain or publish the upstream repository.
- You want a new installation or a switch of installation method.

## How to use it

Start with a concrete request. For example:

```text
/update-open-skills Check the existing project installation against the latest stable release, including local edits and linked-source effects; report only, without updating.
```

## Flow

1. Identify the selected runtime, scope, installation method, installed skills and source identity without following links for inspection.
2. Resolve the selected stable release and migration direction. Load the matching method for read-only provenance and comparison, preserving unknown baselines and unresolved choices.
3. For a real update, disclose destinations, source commit, edit conflicts, shared-source boundary, backups and recovery; settle any additional migration or effect gates.
4. Apply authorized changes through safe physical paths with preimages and current-content checks, stopping on conflict or uncertain recovery.
5. Verify installed files, companions and owner state against the selected release, then report complete, partial or blocked and distinguish disk state from runtime pickup.

## Common questions

**What if the installed files have local edits?**

Compare them with the selected release, disclose conflicts and preserve customizations. A skipped conflict means partial completion, and retained differences prevent a byte-identity claim.

**Does the update prove the running agent has picked it up?**

No. Report verified disk and owner state separately from runtime discovery, and mark pickup unobserved until a documented reload or fresh session is checked.

**What if my installation is newer than the selected stable release?**

The skill reports the direction or release-line difference. A downgrade, divergent line or migration requiring user action needs an explicitly selected migration; it is not silently treated as a routine update.

**What if several installations link to the same checkout?**

The checkout update can affect every linked consumer. The skill identifies links within the inspected roots, discloses that boundary and any unobserved links, and requires selection of the exact shared-source change.

**What if I removed a file locally, or both versions changed an instruction?**

Local deletions stay deleted, and a missing required companion is reported as partial. A both-changed instruction or metadata record stays untouched until the exact merge is selected; it is not automatically accepted because text edits do not overlap.

## It is working when

- The report identifies the selected release commit, runtime, installation method and exact checked scope.
- Any changed files have verified recovery and readback; conflicts and unobserved runtime pickup remain explicit.
- The report names the inspected shared-source boundary, any unobserved links, migration choices and held edit conflicts.

## Subagents

The skill requires no subagent.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A current, updated, partial or blocked installation report with release identity, evidence, conflicts, retained customizations and recovery details.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/update-open-skills/SKILL.md](../../skills/update-open-skills/SKILL.md)
- [skills/update-open-skills/references/methods.md](../../skills/update-open-skills/references/methods.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
