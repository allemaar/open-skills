# write-spec

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A discussion has settled some behavior but left other choices open. Write-spec turns the supplied conversation and established evidence into a standalone behavioral specification, tracking later corrections and distinguishing agreed requirements from proposals.

It describes observable success, relevant constraints and exclusions, and readiness gaps. A useful draft can be incomplete: producing it neither approves the behavior nor starts implementation.

## Where it fits

Use it to capture established behavior. An implementation plan, tracker publication and execution are separate work.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You need a spec from a conversation or established notes.
- A feature, refactor or operation needs its agreed behavior captured.

## When not to use it

- You need an implementation plan, execution or tracker publication.

## How to use it

Start with a concrete request. For example:

```text
/write-spec Turn our discussion and attached prototype notes into a spec; preserve agreed retry behavior and mark the timeout decision open.
```

## Flow

1. Read the selected source and identify the audience and boundaries.
2. Reconcile corrections, evidence, agreed behavior and proposals without inventing decisions.
3. Shape observable acceptance, constraints and unresolved gaps for the subject.
4. Return a draft or save only to an authorized safe destination.

## Common questions

**What if code shows behavior nobody agreed should remain?**

Describe it as observed current behavior, not an approved product requirement. The decision remains open until established.

## It is working when

- The spec stands on its own with observable acceptance, source coverage, unresolved questions and an honest saved or text-only disposition.

## Subagents

No worker is required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A readable specification, source coverage, open questions and actual save status.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/write-spec/SKILL.md](../../skills/write-spec/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
