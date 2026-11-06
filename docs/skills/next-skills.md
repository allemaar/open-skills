# next-skills

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A skill has finished and you want to see its declared next steps without starting a chain automatically. This protocol reads that skill’s own successor list and offers the available phrases and reasons for the caller to choose.

The choices are suggestions, not an execution chain. An empty list results in silence and an unresolved preview name does not borrow a different skill’s successors.

## Where it fits

Use skills-help to browse the live installed library; use next-skills for declared successors of one skill.

**Family:** Skill library. **Subagents:** No subagent step prescribed.

## When to use it

- A participating skill completes.
- You want to preview recommended successors.

## When not to use it

- You need a full installed-skills inventory.

## How to use it

Start with a concrete request. For example:

```text
/next-skills verify
```

## Flow

1. Bind the explicitly requested preview skill or just-completed hook source before reading its declared successors; unresolved preview names never inherit an unrelated predecessor.
2. Stop silently if it is empty.
3. Offer phrases and reasons, and activate only on selection.

## Common questions

**Does a recommendation run automatically?**

No. The caller chooses whether to activate a successor.

**What if the named skill has no declared successors?**

The protocol stops silently. An unresolved name is not replaced with an unrelated previous skill.

## It is working when

- Each offered option comes from the correct source skill and includes its declared reason.
- No successor is invoked merely because it was offered.

## Subagents

The recommendation protocol does not spawn agents.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An optional list of successor choices.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/next-skills/SKILL.md](../../skills/next-skills/SKILL.md)
- [skills/next-skills/protocol.yon](../../skills/next-skills/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
