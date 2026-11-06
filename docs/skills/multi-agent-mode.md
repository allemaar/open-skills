# multi-agent-mode

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A task has independent slices that can progress alongside the lead's work. In multi-agent mode the lead continues on the critical path, assigns helpers non-overlapping ownership, inspects results and integrates the outcome.

Before a helper starts, the work and invocation need finite limits, monitoring and cancellation. Shared filesystems require coordination of write paths and Git state; activation alone does not require an immediate dispatch.

## Where it fits

Use it when the lead should work directly with helpers. Orchestrate-mode is the dispatch-only sibling.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- Independent slices can run alongside lead work.
- You want explicit helper ownership.

## When not to use it

- You want the lead to dispatch only.

## How to use it

Start with a concrete request. For example:

```text
/multi-agent-mode Implement the approved change; delegate the independent documentation review while you handle the core code, with disjoint write scopes.
```

## Flow

1. Announce the mode and limits.
2. Decompose into lead work and independent slices.
3. Delegate useful bounded slices and inspect results.
4. Integrate and verify as lead.

## Common questions

**Who checks the pieces together?**

The lead retains responsibility for inspecting helper output, integration and final verification.

## It is working when

- Each helper has a bounded brief and clear ownership, and the lead reports the integrated result and gaps.

## Subagents

Activation does not require immediate spawning; maximum three helpers without confirmation, no recursive subagents. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A persistent assisted mode and integrated results.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/multi-agent-mode/SKILL.md](../../skills/multi-agent-mode/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
