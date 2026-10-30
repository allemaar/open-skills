# agent-output

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Compresses agent-to-agent reports while preserving decision-critical evidence and caveats.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- A worker must report an outcome or blocker.
- A reviewer must communicate actionable findings.

## When not to use it

- You need human-facing prose or message transport.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/agent-output Compress this worker report.
```

## Flow

1. Lead with state and result.
2. Include exact evidence, changes and material gaps.
3. Give the next action while retaining scope, uncertainty and gates.

## Subagents

The contract does not dispatch agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A compact operational report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/agent-output/SKILL.md](../../skills/agent-output/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
