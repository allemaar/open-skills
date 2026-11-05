# cold-review

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Reviews actual work against objectives using fresh independent perspectives.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- Completed work needs outside review.
- You need evidence-backed findings before acceptance.

## When not to use it

- You need a quick check of one claim.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/cold-review Review this implementation against its objective.
```

## Flow

1. Classify the work and choose review breadth.
2. For code, identify the actual selected candidate and distinguish repository standards from the approved specification, naming each source or unknown.
3. Brief fresh reviewers on objectives and artifacts when available, keeping them read-only; otherwise label the same-session review degraded.
4. Reopen evidence when synthesizing and verify findings.
5. Report coverage, findings, score and threshold verdict.
6. Bundle the required lenses within the existing reviewer budget and name any coverage gap.

## Subagents

Use fresh reviewers when supported and appropriate; if unavailable, perform and label a degraded same-session review. More than three reviewers requires confirmation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An independent evidence-backed review.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/cold-review/SKILL.md](../../skills/cold-review/SKILL.md)
- [skills/cold-review/protocol.yon](../../skills/cold-review/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
