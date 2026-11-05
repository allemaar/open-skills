# prime-sweep

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Primes the caller from a large source surface using delegated workers.

**Family:** Priming. **Subagents:** Part of the workflow.

## When to use it

- The surface spans at least three sources or roughly ten thousand tokens.
- You need source-backed context without raw noise.

## When not to use it

- You need one fetch, vague-gap expansion or execution.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/prime-sweep Sweep these packages for the configuration flow.
```

## Flow

1. Choose source mode and objective.
2. Dispatch bounded source slices, using one or more subagents as the source mode requires.
3. Verify each finding against its cited source.
4. Iterate within wave limits and report gaps.
5. High-relevance pointers need evidenced closure; wave age and conversation distance do not erase gaps or prove termination.

## Subagents

Subagents read sources; a single large source can use one agent, while multi-source work can run in parallel. The caller verifies evidence. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A source-anchored digest and gaps.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prime-sweep/SKILL.md](../../skills/prime-sweep/SKILL.md)
- [skills/prime-sweep/protocol.yon](../../skills/prime-sweep/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
