# insight-root-cause

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A recurring import stops early and the team has several explanations. Root-cause analysis establishes what was observed, when and under what conditions, then connects each causal hypothesis to supporting evidence and a disconfirming check.

Alternative or interacting causes can branch. If evidence cannot distinguish them, return an unresolved causal question and a proposed discriminating check instead of forcing a single answer.

## Where it fits

Use it for an observed problem. Premortem considers hypothetical future failure; retro looks more broadly at completed work.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want to explain why an observed problem occurred.
- You need supported causes separated from contributors and open hypotheses.

## When not to use it

- The event is hypothetical; use insight-premortem.
- You want broad lessons after an implementation; use insight-retro.

## How to use it

Start with a concrete request. For example:

```text
/insight-root-cause Use these import logs, expected behavior and failure times to investigate why the scheduled job stops early.
```

## Flow

1. Describe the event, expected behavior, timeframe, scope, and impact.
2. Build causal hypotheses with evidence and a disconfirming check for each link.
3. Challenge timing, mechanism, and competing explanations.
4. Report supported causes separately and propose a test or countermeasure without running it.

## Common questions

**Must I ask exactly five whys?**

No. Continue to supported actionable conditions or the evidence boundary; neither a fixed count nor a single cause is required.

## It is working when

- The account separates supported causes, contributors and unresolved hypotheses, and proposes a test or countermeasure without executing it.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; possible slices include timeline, alternative causes, and disconfirmation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Evidence-linked causal account, unresolved hypotheses, and proposed checks or countermeasures.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-root-cause/SKILL.md](../../skills/insight-root-cause/SKILL.md)
- [skills/insight-root-cause/protocol.yon](../../skills/insight-root-cause/protocol.yon)
- [skills/insight-root-cause/references/competing-hypotheses.md](../../skills/insight-root-cause/references/competing-hypotheses.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
