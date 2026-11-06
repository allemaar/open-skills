# plan-create

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A feature crosses several components and the team needs to agree on the problem before committing to a design. The skill first establishes testable success criteria and scope, waits for alignment, then develops concrete phases, dependencies, risks and verification.

Map changes to criteria, dependencies and executable checks; high risks require mitigation or explicit acceptance. Evaluate each gate and document warnings. When saving, protect existing artifacts and revisions, then read back the saved result.

## Where it fits

Use plan-create to design new work, plan-deep-dive to inspect a plan, and plan-execute to carry out an approved executable plan.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- A complex change needs decisions and verification criteria.
- You want a reviewable plan before implementation.

## When not to use it

- You need to execute an approved plan.

## How to use it

Start with a concrete request. For example:

```text
/plan-create Design an account export using the supplied requirements, with explicit exclusions, phased actions and observable checks; do not implement it.
```

## Flow

1. Choose full mode by default, or justify the narrow fast mode.
2. Investigate and define testable success criteria and scope.
3. Obtain the mandatory alignment confirmation before designing, then draft phases, risks and executable verification.
4. Evaluate the gates and present the plan without implementing it; create new artifacts exclusively, preserving collisions and requiring current identity and recovery for a selected revision. Missing goal coverage aborts; lesser design warnings can remain documented.

## Common questions

**When can fast mode be used?**

Only for a specifically justified single unit without cross-component impact or external dependencies. It condenses some work but skips no gates or the alignment checkpoint.

**Does a finished plan authorize implementation?**

No. The plan is presented for review; execution requires the appropriate approval and a separate execution step.

## It is working when

- Each success criterion has an observable verification path and the proposed changes cover the goal.
- The plan records concrete actions, dependencies, risks, gate outcomes and the actual save status.

## Subagents

A subagent is not universally required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A structured PLAN.md, or an inline plan when there is no project, for review.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/plan-create/SKILL.md](../../skills/plan-create/SKILL.md)
- [skills/plan-create/protocol.yon](../../skills/plan-create/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
