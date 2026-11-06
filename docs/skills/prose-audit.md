# prose-audit

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A report seems longer than its meaning requires, but you want to know where the load comes from before editing it. This skill compares each passage with the job it performs and reports repetition, filler or structure that adds no useful distinction.

The result cites concrete patterns and severity while preserving meaningful tone and uncertainty. Diagnosis does not imply that the text was machine-written.

## Where it fits

Use human-rewrite for a faithful repair of existing text; use this to identify problems first.

**Family:** Human output. **Subagents:** No subagent step prescribed.

## When to use it

- You want duplicated meaning identified.
- A document needs prose diagnosis.

## When not to use it

- You want a rewrite or proof of AI authorship.

## How to use it

Start with a concrete request. For example:

```text
/prose-audit Diagnose this decision report for repeated claims, inflated wording and sections that delay the verdict. Preserve material qualifications.
```

## Flow

1. Read the pattern catalog and complete index.
2. Assess each element by the job it performs.
3. Report observed patterns with evidence and severity.
4. Preserve meaningful tone and uncertainty; rewrite only if asked.

## Common questions

**Will the audit rewrite the document?**

Only if rewriting is separately requested; the default is a diagnosis.

**Does a familiar writing pattern prove AI authorship?**

No. The audit reports observable patterns and their effects, not a claim about who or what wrote the text.

## It is working when

- Findings identify passages and explain their effect on the reader.
- The report prioritizes material problems without treating useful emphasis as automatic duplication.

## Subagents

Diagnosis does not require a subagent.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A verdict and prioritized findings.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prose-audit/SKILL.md](../../skills/prose-audit/SKILL.md)
- [skills/prose-audit/references/pattern-catalog.md](../../skills/prose-audit/references/pattern-catalog.md)
- [skills/prose-audit/references/pattern-index.md](../../skills/prose-audit/references/pattern-index.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
