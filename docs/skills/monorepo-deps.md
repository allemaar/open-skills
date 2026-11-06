# monorepo-deps

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

Several npm workspaces declare the same dependency at different ranges and the lockfile may have drifted. The skill uses the repository's actual local syncpack and manypkg tools to run the selected check, fix, update or configuration operation, rather than treating all four as the same request.

A fix resynchronizes the lockfile after range changes. An update determines allowed major versions and applies needed caps before updating, then checks the resulting workspace and lockfile. Conflicts receive one bounded repair pass and retry; persistent failures are reported without force flags.

## Where it fits

Use monorepo-deps for the coordinated npm workspace workflow. Optional external syncpack and manypkg skills can supply tool-specific API or configuration detail when available; they are not bundled prerequisites. Github-sync separately handles commit and push.

**Family:** Code & architecture. **Subagents:** No subagent step prescribed.

## When to use it

- Check version mismatches
- Update a monorepo within agreed major-version caps

## When not to use it

- A narrow question about one tool's API

## How to use it

Start with a concrete request. For example:

```text
/monorepo-deps check Inspect this npm workspace for version mismatches and outdated packages; report the results without changing dependencies.
```

## Flow

1. Inspect prerequisites and select check, fix, update, or configuration maintenance
2. Establish permitted changes and update bounds for the chosen operation
3. Resolve actual repository-local tools without acquisition fallback; retain completed exit status and stop after the single bounded conflict-repair pass.
4. Run that operation, including lockfile resynchronization when applicable
5. Run the required checks and report results

## Common questions

**Does the check operation update packages?**

No. It reports actual lint, workspace and outdated results without running the mutation-only workflow.

**Can the same workflow rewrite a pnpm or yarn lockfile?**

No. It is npm-only and does not mutate those lockfiles.

## It is working when

- The selected operation and any permitted major updates are clear, with local tool identity established.
- The report names actual completed checks and exit status, changed dependencies or unresolved conflicts.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

Dependency changes and verification results.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/monorepo-deps/SKILL.md](../../skills/monorepo-deps/SKILL.md)
- [skills/monorepo-deps/protocol.yon](../../skills/monorepo-deps/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
