# Grok Build headless validation

## Windows literal-text evidence, 2026-10-25

The locally verified executable was Grok Build 1.0.70 (f50904eaee6c) on Windows. The authorized subscription trials used the existing consumer route, selected `grok-4.7`, reasoning `low`, one turn and a supervisor with 120-second deadline and 5-second shutdown grace. Both exited 0 without timeout and reported process close. Terminal accounting reported `grok-4.7-build`; this is observed CLI model reporting, not backend identity attestation. It does not independently attest applied reasoning effort.

| Observation | Earlier trial | Lean profile trial |
| --- | --- | --- |
| Expected exact text | `GROK_HEADLESS_OK 42` | `GROK_LEAN_OK 42` |
| Input tokens excluding cache reads | 28,307 | 294 |
| Cache-read input tokens | 1,152 | 1,152 |
| Cache-inclusive input tokens | 29,459 | 1,446 |
| Output tokens | 51 | 58 |
| Total tokens | 29,510 | 1,504 |
| Advertised tools | Present | Empty in every event |

Cache-inclusive input fell 95.09% between these two literal trials. This is a comparison of observed requests, not a universal saving or controlled attribution to one setting. The earlier run used `--tools ""` plus a system prompt override and still advertised tools and discovered skills. The lean run used the exact profile retained as [lean-text.md](../profiles/lean-text.md), the arguments, child-scoped environment and reviewed workspace configuration in [lean run](lean-run.md). No tool actions appeared in either captured stream.

Startup still scanned plugins and permission configuration. Both stderr logs included unsupported Stripe-event and skipped permission-prefix warnings. The lean profile reduced injected context and advertised tools; it did not establish scan-free startup or OS isolation.

Local provenance: `D:/agent-spaces/grok-setup-20261025/lean-smoke.md`, `lean-profile-spec.json`, `lean-profile-run/{stdout.log,stderr.log,status.json}`, `trial-spec.json`, and `trial-run/{stdout.log,stderr.log,status.json}`. Environment overrides came from the supervising parent launch record; workspace plugin configuration was read from `workspace/.grok/config.toml`. These are maintainer evidence locations, not runtime path requirements.

The lean session ID was `01a1727c-3c73-7651-9ed5-58ad29c2f770`. The supported `grok usage <SESSION_ID> [TURN]` surface provides persisted session accounting. Its 1,446 input, 58 output and 1,504 total tokens are session usage, not remaining subscription allowance or reset times. Use an observed current interactive **/usage** or Settings -> Usage surface for the remaining shared pool; otherwise mark it unknown.

## Read event observation, 2026-10-30

On Windows, Grok CLI 1.0.70 emitted `read_file` events with `rawInput.target_file`. Two bounded read-only reviews using a corrected private monitor each recorded 44 approved reads, a complete `end_turn`, exit 0, no monitor errors or denials and a checked stopped state. Earlier monitors assuming `rawInput.path` rejected the observed shape. Verify stream formats against the current runtime version; these observations do not establish a stable schema or general reliability, and the zero-tool lean profile remains for literal tasks.

## Boundaries requiring current-host verification

- Installation, login, version, local help, environment/profile support and model access are target-host facts. Historical successful trials never establish another account's entitlement.
- Windows sandbox containment, exact read-only enforcement and filesystem/network isolation remain unproved. Zero advertised tools and absence of observed actions do not prove those boundaries.
- Stable event schemas, remaining quota/reset visibility, resume behavior, write correctness, nested agents, other platforms and arbitrary tasks were not established by these literal trials.
- On 2026-10-26, grok 1.0.70 rejected `--add-dir` with "additionalDirectories is not supported: a session works only in its cwd". Multi-root reviews need a single bundled cwd. The same run, with Grok 4.7 in plan mode, `--tools read_file,search_tool` and `--prompt-file`, succeeded by absolute executable path while the parent PATH was stale.
- Legacy `--no-memory` and `--no-auto-update` were not supported locally. Verify the current CLI before changing the tested child environment or argument combination.

Use current [CLI reference](https://docs.x.ai/build/cli/reference), [headless scripting](https://docs.x.ai/build/cli/headless-scripting), [permissions](https://docs.x.ai/build/features/permissions), [sandbox](https://docs.x.ai/build/features/sandbox) and [sessions](https://docs.x.ai/build/features/sessions), plus local help, before material command/parser/authentication changes. Subscription usage and API billing remain separate; this validation does not establish API-key access or authorize an API fallback.
