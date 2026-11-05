# write-spec

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Synthesizes supplied discussion and established evidence into a behavioral specification with explicit decisions and gaps.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You need a spec from a conversation or established notes.
- A feature, refactor or operation needs its agreed behavior captured.

## When not to use it

- You need an implementation plan, execution or tracker publication.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/write-spec Turn our discussion into a spec, preserving the retry decision and unresolved timeout.
```

## Flow

1. Read the selected source and identify the audience and boundaries.
2. Reconcile corrections, evidence, agreed behavior and proposals without inventing decisions.
3. Shape observable acceptance, constraints and unresolved gaps for the subject.
4. Return a draft or save only to an authorized safe destination.

## Subagents

No worker is required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A readable specification, source coverage, open questions and actual save status.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/write-spec/SKILL.md](../../skills/write-spec/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
