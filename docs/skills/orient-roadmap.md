# orient-roadmap

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Show upcoming increments, gates and deferred work.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask what comes next
- Inspect the forward runway

## When not to use it

- A retrospective change summary

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/orient-roadmap what comes next for this project?
```

## Flow

1. Name the subject and desired horizon
2. Gather bounded read-only evidence
3. Identify increments, gates and deferred lanes
4. Explain needed connections from already gathered evidence in the selected human face; name unestablished connections as gaps.
5. Render the appropriate result with uncertainty and source limits
6. When checking the agent record, reject malformed nonempty quoted provenance pairs; this is not full-schema validation.
7. Synthetic examples identify every payload field or entry with an exact provenance rider; example values are not live project attestation.

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
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
