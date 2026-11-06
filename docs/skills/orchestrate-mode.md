# orchestrate-mode

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A multi-part task calls for a lead that coordinates workers and reviews their results without implementing the slices itself. Orchestrate mode is a persistent session choice: it establishes the actual workspace-sharing model, assigns safe boundaries and monitors bounded workers.

Workspace isolation must be established from the runtime's actual contract. Shared workspaces require disjoint ownership and coordination or serialization of mutations; each dispatch also needs finite bounds, monitoring, cancellation and a terminal or partial result. If safe dispatch cannot be established, the dependent work stops.

## Where it fits

Choose orchestrate-mode for dispatch-only coordination. Multi-agent-mode permits the lead to work directly alongside helpers; handoff transfers a task to a fresh session.

**Family:** Orchestration & dispatch. **Subagents:** Conditional.

## When to use it

- The lead should coordinate instead of doing concrete work.
- The task can be safely partitioned.

## When not to use it

- You want the lead to continue direct implementation.

## How to use it

Start with a concrete request. For example:

```text
/orchestrate-mode Coordinate these three independent tasks with disjoint file ownership; inspect each worker's result before integration.
```

## Flow

1. Announce the mode and limits.
2. Determine whether worker workspaces are isolated or shared.
3. Assign bounded scopes and coordinate mutations safely.
4. Inspect and integrate results or stop if safe dispatch is unavailable.

## Common questions

**Does a worker API name prove an isolated workspace?**

No. Inspect what the runtime actually provides and plan around shared state unless isolation is proven.

**Can the lead accept a worker's reported counts without checking?**

No. Inspect the concrete output and independently recompute figures before relying on them.

## It is working when

- Each dispatched task has a bounded brief, safe workspace ownership, monitoring and a cancellation path.
- The lead inspects deliverables and reports failures or missing evidence before declaring completion.

## Subagents

Concrete work is dispatched; activation alone need not spawn immediately. Dispatch requires finite limits, monitored cancellation and a terminal/partial result; unavailable controls stop delegation. Only an existing permitted inline fallback may continue.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A persistent orchestration mode and inspected deliverables.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/orchestrate-mode/SKILL.md](../../skills/orchestrate-mode/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
