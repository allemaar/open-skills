# freshness-contract

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Determines whether old evidence remains usable for a current decision.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You are about to reuse a prior test or report.
- Intervening changes may invalidate evidence.

## When not to use it

- You need to establish a new claim from scratch.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/freshness-contract Check whether yesterday's test still supports release.
```

## Flow

1. Classify the artifact and decision.
2. Identify age anchors, intervening changes and invalidators.
3. Apply the restrictive table: reuse, spot-check or re-verify; accept labeled risk only in the no-cheap-discriminator case.

## Subagents

This lookup does not prescribe delegation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A freshness decision and required follow-up.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/freshness-contract/SKILL.md](../../skills/freshness-contract/SKILL.md)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
