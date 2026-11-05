# prime-fetch

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Delegates one read-only fetch and returns a filtered digest.

**Family:** Priming. **Subagents:** Part of the workflow.

## When to use it

- One search would flood the caller's context.
- You need anchored findings from one tool call.

## When not to use it

- You need writes or multi-source investigation.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/prime-fetch Fetch relevant matches for this function.
```

## Flow

1. Specify one read-only call and objective.
2. A subagent returns a filtered digest with proof of work.
3. Verify each finding against its source and quoted evidence or exact token; report missing proof.

## Subagents

One delegated subagent executes the fetch in a single wave. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A proof-of-work-verified digest.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prime-fetch/SKILL.md](../../skills/prime-fetch/SKILL.md)
- [skills/prime-fetch/protocol.yon](../../skills/prime-fetch/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
