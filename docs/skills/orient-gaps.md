# orient-gaps

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You need to know what is blocking a project, including loose ends easy to miss in a status update. Orient-gaps uses one bounded read-only worker to gather evidence, then distinguishes attributed blockers and open choices from plausible but unproven silent gaps.

Audit mode also checks claims against evidence and identifies activity signals that overstate what they show. If the worker cannot run, the result is partial or unavailable, not evidence that nothing is stuck.

## Where it fits

Use it for the stall surface. Orient-status answers position and estimated completion; orient-map shows change; investigate supports deeper fact gathering.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask what is stuck
- Check claims against evidence with --audit

## When not to use it

- A full progress estimate or roadmap

## How to use it

Start with a concrete request. For example:

```text
/orient-gaps Check this repository and current plan for blockers and loose ends; distinguish my dependencies from those awaiting others.
```

## Flow

1. Name the subject and optional audit mode
2. Gather evidence through the required bounded read-only worker
3. Separate confirmed blockers from inferred gaps
4. Explain needed connections from already gathered evidence in the selected human face; name unestablished connections as gaps.
5. Return the consumer-appropriate result and evidence limits
6. When checking the agent record, reject malformed nonempty quoted provenance pairs; this is not full-schema validation.
7. Synthetic examples identify every payload field or entry with an exact provenance rider; example values are not live project attestation.

## Common questions

**Does a missing test file prove work was not done?**

Only an acceptance requirement for that file makes its absence a mismatch. Other valid evidence may establish work within the bounded read.

## It is working when

- The orientation names supported stalls, inferred gaps, provenance and unexamined tiers, including an explicit none-surfaced statement where appropriate.

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh gap and blocker orientation.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-gaps/SKILL.md](../../skills/orient-gaps/SKILL.md)
- [skills/orient-gaps/protocol.yon](../../skills/orient-gaps/protocol.yon)
- [skills/orient-gaps/references/orient-spec/orient-contract.md](../../skills/orient-gaps/references/orient-spec/orient-contract.md)
- [skills/orient-gaps/references/tools/orient-validate.mjs](../../skills/orient-gaps/references/tools/orient-validate.mjs)
- [skills/orient-gaps/references/orient-spec/examples/orient-record.example.yon](../../skills/orient-gaps/references/orient-spec/examples/orient-record.example.yon)
- [skills/orient-gaps/references/orient-spec/orient-record.yon](../../skills/orient-gaps/references/orient-spec/orient-record.yon)
- [skills/orient-gaps/references/orient-spec/family-behaviors.md](../../skills/orient-gaps/references/orient-spec/family-behaviors.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
