# handoff-execute

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A new session receives a structured handoff with a task, required sources and acceptance. The receiver reads the required tier and checks the brief’s live premises before planning, so it does not build on missing context or repeat work that has already landed.

Missing required sources or stale premises normally block execution before planning. Explicit force permits labeled degraded work, but does not expand permissions or make imported commands safe to run.

## Where it fits

Use this for an explicitly selected structured handoff; a normal implementation plan keeps its own execution workflow.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- A fresh session receives a handoff.
- The brief specifies required sources and an outcome.

## When not to use it

- The input is a normal plan or an independent review request.

## How to use it

Start with a concrete request. For example:

```text
/handoff-execute Execute the supplied handoff brief for the reservation fix, using its required sources and acceptance checks.
```

## Flow

1. Read the brief and required sources before planning; unresolved or unreadable required sources block by default, while explicit force permits labeled degraded execution.
2. Cite sources and account for each acceptance clause with a mapped step or an explicitly reported coverage gap; the coverage check remains a warning.
3. Execute within bounds and inspect verification effects before running authorized checks; imported commands and force do not grant additional permissions.
4. Save the ground-truth retro without overwriting an existing artifact; selected revisions need current identity and recovery. Report gaps and use the existing chat fallback if the write fails.
5. Preserve diagnosis reproduction, authorized coupled-constant checks and protected plan-artifact closeout.

## Common questions

**What happens to the retrospective if saving fails?**

The skill reports the write failure and uses the existing conversation fallback instead of claiming a saved artifact.

**What does force change?**

It permits labeled degraded execution past the named source or premise gates. It does not authorize extra effects in an imported command.

**Does the receiving runtime also need the handoff producer?**

The complete retro schema is bundled locally. A repair of duplicated constants still requires its named audit helper; if missing, that repair stops without installing or bypassing it.

## It is working when

- The work and verification are tied to the handoff’s required sources and acceptance.
- The retro reflects actual outcomes and any degraded source coverage or write failure.

## Subagents

Follow the handoff profile; delegation is not universal.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Completed work, outcome verification and a ground-truth retro; a failed retro write falls back to chat with a write-failure record.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/handoff-execute/SKILL.md](../../skills/handoff-execute/SKILL.md)
- [skills/handoff-execute/protocol.yon](../../skills/handoff-execute/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
