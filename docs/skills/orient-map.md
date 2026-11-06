# orient-map

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You return to a project and want to know what moved since your last look and where the current work sits. A bounded read-only worker gathers the delta and trajectory from available evidence; the result makes missing topology visible.

Unknown topology stays unknown: unsupported layout and dependent fields are omitted while independently evidenced nodes and changes remain visible. The record validator has a defined scope and is not a full-schema proof.

## Where it fits

Use orient-status for progress and estimates, and orient-roadmap for the upcoming sequence.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask what changed
- See the current branch trajectory

## When not to use it

- A detailed roadmap or progress estimate

## How to use it

Start with a concrete request. For example:

```text
/orient-map Show what changed in this repository since the supplied Git anchor and where the current branch sits. The objective is to finish the migration.
```

## Flow

1. Name the subject and last-look anchor if available
2. Gather bounded read-only evidence
3. Determine the delta and done-to-next trajectory
4. Emit only evidenced topology fields. An absent optional boolean means unknown, never trunk: omit unsupported dependents/layout, retain independently evidenced nodes and show explicit uncertainty.
5. Explain needed connections from already gathered evidence in the selected human face; name unestablished connections as gaps.
6. Synthetic examples identify every payload field or entry with an exact provenance rider; example values are not live project attestation.
7. When checking the agent record, reject malformed nonempty quoted provenance pairs; this is not full-schema validation.
8. Return the appropriate visual or agent record with evidence limits

## Common questions

**What if no baseline or trunk is established?**

Show the evidence that exists and state the missing anchor or topology; do not infer a trunk.

**What if the worker times out?**

Report partial or unavailable evidence. A timeout is not evidence that no substrate exists, and the workflow does not silently gather inline.

## It is working when

- The map connects the observed delta to its evidence and names any missing baseline.
- Unsupported topology is omitted and provenance is preserved in the selected output.

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh map and delta.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-map/SKILL.md](../../skills/orient-map/SKILL.md)
- [skills/orient-map/protocol.yon](../../skills/orient-map/protocol.yon)
- [skills/orient-map/references/orient-spec/orient-contract.md](../../skills/orient-map/references/orient-spec/orient-contract.md)
- [skills/orient-map/references/tools/orient-validate.mjs](../../skills/orient-map/references/tools/orient-validate.mjs)
- [skills/orient-map/references/orient-spec/examples/orient-record.example.yon](../../skills/orient-map/references/orient-spec/examples/orient-record.example.yon)
- [skills/orient-map/references/orient-spec/orient-record.yon](../../skills/orient-map/references/orient-spec/orient-record.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
