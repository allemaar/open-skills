# Enforce module boundaries

Turn an agreed architectural boundary into a check demonstrated to accept legal imports and reject forbidden ones. Architecture advice, tool installation and rule implementation are separate scopes.

## Prepare

Required skill install set: none. Use this document directly. You need the repository scope, intended boundary, current configuration and an available suitable runtime/tool. Do not assume a language, package manager or folder layout. No subagents are required.

Inspect module/export definitions, documented entrypoints, aliases and actual resolution, existing boundary tools, scripts and exemptions. Include application, package and other relevant importers. A documented nested export can be public; directory depth or a root file alone does not decide visibility.

Identify selected rule classes, allowed/forbidden examples, importer scope and coverage gaps. Resolve conflicts with established policy before configuration edits. Prefer existing tooling with supported syntax. If a needed tool is unavailable, name it and return a proposal; install only when actual authorization includes that effect.

Use [architecture guidance](../skills/improve-codebase-architecture.md) when choosing boundaries rather than enforcing agreed ones. It is optional, not a dependency.

## Apply only when requested

Read live configuration and preserve unrelated rules, scripts and justified exemptions. Inspect target and auxiliary leaves and ancestors without following redirects; refuse unsafe targets. Retain preimages, use supported conflict protection and preserve intervening user edits. Stop conflicting edits for reconciliation.

Do not implicitly change production behavior, compiler aliases, standing instructions or permanent package layout. Do not create permanent example packages. An advice-only request stops at the minimal design and supported check invocation.

Verify that the actual checking command covers every importer scope claimed. A package-only scan does not establish application compliance. Unsupported dynamic/generated imports remain explicit limits.

## Demonstrate every new rule class

Use authorized isolated fixtures or precisely scoped temporary edits with recoverable preimages.

1. Run a legitimate allowed import through the actual command.
2. Introduce a deliberate forbidden import for the selected class.
3. Confirm failure identifies the intended boundary, rather than parser or unresolved-module failure.
4. Restore only authorized run-owned fixture changes after checking their current identity; rerun the restored allowed case.

Repeat for each claimed rule class and relevant importer class. One failing deep import does not prove layering, cycle and application rules together. Distinguish parsing configuration from activating a rule and observing enforcement.

Never restore stale whole-file content over user edits. If safe restoration or required cleanup is unauthorized or uncertain, preserve the residue and report it. A clean final result is not permission to delete evidence. No implicit commit, publication or unrelated migration follows.

## Output and request

Return proposed/applied rules, files changed, exact supported command, importer coverage, controls/results per class, existing violations/exemptions and recovery residue. Missing runtime, failed negative control or an uncovered importer prevents a claim of complete enforcement. Stop at the agreed bound or unavailable prerequisite.

Example: retain the public nested export reporting/public, reject reporting/private/cache, and exercise an application importer. A package-only green run is insufficient.

Request: “Enforce these agreed boundaries within this scope. Preserve exports/configuration, use existing tooling, demonstrate allowed and forbidden controls for each new class and importer scope, and report gaps without committing.”

Flow: discover -> advice or authorized merge -> per-class controls -> authorized restoration -> scoped enforcement report. No subagent step is prescribed.

[Workflow recipes](README.md) · [Skill guides](../README.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
