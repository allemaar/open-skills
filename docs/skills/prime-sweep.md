# prime-sweep

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

The information needed for a task spans several large sources, and you need a compact context digest before planning. Prime-sweep briefs bounded read-only workers by source or lens and requires a source location and proof for each finding and unfollowed pointer.

The lead verifies pointers against rereadable sources or independently retained captures, reconciles conflicts and decides whether objectives are sufficiently covered. A worker's own excerpt can support an attributed gap but cannot independently establish provenance.

## Where it fits

Use it for a large source surface. Prime-fetch handles one noisy call, prime-expand clarifies a vague gap, and cold-review checks existing work.

**Family:** Priming. **Subagents:** Part of the workflow.

## When to use it

- The surface spans at least three sources or roughly ten thousand tokens.
- You need source-backed context without raw noise.

## When not to use it

- You need one fetch, vague-gap expansion or execution.

## How to use it

Start with a concrete request. For example:

```text
/prime-sweep Trace configuration loading across these packages, including defaults and failure paths; cite the source for each finding.
```

## Flow

1. Choose source mode and objective.
2. Dispatch bounded source slices, using one or more subagents as the source mode requires.
3. Verify each finding against its cited source.
4. Iterate within wave limits and report gaps.
5. High-relevance pointers need evidenced closure; wave age and conversation distance do not erase gaps or prove termination.

## Common questions

**Can the lead gather inline if the required worker cannot be supervised?**

No. The dependent operation stops with the capability gap and any retained partial evidence.

## It is working when

- The caller receives an objective-organized digest, source index, discarded categories, gaps and a primed, partial or stuck verdict.

## Subagents

Subagents read sources; a single large source can use one agent, while multi-source work can run in parallel. The caller verifies evidence. Dispatch requires finite limits, monitored cancellation and a terminal or partial result. Unavailable controls stop the dependent operation with retained partial evidence; mandatory source-reading delegation has no inline fallback.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A source-anchored digest and gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prime-sweep/SKILL.md](../../skills/prime-sweep/SKILL.md)
- [skills/prime-sweep/protocol.yon](../../skills/prime-sweep/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
