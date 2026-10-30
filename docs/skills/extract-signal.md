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
2. Compose appropriate gathering and vetting methods.
3. Report provenance, confidence and gaps, matching sensitivity to destination.

## Subagents

Normal calls default to a fresh subagent; when the skill is the active agent it works inline.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A vetted signal in the requested form.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/extract-signal/SKILL.md](../../skills/extract-signal/SKILL.md)
- [skills/extract-signal/protocol.yon](../../skills/extract-signal/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
