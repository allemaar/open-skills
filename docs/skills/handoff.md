# handoff

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Creates a structured brief for a fresh agent or session.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- An autonomous task needs transferring.
- You are switching sessions or packaging parallel work.

## When not to use it

- The current session should simply become coordinator.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/handoff Create a handoff for the remaining import flow.
```

## Flow

1. Identify objective, profile, scope and constraints.
2. Gather required sources and acceptance checks; an empty required-source list needs explicit confirmation and yields advisory mode. A new-session continuation without single-shot acceptance may omit a verify command.
3. Exclusively create and verify the structured brief, preserving existing artifacts on collision; selected revisions require current identity and recovery. Compact continuation keeps source and retro obligations and does not claim an unsaved draft is complete.
4. Provide the artifact and activation phrase.
5. Use the actual saved-path activation in the receiving session; pasted background alone does not select execution.

## Subagents

An orchestrator profile can describe parallel tasks; writing a brief does not dispatch them.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A handoff file and chat surface.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/handoff/SKILL.md](../../skills/handoff/SKILL.md)
- [skills/handoff/protocol.yon](../../skills/handoff/protocol.yon)
- [skills/handoff/profiles/new-session.md](../../skills/handoff/profiles/new-session.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
