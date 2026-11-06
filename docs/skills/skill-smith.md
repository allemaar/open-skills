# skill-smith

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a workflow that may deserve a skill, or an existing skill that is confusing, broken or overlapping another. Skill-smith identifies the desired result and exact target, then selects the create, assess, diagnose, update or consolidate route instead of loading every procedure.

Creation returns a scoped draft or authorized new skill with its required structure and evidence. Assessment stays read-only by default and returns material findings and a keep, improve or restructure recommendation. Diagnosis traces a specific failure; update and consolidation preserve behavior and permission boundaries within the selected scope.

For creation or a behavior-changing update, clarification follows preflight and focuses on unresolved choices that change behavior, output or acceptance. A complete brief skips the interview; optional ideas do not become requirements through silence.

## Where it fits

Use it for skill authoring or a bounded skill collection. Standing directives, reader-facing prose and library installation have separate owners.

**Family:** Skill library. **Subagents:** Conditional.

## When to use it

- You want a skill drafted, assessed, diagnosed, updated, simplified, or consolidated.
- You need to trace skill behavior, dependencies, invocation, or portability.

## When not to use it

- You need a portable skill library and family manager; use skill-library-creator.
- You are changing standing directives or reader-facing prose rather than skill behavior.

## How to use it

Start with a concrete request. For example:

```text
/skill-smith Diagnose why this skill's setup points to a missing reference; inspect the canonical entrypoint and report the smallest repair without applying it.
```

## Flow

1. Identify the intended result, exact targets, constraints, and canonical sources.
2. Choose create, assess/boil, diagnose, update, or consolidate.
3. Read only the selected procedure and required supporting references.
4. For creation or behavior-changing updates, clarify only material unresolved choices after preflight; complete briefs and formatting-only updates skip the interview. Deeper questioning is opt-in, and declined or unanswered optional features stay off.
5. Follow its read-only or explicitly authorized write flow, then report evidence and gaps.

## Common questions

**Does an assessment request authorize rewriting or installing?**

No. Assessment is read-only unless edits are explicitly requested, and installation remains separate.

## It is working when

- The selected route produces the requested draft or evidence-backed recommendation, identifies affected behavior and callers, and names missing or untested coverage.

## Subagents

Small or tightly coupled work stays inline. Delegate only when requested or independent verification justifies coordination cost and rules permit; keep work bounded, monitored, cancellable, and isolated. Reviewers stay read-only.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

An authorized skill draft or revision, or an evidence-backed assessment, diagnosis, update plan, or consolidation proposal.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/skill-smith/SKILL.md](../../skills/skill-smith/SKILL.md)
- [skills/skill-smith/references/create.md](../../skills/skill-smith/references/create.md)
- [skills/skill-smith/references/assess.md](../../skills/skill-smith/references/assess.md)
- [skills/skill-smith/references/doctor.md](../../skills/skill-smith/references/doctor.md)
- [skills/skill-smith/references/update.md](../../skills/skill-smith/references/update.md)
- [skills/skill-smith/references/consolidate.md](../../skills/skill-smith/references/consolidate.md)
- [skills/skill-smith/references/authoring.md](../../skills/skill-smith/references/authoring.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
