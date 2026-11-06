# headless-gemini

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

You need a bounded task run through an existing Antigravity CLI installation and want the parent to observe and control the process. The route checks live model access and permissions, establishes whether any required isolation is available, and supervises an authorized finite child run.

Tool and path permissions must match the authorized task. Monitoring can detect actions after dispatch but is not proof of an enforced isolation boundary.

## Where it fits

Use this for an authorized Antigravity CLI task, not the separate Gemini CLI.

**Family:** Orchestration & dispatch. **Subagents:** Part of the workflow.

## When to use it

- Delegate a scoped analysis
- Run an authorized workspace task

## When not to use it

- You need the separate gemini CLI rather than Antigravity CLI (agy).
- You require enforced read-only or exact tool isolation without an independently verified boundary.
- Treating an added directory as an access allowlist.

## How to use it

Start with a concrete request. For example:

```text
/headless-gemini Review the error-handling path in parser.mjs in this trusted workspace. Use the selected locally available model, approved reads and a finite deadline; report observed actions and isolation limits.
```

## Flow

1. Check the installed Antigravity CLI, authentication, model access and effective configuration.
2. Set exact authorized tools and paths; stop when required isolation cannot be independently established.
3. Otherwise disclose that monitoring detects actions after dispatch, then launch a bounded supervised task.
4. Validate the output and report limitations and gaps.

## Common questions

**Does adding a directory restrict the worker to that directory?**

No. It is not an access allowlist; independently verify any required boundary before launch.

**Can a successful response prove the worker stayed inside the requested scope?**

No. Inspect the observed tool actions and targets, process result and cleanup, then independently check the answer or artifact. Monitoring after dispatch is detection rather than prevention.

**Can this route use Claude instead of Gemini?**

Supported Claude selections through Antigravity require an explicit choice of that family and account route. They use Antigravity tools and its account pool, not native Claude Code permissions or quota guarantees. Check the live model catalog and selected route before launch.

## It is working when

- A finite supervised child run has observable progress, cancellation and a terminal or partial result.
- The result states the effective permissions, checks performed and any isolation or usage-limit gaps.

## Subagents

The delegated worker is a supervised provider CLI process, not a native subagent. Nested delegation requires separate authorization and bounds; disclose when native usage ceilings are unavailable.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A bounded child result with supervision and permission evidence.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/headless-gemini/SKILL.md](../../skills/headless-gemini/SKILL.md)
- [skills/headless-gemini/protocol.yon](../../skills/headless-gemini/protocol.yon)
- [skills/headless-gemini/references/supervision.md](../../skills/headless-gemini/references/supervision.md)
- [skills/headless-gemini/references/validation.md](../../skills/headless-gemini/references/validation.md)
- [skills/headless-gemini/scripts/run-windows.mjs](../../skills/headless-gemini/scripts/run-windows.mjs)
- [skills/headless-gemini/references/access.md](../../skills/headless-gemini/references/access.md)
- [skills/headless-gemini/references/run-contract.md](../../skills/headless-gemini/references/run-contract.md)
- [skills/headless-gemini/references/freshness.md](../../skills/headless-gemini/references/freshness.md)
- [skills/headless-gemini/references/claude-models.md](../../skills/headless-gemini/references/claude-models.md)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
