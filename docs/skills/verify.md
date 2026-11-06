# verify

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A phase is complete and you need a formal decision about whether work matches the goal and plan. Verify requires intent and execution artifacts, examines alignment and reopens the source for each load-bearing claim.

The plan is optional, but without it the plan-based alignment checks are not applicable and the result cannot be clean. For a committed or built artifact, check the consumed form; the working copy is appropriate when that is the artifact under review.

## Where it fits

Use it for a formal self-gate. Cold-review adds a fresh outside perspective; double-check is a smaller recheck of one claim.

**Family:** Planning & execution. **Subagents:** No subagent step prescribed.

## When to use it

- You need a phase verdict.
- Intent and execution artifacts are available.

## When not to use it

- You only need a quick claim check or informal reflection.

## How to use it

Start with a concrete request. For example:

```text
/verify Check the current implementation against the approved migration plan and original intent; reopen evidence for the claimed passing checks.
```

## Flow

1. Require intent and execution. With no plan, mark only plan/execution alignment not applicable; still check intent and sources, report the applicable status and keep clean false.
2. Check alignment among intent, plan and execution.
3. Reopen sources for load-bearing claims, using the consumed artifact where applicable.
4. Report the structured verdict and mark unchecked claims unverified.
5. Use status precedence: material unverified evidence, operational incompleteness and established issues take precedence over plan-not-found; only fully supported plan-based verification may be clean.

## Common questions

**Does a clean verdict replace required tests?**

No. It checks evidence and alignment within scope; required tests and builds still need to be performed.

## It is working when

- The structured verdict identifies gaps, drift, issues and unverified claims, with source evidence for a supported pass.

## Subagents

This self-gate does not require outside reviewers.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A structured evidence-backed verdict.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/verify/SKILL.md](../../skills/verify/SKILL.md)
- [skills/verify/protocol.yon](../../skills/verify/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
