# self-improve

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Detects concrete improvement signals and proposes specific skill changes for approval.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- A participating skill has completed.
- Material or recurring friction has a ready fix.

## When not to use it

- You have a vague impression or want automatic changes.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/self-improve Review the last verify run for improvement.
```

## Flow

1. Identify a concrete run-specific signal.
2. Check materiality or recurrence and readiness of a fix.
3. Draft a precise proposal for approval.
4. Stay silent below threshold and never auto-apply.
5. Apply a selected proposal through its verified canonical source owner and Skill Smith write procedure; preserve managed-owner and revision safeguards.
6. Missing required vetting/approval helpers stop the proposal path; the parent task can complete without an invented protocol pass.

## Subagents

The detector does not prescribe subagents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An approval-ready proposal or no output.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/self-improve/SKILL.md](../../skills/self-improve/SKILL.md)
- [skills/self-improve/protocol.yon](../../skills/self-improve/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
