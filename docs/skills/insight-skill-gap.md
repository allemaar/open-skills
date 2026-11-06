# insight-skill-gap

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Recent work exposed a repeated decision or pitfall and you wonder whether it belongs in a reusable skill. Compare that pattern with the actual skill catalog before proposing an update or a new entry.

A missing catalog is incomplete duplicate coverage, not proof that the library is empty. Proposals identify the reuse case and the specific missing sections.

## Where it fits

Use this to find reusable skill gaps after work; use insight-retro for the broader implementation retrospective.

**Family:** Insight & decision. **Subagents:** No subagent step prescribed.

## When to use it

- You want to know whether recent work exposed a skill gap.
- A retrospective identified patterns worth comparing with existing skills.

## When not to use it

- You want to create or edit a skill now; use skill-smith after choosing a proposal.
- You need a full retrospective of changes and technical debt; use insight-retro.

## How to use it

Start with a concrete request. For example:

```text
/insight-skill-gap Review the recent cache migration and determine whether its recurring invalidation decisions are already covered by the installed skill catalog.
```

## Flow

1. Gather recent work and summarize patterns and technologies.
2. Resolve the actual supplied or host/repository catalog and record its scope before duplicate checks. If unavailable, keep candidates provisional and duplicate coverage incomplete; missing is not empty.
3. Classify patterns as covered, incomplete, or absent and apply reuse criteria.
4. Present a targeted update or new-skill proposal for approval.
5. Only after approval, apply selected creation or updates through Skill Smith and the canonical write owner.

## Common questions

**Does the scan create skills automatically?**

No. It presents proposals for approval; selected work then follows the skill authoring owner.

**What if the catalog cannot be found?**

Keep candidates provisional and say duplicate coverage is incomplete. A missing index does not mean no relevant skill exists.

## It is working when

- Candidates are classified as covered, incomplete or absent against the actual index.
- A proposal explains reuse and scope, or identifies incomplete duplicate checking.

## Subagents

Specifies a scan and proposal flow and no subagent step.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Coverage findings and justified proposals, followed by skill creation or targeted updates only when approved.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-skill-gap/SKILL.md](../../skills/insight-skill-gap/SKILL.md)
- [skills/insight-skill-gap/protocol.yon](../../skills/insight-skill-gap/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
