# freshness-contract

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a passing test or earlier report and need to decide whether it still supports today’s decision. Classify the evidence, check changes and invalidators, and use the table to decide whether to reuse, spot-check or re-verify it.

Its table selects reuse, a discriminating spot-check or re-verification. A missing cheap discriminator does not erase a mandatory re-verification requirement.

## Where it fits

Use this before reusing existing evidence; use a fresh investigation or test to establish a new claim.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You are about to reuse a prior test or report.
- Intervening changes may invalidate evidence.

## When not to use it

- You need to establish a new claim from scratch.

## How to use it

Start with a concrete request. For example:

```text
/freshness-contract Can yesterday’s integration test support this release? The service configuration changed after the run; the test used a local database.
```

## Flow

1. Classify the artifact and decision.
2. Identify age anchors, intervening changes and invalidators.
3. Apply the restrictive table: reuse, spot-check or re-verify; accept labeled risk only in the no-cheap-discriminator case.
4. After selecting any spot-check row, handle missing discriminators without relaxing mandatory re-verification.

## Common questions

**Does an old passing result automatically expire?**

Not solely because it is old. The applicable category, anchors and changes determine what the evidence can still support.

**Does a matching hash prove an old specification still governs?**

No. The bytes can be unchanged while the governing version or dependency has been superseded; applicability to the current decision still matters.

## It is working when

- The decision names the artifact, current use, invalidators and selected freshness action.
- Any required follow-up or unaccepted uncertainty is explicit.

## Subagents

This lookup does not prescribe delegation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A freshness decision and required follow-up.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/freshness-contract/SKILL.md](../../skills/freshness-contract/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
