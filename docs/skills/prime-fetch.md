# prime-fetch

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

One repository search is expected to return a large amount of noise, but the caller needs only matches relevant to a specific question. A single worker performs the specified read-only call and returns a digest with evidence, discarded categories, unfollowed pointers and gaps.

The lead checks each finding and pointer against a rereadable source or independently retained capture using exact proof. A match only to a worker-provided excerpt is not independent provenance and remains an attributed gap.

## Where it fits

Prime-expand frames a vague question, prime-fetch handles one read-only call, and prime-sweep addresses a multi-source investigation.

**Family:** Priming. **Subagents:** Part of the workflow.

## When to use it

- One search would flood the caller's context.
- You need anchored findings from one tool call.

## When not to use it

- You need writes or multi-source investigation.

## How to use it

Start with a concrete request. For example:

```text
/prime-fetch Run one read-only search for 'retry budget' in the supplied repository and return only relevant matches with source lines and exact proof.
```

**Required skills:** [caller-options](caller-options.md). Install these first.

## Flow

1. Specify one read-only call and objective.
2. A subagent returns a filtered digest with proof of work.
3. Verify each finding against its source and quoted evidence or exact token; report missing proof.

## Common questions

**What if safe bounded delegation is unavailable?**

Stop the dependent operation. Mandatory delegation has no inline source-gathering fallback.

## It is working when

- Each relayed finding and pointer has source-grounded proof checked by a deterministic tool call.
- Discarded categories and coverage gaps are reported, including any provenance-unverified material.

## Subagents

One delegated subagent executes the fetch in a single wave. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A proof-of-work-verified digest.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prime-fetch/SKILL.md](../../skills/prime-fetch/SKILL.md)
- [skills/prime-fetch/protocol.yon](../../skills/prime-fetch/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
