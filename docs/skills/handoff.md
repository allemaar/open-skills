# handoff

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are changing sessions or transferring a bounded task and do not want the next person to reconstruct the conversation. Handoff produces a structured brief containing the objective, scope, evidence, acceptance, required reading and a route for reporting what happened.

A continuation carries in-flight state and may leave a single-shot verify command empty when none applies. Dispatch profiles require measurable acceptance. An empty required-source list becomes advisory only after explicit confirmation; the saved brief remains canonical.

## Where it fits

Use it to transfer work into a fresh session. Orchestrate-mode makes the current session a coordinator; handoff-execute consumes the saved brief.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- An autonomous task needs transferring.
- You are switching sessions or packaging parallel work.

## When not to use it

- The current session should simply become coordinator.

## How to use it

Start with a concrete request. For example:

```text
/handoff Carry the unfinished import flow into a new session; include the current plan, failing test, changed files and next verification step.
```

## Flow

1. Identify objective, profile, scope and constraints.
2. Gather required sources and acceptance checks; an empty required-source list needs explicit confirmation and yields advisory mode. A new-session continuation without single-shot acceptance may omit a verify command.
3. Exclusively create and verify the structured brief, preserving existing artifacts on collision; selected revisions require current identity and recovery. Compact continuation keeps source and retro obligations and does not claim an unsaved draft is complete.
4. Provide the artifact and activation phrase.
5. Use the actual saved-path activation in the receiving session; pasted background alone does not select execution.

## Common questions

**Is a pasted draft a completed handoff?**

No. The receiving activation is bound to the actual saved brief; text without an authorized save is proposed content.

## It is working when

- The saved brief identifies actionable scope and required sources, and its copyable activation names the actual path.

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
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
