# ask-gate

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You are about to interrupt someone for a decision. Ask-gate first checks whether the request, available evidence or an ordinary choice within existing authority already settles it. If so, the agent states the choice and continues; a missing approval remains the Handler's decision.

Routine questions use a quality checklist. Consequential or difficult-to-frame questions receive bounded review of the question and options when suitable helpers are available.

## Where it fits

Use it at the moment of asking. Caller-options selects how a skill runs; next-skills offers possible follow-on work.

**Family:** Orchestration & dispatch. **Subagents:** No subagent step prescribed.

## When to use it

- You are about to ask the Handler.
- A consequential decision needs sound framing.

## When not to use it

- You need an interview about an idea or project rather than triage of a pending question; use ask-me for that broader conversation.

## How to use it

Start with a concrete request. For example:

```text
/ask-gate I can use the existing export format or change it; check whether this needs my decision and frame the question if it does.
```

## Flow

1. First triage the pending question: resolve answerable preferences within existing authority, state the choice and continue without asking. Reuse exact authorization; missing approval remains unresolved.
2. Classify a necessary question as routine or high stakes.
3. For routine questions, apply the local question-quality checklist. Before high-stakes helpers, check their availability and subject fit.
4. For suitable available high-stakes helpers, critique the candidate questions, then assess their framing and options. Otherwise use the existing local checklist and disclose a materially skipped method without claiming it ran.
5. Ask only after the applicable checklist or critique-then-assess path, with clear options and the recommendation first.

## Common questions

**Can a default replace missing approval?**

No. Defaults resolve ordinary preferences within authority; they do not grant consent or replace a required approval.

## It is working when

- A resolvable choice is stated without a question, or a necessary decision is presented with clear options and a recommendation.

## Subagents

Deliberation does not require a subagent.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A resolved choice or quality-checked question.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/ask-gate/SKILL.md](../../skills/ask-gate/SKILL.md)
- [skills/ask-gate/protocol.yon](../../skills/ask-gate/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
