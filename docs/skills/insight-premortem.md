# insight-premortem

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Before committing to a plan, imagine that its intended outcome has failed at a specified future point. Premortem asks what plausible paths could have produced that failure before jumping to mitigations.

The imagined outcome is a framing device, not proof of likelihood. Each material path is checked against assumptions, evidence and counterevidence, then paired with a warning sign and response trigger where possible.

## Where it fits

Use it before a future decision. Insight-root-cause examines an event that occurred; insight-retro draws broader lessons after implementation.

**Family:** Insight & decision. **Subagents:** Conditional.

## When to use it

- You want to identify future failure paths before committing.
- You need warning signs and response triggers for a proposed plan.

## When not to use it

- The failure has happened and needs causal investigation; use insight-root-cause.
- You want broad post-implementation learning; use insight-retro.

## How to use it

Start with a concrete request. For example:

```text
/insight-premortem Assume this migration missed its six-month deadline; use the attached plan and dependencies to identify plausible paths and warning signs.
```

## Flow

1. Name the plan, constraints, intended result, and observable failure.
2. Generate plausible causes before mitigations.
3. Check causes against assumptions, evidence, counterevidence, and missing perspectives.
4. Prioritize and propose prevention, warnings, responses, and residual risks.

## Common questions

**Does this edit the plan or assign work?**

No. It returns proposed changes, residual risks and unresolved ownership for the caller to decide.

## It is working when

- The output distinguishes hypotheses from observations and identifies material paths, proposed responses, residual risks and evidence gaps.

## Subagents

Inline by default. Workers only when requested or host-permitted and a specific evidence gap justifies them; tasks are bounded, read-only, non-overlapping, and have no nested delegation.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Failure paths, evidence status, proposed mitigations and warning signs, residual risks, and gaps; no plan edits.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/insight-premortem/SKILL.md](../../skills/insight-premortem/SKILL.md)
- [skills/insight-premortem/protocol.yon](../../skills/insight-premortem/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
