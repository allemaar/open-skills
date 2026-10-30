# insight-premortem

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Imagines a plan has failed and identifies plausible causes, evidence gaps, and ways to prevent or detect them.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want to identify future failure paths before committing.
- You need warning signs and response triggers for a proposed plan.

## When not to use it

- The failure has happened and needs causal investigation; use insight-root-cause.
- You want broad post-implementation learning; use insight-retro.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/insight-premortem Assume this migration failed six months from now. What likely happened?
```

## Flow

1. Name the plan, constraints, intended result, and observable failure.
2. Generate plausible causes before mitigations.
3. Check causes against assumptions, evidence, counterevidence, and missing perspectives.
4. Prioritize and propose prevention, warnings, responses, and residual risks.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; tasks are bounded, read-only, non-overlapping, and have no nested delegation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Failure paths, evidence status, proposed mitigations and warning signs, residual risks, and gaps; no plan edits.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-premortem/SKILL.md](../../skills/insight-premortem/SKILL.md)
- [skills/insight-premortem/protocol.yon](../../skills/insight-premortem/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
