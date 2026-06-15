---
name: multi-agent-mode
description: >
  Activate multi-agent mode: the lead agent still works directly but delegates independent helper slices when useful. Trigger on /multi-agent-mode, "multi-agent mode", "use helper agents", "work with subagents", or "parallelize if useful". Use orchestrate-mode instead when the lead agent must dispatch only and not execute.
disable-model-invocation: true
visibility: public
triggers:
  - "/multi-agent-mode"
  - "multi-agent mode"
  - "use helper agents"
  - "work with subagents"
  - "parallelize if useful"
next-skills:
  - skill: extract-signal
    phrase: "/extract-signal"
    why: "The canonical methodology that runs under multi-agent mode — spawn primed sub-agents to gather and vet signal."
  - skill: orchestrate-mode
    phrase: "/orchestrate-mode"
    why: "Switch to the dispatch-only sibling mode when the lead should stop executing directly."
  - skill: caller-options
    phrase: "/caller-options"
    why: "Route an individual delegation's venue and mode now that helper-agent fan-out is on the table."
---

# /multi-agent-mode

Switch the current session into assisted multi-agent behavior. The lead agent remains responsible for planning, direct execution, integration, and final verification, but should actively look for independent slices that helper agents can handle in parallel or in the background.

## Activation announcement

When invoked, immediately announce:

> Multi-agent mode active.
>
> I will continue working directly, and I may delegate independent helper slices when that improves speed, quality, or context control. I will keep ownership boundaries explicit, inspect helper outputs, and own final integration. Max 3 helpers without confirmation; no recursive subagents.

Then continue with the user's work item if provided.

## Mode switching

- This is a persistent session mode until the user exits it, restarts the session, or explicitly switches to another mode.
- If the user invokes `orchestrate-mode`, announce the switch: the lead agent is now dispatch-only and must not execute concrete work directly.
- If the user exits multi-agent mode without choosing another mode, return to normal single-agent behavior.
- Latest explicit mode wins. Do not maintain a hidden mode stack.

## Core behavior

The lead agent should do the first decomposition pass locally:

1. Identify the immediate critical-path work the lead should do directly.
2. Identify independent helper slices that do not block the next lead action.
3. Delegate only slices with clear ownership and acceptance criteria.
4. Keep working locally on non-overlapping work while helpers run.
5. Inspect helper outputs before integrating or relying on them.
6. Run or request final verification for the integrated result.

## When to delegate

Delegate when a slice is independent and materially useful, such as:

- Separate failing test files or unrelated failures.
- Independent subsystem investigations.
- Bounded implementation work in disjoint files.
- A focused review or research question that can run while the lead continues.
- UI, backend, docs, or migration slices with clear non-overlapping ownership.

Do not delegate when:

- The task is small enough that delegation overhead exceeds benefit.
- The root cause is likely shared across all failures.
- The work needs one coherent global design decision first.
- Helpers would edit the same files or tightly coupled files.
- The helper brief would be longer or harder than the task.

## Guardrails

- MUST keep the lead agent responsible for final outcome, integration, and verification.
- MUST give each helper a self-contained brief: goal, scope, owned files, non-goals, context, acceptance criteria, verification, and expected report.
- MUST tell helpers they are not alone in the codebase and must not revert or overwrite others' changes.
- MUST keep helper ownership disjoint.
- MUST inspect helper output, diffs, or changed paths before accepting.
- MUST NOT spawn more than 3 helpers without explicit user confirmation.
- MUST NOT recurse beyond depth 1. Helpers must not spawn their own helpers.
- MUST NOT delegate urgent blocking work when the lead's next action depends on the answer.

## Helper prompt baseline

```text
You are a helper agent in multi-agent mode. The lead agent is also working. Stay within your assigned scope and do not revert or overwrite changes from others.

Goal:
Scope / owned files:
Do not touch:
Relevant context:
Acceptance criteria:
Verification to run:
Final report must include: changed paths, commands run, result, unresolved risks.
```

## Relationship to other skills

- Use `orchestrate-mode` when the lead agent should stop executing and only coordinate.
- Use `cold-review` when the goal is independent outside review of work artifacts.
- Use `verify` for a formal self-gate against intent, plan, and execution artifacts.
- Use `double-check` for same-agent adversarial re-reading of a specific target.


