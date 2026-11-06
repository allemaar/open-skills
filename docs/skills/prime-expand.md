# prime-expand

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You know there is a gap in your understanding but cannot yet name a useful research question or source. One bounded worker turns the seed into questions paired with plausible sources for you to confirm, edit or refuse.

The caller can confirm, edit or refuse the proposed pair before downstream priming. Preserve confirmed questions and their associated sources, and distinguish local checks from unavailable candidates.

## Where it fits

Use this to form a research target; use prime-sweep or investigation after selecting what should be gathered.

**Family:** Priming. **Subagents:** Part of the workflow.

## When to use it

- A research target needs sharpening.
- A thin handoff needs a clear priming target.

## When not to use it

- You want the investigation itself performed now.

## How to use it

Start with a concrete request. For example:

```text
/prime-expand I need to understand why the cache layer causes stale results before changing invalidation.
```

## Flow

1. Provide the seed gap and context.
2. A subagent proposes questions and named sources with limited spot checks.
3. Confirm, edit or refuse the pair.
4. Use an accepted target for downstream priming.
5. Preserve every confirmed question and associated source; label local checks versus remote/unavailable candidates honestly.

## Common questions

**Does the worker conduct the full investigation?**

No. It sharpens the target and performs at most limited spot checks.

**Are proposed URLs verified?**

Remote or inaccessible candidates remain labeled unverified unless actually checked. A plausible source is not discarded merely because a local file check cannot reach it.

## It is working when

- The proposal links each question to candidate sources and labels checked versus unverified material.
- A confirmed target retains every accepted question and associated source.

## Subagents

One subagent performs one turn with at most three source spot checks. Dispatch requires finite limits, monitored cancellation and a terminal or partial result; if those controls are unavailable, stop the dependent operation without gathering sources inline.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A proposed question and source pair.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/prime-expand/SKILL.md](../../skills/prime-expand/SKILL.md)
- [skills/prime-expand/protocol.yon](../../skills/prime-expand/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
