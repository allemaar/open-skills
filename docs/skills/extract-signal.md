# extract-signal

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a pile of source material and need an answer in a particular form, such as a risk list or decision brief. Extract-signal chooses gathering and vetting methods that fit the question and stakes, then returns the signal with provenance, confidence and remaining gaps.

The root coordinates bounded gathering and independent review. A dispatched leaf works from its brief without spawning children; same-context assessment is not described as a cold opinion. Material disagreements remain visible.

## Where it fits

Use it when the work includes gathering and vetting. Prime-fetch is smaller for one noisy call; human-merge reconciles reports already produced.

**Family:** Priming. **Subagents:** Conditional.

## When to use it

- You need evidence gathered for a decision.
- Audience, stakes and destination can be identified.

## When not to use it

- You need only a raw fetch.

## How to use it

Start with a concrete request. For example:

```text
/extract-signal Read these customer complaints and incident log; return a decision brief on the recurring problem, with source pointers and disagreements.
```

## Flow

1. Infer the signal, audience, stakes and destination.
2. The root composes gathering and review without nested dispatch; bind finite tool, wave and time limits.
3. Report provenance, confidence and gaps, matching sensitivity to destination.

## Common questions

**What if a public destination cannot receive details from internal sources?**

Sensitive details are withheld and the omission is flagged to match the destination.

## It is working when

- The requested signal includes its load-bearing sources, confidence, gaps and techniques actually used.

## Subagents

The root coordinates bounded leaf gathering and a separate sibling cold reviewer when needed. Ordinary in-session gathering is direct; only a dispatched leaf requires a primed brief. A leaf never spawns, discloses dependence and returns unmet independent-review requirements.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A vetted signal in the requested form.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/extract-signal/SKILL.md](../../skills/extract-signal/SKILL.md)
- [skills/extract-signal/protocol.yon](../../skills/extract-signal/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
