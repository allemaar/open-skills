# verify

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Formally gates work against intent, plan and execution using fresh source checks.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You need a phase verdict.
- Intent and execution artifacts are available.

## When not to use it

- You only need a quick claim check or informal reflection.

## How to use it

Install this skill in a supported runtime, then give it the relevant material and a concrete request. For example:

```text
/verify Verify this implementation against its approved plan.
```

## Flow

1. Require intent and execution. With no plan, mark only plan/execution alignment not applicable; still check intent and sources, report the applicable status and keep clean false.
2. Check alignment among intent, plan and execution.
3. Reopen sources for load-bearing claims, using the consumed artifact where applicable.
4. Report the structured verdict and mark unchecked claims unverified.
5. Use status precedence: material unverified evidence, operational incompleteness and established issues take precedence over plan-not-found; only fully supported plan-based verification may be clean.

## Subagents

This self-gate does not require outside reviewers.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A structured evidence-backed verdict.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/verify/SKILL.md](../../skills/verify/SKILL.md)
- [skills/verify/protocol.yon](../../skills/verify/protocol.yon)
- [Installation and updates](../../README.md#install)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
