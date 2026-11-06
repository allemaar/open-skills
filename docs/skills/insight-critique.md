# insight-critique

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have one concrete output, such as an API migration plan, and want focused feedback before deciding what to do next. Insight-critique classifies the subject, then separates purpose and strengths from severity-ranked risks and actionable fixes.

The verdict is advisory. Approved requires only low or cosmetic risks; a critique does not itself authorize execution.

## Where it fits

Use it for a specific plan, code change, architecture or UI. Insight-adversarial adds distinct critic lenses; option generation belongs to insight-explore.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want focused feedback on a specific output.
- You want a quality review before proceeding.

## When not to use it

- You want multi-persona stress testing; use insight-adversarial.
- You need to generate or compare options; use insight-explore or insight-assess.

## How to use it

Start with a concrete request. For example:

```text
/insight-critique Review this API migration plan against its stated compatibility and rollback requirements.
```

## Flow

1. Classify the subject as code, plan, architecture, or UI.
2. Summarize purpose, scope, and approach.
3. Identify specific strengths and rank risks.
4. Pair risks with concrete must-fix or optional fixes.
5. Return the report and verdict.

## Common questions

**Can a Conditional verdict start implementation?**

Not by itself. Execution needs the relevant approved executable plan and applicable authority.

## It is working when

- The report gives a summary, specific strengths, ranked risks, concrete fixes and a verdict consistent with the risks.

## Subagents

Caller Options resolves inline or delegated venue for the invocation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A Summary, Strengths, Risks, and Fixes report with Approved, Conditional, or Not Approved verdict.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-critique/SKILL.md](../../skills/insight-critique/SKILL.md)
- [skills/insight-critique/protocol.yon](../../skills/insight-critique/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
