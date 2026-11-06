# implement-task

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You have a settled, authorized outcome and want it implemented without first creating a plan file. Establish the target, constraints and observable acceptance, then make and verify the coherent change against the actual current candidate.

An applicable approved plan or formal handoff retains its own execution contract. Preserve unrelated work, protect preimages and distinguish implementation from separate effects such as publishing or committing.

## Where it fits

Use this for an explicitly selected implementation outcome. Use plan-execute when an applicable approved plan governs execution.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You explicitly select implement-task for one coherent implementation outcome.
- The behavior and scope are sufficiently settled to proceed without an approved plan.

## When not to use it

- An applicable approved plan or selected formal handoff governs execution; follow its owner.
- The request is limited to interviewing, prototyping, diagnosis or planning.

## How to use it

Start with a concrete request. For example:

```text
/implement-task Implement the agreed cancellation rule: cancelling a booking releases one slot. Preserve existing booking behavior and verify the cancellation scenario and affected callers.
```

## Flow

1. Establish the intended result, target, constraints, acceptance and applicable execution contract.
2. Read relevant source and working state; preserve unrelated changes and resolve decisions that alter observable behavior.
3. Apply the authorized change with safe paths and recovery material.
4. Check the current candidate against independently derived expectations and required gates.
5. Report the result, effects, evidence, gaps and recovery state.

## Common questions

**What if two plausible implementations change observable behavior?**

Surface that unresolved choice before choosing; continue independent authorized work that does not prejudge it.

**What if an approved plan already governs the work?**

Follow that plan’s execution owner and its drift and decision gates. Selecting implement-task does not bypass them.

## It is working when

- Current-candidate evidence maps the agreed acceptance to the checks actually run.
- The result reports complete, partial or blocked with changed files, effects, gaps and recovery state.
- A governing plan keeps its own stop and completion contract; direct writes use a current-content check immediately before replacement.

## Subagents

No subagent or paid service is required.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A verified implementation or a partial or blocked result with evidence and remaining work.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/implement-task/SKILL.md](../../skills/implement-task/SKILL.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
