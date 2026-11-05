# orient-status

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Show current position, remaining work and an estimated completion band.

**Family:** Orientation. **Subagents:** Part of the workflow.

## When to use it

- Ask how far along a task is
- Rebuild context with --resume

## When not to use it

- A detailed blocker audit or forward roadmap

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/orient-status where are we on this project?
```

## Flow

1. Name the subject and any resume context
2. Gather bounded read-only evidence
3. Assess position, remaining work and ETA uncertainty
4. Explain needed connections from already gathered evidence in the selected human face; name unestablished connections as gaps.
5. Return the appropriate result with source limits
6. When checking the agent record, reject malformed nonempty quoted provenance pairs; this is not full-schema validation.
7. Synthetic examples identify every payload field or entry with an exact provenance rider; example values are not live project attestation.
8. Consume absent family topology as unknown, never as false/trunk or a basis for a topology-dependent ETA.

## Subagents

Use one bounded read-only subagent. If unavailable, refusing or timed out, report partial or unavailable evidence without gathering inline or extending the bound.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A fresh status and banded ETA when evidence supports one.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orient-status/SKILL.md](../../skills/orient-status/SKILL.md)
- [skills/orient-status/protocol.yon](../../skills/orient-status/protocol.yon)
- [skills/orient-status/references/orient-spec/orient-contract.md](../../skills/orient-status/references/orient-spec/orient-contract.md)
- [skills/orient-status/references/tools/orient-validate.mjs](../../skills/orient-status/references/tools/orient-validate.mjs)
- [skills/orient-status/references/orient-spec/examples/orient-record.example.yon](../../skills/orient-status/references/orient-spec/examples/orient-record.example.yon)
- [skills/orient-status/references/orient-spec/orient-record.yon](../../skills/orient-status/references/orient-spec/orient-record.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
