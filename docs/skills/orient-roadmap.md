# orient-roadmap

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have returned to a project and want to know what comes after the current increment and what gates the next one. One bounded read-only worker gathers the available plan and repository evidence, and the skill presents the forward arc, gates and deferred lanes with provenance.

Ungrounded intent limits dependent horizons, and barren evidence produces a visibly degraded result rather than a confident runway. An unavailable or timed-out worker is a coverage gap, not evidence that the subject has no substrate. The selected consumer receives the appropriate structured or human-readable face.

## Where it fits

Use orient-roadmap for forward horizons. Orient-status addresses position and remaining time, orient-map looks at change, and plan-create designs work rather than reporting the current roadmap.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask what comes next
- Inspect the forward runway

## When not to use it

- A retrospective change summary

## How to use it

Start with a concrete request. For example:

```text
/orient-roadmap Show the next increments and their gates for this project using the current plan and repository evidence; distinguish deferred work.
```

## Flow

1. Name the subject and desired horizon
2. Gather bounded read-only evidence
3. Identify increments, gates and deferred lanes
4. Explain needed connections from already gathered evidence in the selected human face; name unestablished connections as gaps.
5. Validate the actual current in-memory record with the bundled value checker before emitting any selected consumer face; stop on failure. Its implemented enum/core/provenance checks are not full-schema validation.
6. Render the appropriate result with uncertainty and source limits

## Common questions

**Does an unchanged Git anchor mean the whole roadmap is unchanged?**

No. It supports only the Git inputs checked; plans, intent, conversation and other uncovered inputs must be inspected within the bound or named as unexamined.

**Does the value checker prove the whole record and visual are correct?**

No. It checks its implemented fields and fail-closed conditions on the current record; other emission and cross-face obligations remain to be checked.

## It is working when

- The roadmap distinguishes evidenced increments and gates from inferred or unknown horizons, with source limits visible.
- Worker failure is reported as incomplete, and the current record is checked before the selected consumer face is emitted.

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh forward-looking roadmap.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-roadmap/SKILL.md](../../skills/orient-roadmap/SKILL.md)
- [skills/orient-roadmap/protocol.yon](../../skills/orient-roadmap/protocol.yon)
- [skills/orient-roadmap/references/orient-spec/orient-contract.md](../../skills/orient-roadmap/references/orient-spec/orient-contract.md)
- [skills/orient-roadmap/references/tools/orient-validate.mjs](../../skills/orient-roadmap/references/tools/orient-validate.mjs)
- [skills/orient-roadmap/references/orient-spec/examples/orient-record.example.yon](../../skills/orient-roadmap/references/orient-spec/examples/orient-record.example.yon)
- [skills/orient-roadmap/references/orient-spec/orient-record.yon](../../skills/orient-roadmap/references/orient-spec/orient-record.yon)
- [skills/orient-roadmap/references/orient-spec/family-behaviors.md](../../skills/orient-roadmap/references/orient-spec/family-behaviors.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
