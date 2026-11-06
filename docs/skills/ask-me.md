# ask-me

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have an idea, task or decision that is not ready to act on. Bring a rough thought, notes or an existing document. The interview develops a useful brief without starting the resulting work.

The first questions address choices that change the next step. If a workshop audience is already settled, the format may be the useful question; if the audience is unsettled, detailed format choices may be premature.

The skill reuses supplied facts and asks small rounds, reflects settled answers and remaining forks, and separates recommendations from decisions. A sufficient brief may need no questions; stopping early returns a useful partial brief.

## Where it fits

Use this for an explicitly requested interview. A specialized authoring interview may be a better fit for its own artifact.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You explicitly request an interview about an idea or decision.
- Consequential choices need clarification before work starts.

## When not to use it

- An ordinary task request does not implicitly select an extended interview.
- A specialized skill owns the authoring interview.

## How to use it

Start with a concrete request. For example:

```text
/ask-me Help me shape a community workshop. I have two hours, a mixed audience and no agreed format yet.
```

## Flow

1. Reuse supplied goals, constraints, facts and documents.
2. Ask small rounds at the unresolved dependency frontier and explain tradeoffs.
3. Separate settled decisions, proposals and unresolved questions; stop when the brief is sufficient or the user stops.
4. Capture settled answers only when selected and authorized, reusing the destination owner’s current-revision and recovery guarantees; otherwise return the brief in conversation without a saved-file claim.

## Common questions

**Will the interview launch the work it describes?**

No. It produces a brief and a next useful step; execution is a separate choice.

**Can I bring an existing document?**

Yes. It can supply facts and choices already settled, avoiding repeated questions. Reading it does not itself authorize writing back.

**What does “with docs” mean?**

When durable capture is selected and a destination is authorized, the optional records route preserves settled answers using the destination’s revision and recovery guarantees. An unknown or unsafe destination yields proposed text, not a saved-file claim.

## It is working when

- The brief records the goal, relevant context, decisions and unresolved choices without treating suggestions as decisions.
- Questions stop when the brief is sufficient or the person ends the interview.

## Subagents

The interview does not require subagents or launch its recommendations.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A brief with decisions, context, open questions and a next useful step.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/ask-me/SKILL.md](../../skills/ask-me/SKILL.md)
- [skills/ask-me/references/records.md](../../skills/ask-me/references/records.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
