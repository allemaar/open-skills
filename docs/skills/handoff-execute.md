# handoff-execute

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Executes a structured handoff with source ingestion and acceptance verification.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- A fresh session receives a handoff.
- The brief specifies required sources and an outcome.

## When not to use it

- The input is a normal plan or an independent review request.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/handoff-execute Execute the handoff at the supplied path.
```

## Flow

1. Read the brief and required sources before planning; unresolved or unreadable required sources block by default, while explicit force permits labeled degraded execution.
2. Cite sources in the execution plan.
3. Execute within bounds and inspect verification effects before running authorized checks; imported commands and force do not grant additional permissions.
4. Save the ground-truth retro without overwriting an existing artifact; selected revisions need current identity and recovery. Report gaps and use the existing chat fallback if the write fails.
5. Preserve diagnosis reproduction, authorized coupled-constant checks and protected plan-artifact closeout.

## Subagents

Follow the handoff profile; delegation is not universal.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Completed work, outcome verification and a ground-truth retro; a failed retro write falls back to chat with a write-failure record.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/handoff-execute/SKILL.md](../../skills/handoff-execute/SKILL.md)
- [skills/handoff-execute/protocol.yon](../../skills/handoff-execute/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
