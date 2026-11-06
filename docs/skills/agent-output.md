# agent-output

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A worker has finished a slice and the receiving agent needs to know whether it can proceed. A compact report puts the outcome, exact supporting evidence, changed artifact, material gap and next action in reach without making the receiver read the full work history.

The envelope is optional: a short update can use two lines, and findings use their own fields. Compression must retain scope, failed checks, uncertainty and authority or stop conditions that could change the recipient's decision.

## Where it fits

Choose agent-mailbox for message transport, handoff for a cold-agent context package, and human-output for prose addressed to a person.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- A worker must report an outcome or blocker.
- A reviewer must communicate actionable findings.

## When not to use it

- You need human-facing prose or message transport.

## How to use it

Start with a concrete request. For example:

```text
/agent-output Compress this worker report: the parser fix passed its focused test, the integration suite was not run, and the changed file is src/parser.ts.
```

## Flow

1. Lead with state and result.
2. Include exact evidence, changes and material gaps.
3. Give the next action while retaining scope, uncertainty and gates.

## Common questions

**Do I need every envelope field?**

No. Omit empty fields and use a smaller update when it carries the needed information.

**Can the report omit an untested scope to save space?**

No. Material gaps and reversing caveats remain part of the fidelity floor.

## It is working when

- The recipient can identify the result and its supporting evidence without reconstructing the work chronology.
- Material uncertainty, authority limits and the next required action remain visible.

## Subagents

The contract does not dispatch agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A compact operational report.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/agent-output/SKILL.md](../../skills/agent-output/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
