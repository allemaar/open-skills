# extract-signal

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Turns noisy sources into vetted signal in the requested form.

**Family:** Priming. **Subagents:** Conditional.

## When to use it

- You need evidence gathered for a decision.
- Audience, stakes and destination can be identified.

## When not to use it

- You need only a raw fetch.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/extract-signal Extract the signal from these complaints as a decision brief.
```

## Flow

1. Infer the signal, audience, stakes and destination.
2. The root composes gathering and review without nested dispatch; bind finite tool, wave and time limits.
3. Report provenance, confidence and gaps, matching sensitivity to destination.

## Subagents

The root coordinates bounded leaf gathering and a separate sibling cold reviewer when needed. Ordinary in-session gathering is direct; only a dispatched leaf requires a primed brief. A leaf never spawns, discloses dependence and returns unmet independent-review requirements.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A vetted signal in the requested form.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/extract-signal/SKILL.md](../../skills/extract-signal/SKILL.md)
- [skills/extract-signal/protocol.yon](../../skills/extract-signal/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
