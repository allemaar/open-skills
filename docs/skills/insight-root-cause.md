# insight-root-cause

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Investigates an observed or recurring problem by tracing evidence-linked causes and competing explanations.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want to explain why an observed problem occurred.
- You need supported causes separated from contributors and open hypotheses.

## When not to use it

- The event is hypothetical; use insight-premortem.
- You want broad lessons after an implementation; use insight-retro.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-root-cause Find why the scheduled import keeps stopping early.
```

## Flow

1. Describe the event, expected behavior, timeframe, scope, and impact.
2. Build causal hypotheses with evidence and a disconfirming check for each link.
3. Challenge timing, mechanism, and competing explanations.
4. Report supported causes separately and propose a test or countermeasure without running it.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; possible slices include timeline, alternative causes, and disconfirmation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Evidence-linked causal account, unresolved hypotheses, and proposed checks or countermeasures.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-root-cause/SKILL.md](../../skills/insight-root-cause/SKILL.md)
- [skills/insight-root-cause/protocol.yon](../../skills/insight-root-cause/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
