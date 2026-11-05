# ask-me

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Interviews a person to turn an idea, task or decision into a usable working brief.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You explicitly request an interview about an idea or decision.
- Consequential choices need clarification before work starts.

## When not to use it

- An ordinary task request does not implicitly select an extended interview.
- A specialized skill owns the authoring interview.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/ask-me Interview me about the choices for a community workshop.
```

## Flow

1. Reuse supplied goals, constraints, facts and documents.
2. Ask small rounds at the unresolved dependency frontier and explain tradeoffs.
3. Separate settled decisions, proposals and unresolved questions; stop when the brief is sufficient or the user stops.
4. Capture settled answers only when selected and authorized, reusing the destination owner’s current-revision and recovery guarantees; otherwise return the brief in conversation without a saved-file claim.

## Subagents

The interview does not require subagents or launch its recommendations.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A brief with decisions, context, open questions and a next useful step.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/ask-me/SKILL.md](../../skills/ask-me/SKILL.md)
- [skills/ask-me/references/records.md](../../skills/ask-me/references/records.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
