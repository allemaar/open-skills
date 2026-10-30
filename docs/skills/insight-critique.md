# insight-critique

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Reviews one existing plan, code change, architecture, or UI output and reports strengths, risks, and fixes.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want focused feedback on a specific output.
- You want a quality review before proceeding.

## When not to use it

- You want multi-persona stress testing; use insight-adversarial.
- You need to generate or compare options; use insight-explore or insight-assess.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-critique Review this API migration plan for gaps.
```

## Flow

1. Classify the subject as code, plan, architecture, or UI.
2. Summarize purpose, scope, and approach.
3. Identify specific strengths and rank risks.
4. Pair risks with concrete must-fix or optional fixes.
5. Return the report and verdict.

## Subagents

Caller Options resolves inline or delegated venue for the invocation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A Summary, Strengths, Risks, and Fixes report with Approved, Conditional, or Not Approved verdict.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-critique/SKILL.md](../../skills/insight-critique/SKILL.md)
- [skills/insight-critique/protocol.yon](../../skills/insight-critique/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
