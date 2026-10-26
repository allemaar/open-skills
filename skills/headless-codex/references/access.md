<!-- headless-family:projection -->
# First-use access and failure handling

A skill installation supplies instructions and bundled helpers, not a provider CLI, login, subscription, API key, model entitlement or parent process-control capability. Each complete skill directory is usable independently; optional sibling skills are not prerequisites. Missing required bundled files mean an incomplete installation: stop that route and identify the missing relative file.

This is a public runtime contract, not a description of the maintainer's machine. Apply it on **every run**. Use only capabilities, executables, authentication, configuration and supervision already present in the current process and on the current host. Never assume the installation mechanism, directory layout, account, subscription tier, API key, network access, operating system, sandbox behavior, provider availability or parent tool support from this repository or from a previous run.

Before an execution or quota query, distinguish the model provider, harness and transport. Today the execution adapters use `codex`, `claude`, Antigravity `agy`, or xAI Build `grok` over **cli** transport. The separate `gemini` CLI is not a substitute for `agy`. The caller can be any agent harness with the required shell, monitoring and cancellation capabilities. A web-only chatbot without local process access cannot execute these CLI routes.

## Discovery

Start each run with a target-host census and retain its observation time. Discover the current OS; resolved executable or launcher path; CLI version and relevant help; supported nonsecret authentication-status surface and its result; current model/effort catalog; requested quota surface; effective configuration and customizations relevant to the run; and the parent's monitoring, retained-handle, deadline and scoped cancellation capabilities. Use supported read-only commands only. Do not inspect credential stores or secret values, launch inference to test access, or change configuration while discovering it. A field that cannot be observed is `unknown` or `unavailable`, never inherited from bundled prose.

The bundled checker covers only OS, Node runtime and executable discovery. It deliberately does not establish CLI version/help, authentication, models, quota, configuration, customizations, network access, sandbox enforcement or supervision. Complete those checks with the target CLI's current supported nonsecret surfaces and the current parent harness. If any capability required by the requested route remains unavailable, report the exact gap and stop that dependent route. Do not install, log in, add an API key, edit PATH or configuration, enable billing, or switch transport/provider automatically.

When Node.js 22+ is available, run the bundled `node <skill-directory>/scripts/check-access.mjs`. It performs local filesystem discovery only and returns one result per CLI. It does not launch tools, inspect credentials or test authentication. To pin paths or inspect a future transport, pass an absolute JSON spec:

```json
{"routes":[{"provider":"codex","transport":"cli","executable":"C:/tools/codex.exe"},{"provider":"claude","transport":"cli"},{"provider":"grok","transport":"cli"},{"provider":"agy","transport":"api"}]}
```

Exit 0 means every requested native CLI was found on this process PATH, not that it is ready to perform work. Exit 2 means at least one route needs attention; exit 1 means invalid input. `cli-found`, `found-outside-process-path`, `launcher-required`, `missing-cli`, `invalid-executable`, `discovery-limited` and `unsupported-transport` are discovery results, not authentication claims. Discovery checks this process's local absolute PATH entries first (up to 128). An installed CLI may be absent from a stale parent PATH, for example one installed after the parent started. Only when the process PATH misses, it then checks, in order: on Windows the persisted user-scope and machine-scope `Path` (read-only `reg.exe query`, up to 128 entries each, environment references expanded), then a bounded provider default install directory (`%USERPROFILE%/.grok/bin` for grok). A hit there returns `found-outside-process-path` with the absolute `executable`, `foundVia` (`user-registry-path`, `machine-registry-path` or `known-install-dir`) and a stale-PATH note; pass that absolute path as the explicit executable or restart the parent. It deliberately does not search the disk, run shell aliases, probe network locations, edit PATH or install anything. Explicit paths override discovery.

Without Node, use the host's command lookup, such as PowerShell `Get-Command codex,claude,agy -ErrorAction SilentlyContinue` or a POSIX shell's `command -v`. Distinguish an executable from an alias or npm/PowerShell shim. Resolve a shim to its reviewed interpreter entrypoint or native binary; never pass an untrusted prompt through shell interpolation. Node is required by the shipped Node adapters, not by all possible supervising hosts. If no equivalent bounded runner exists, report `missing-supervisor` and stop before inference. The bundled agy and direct quota runners are Windows-tested; do not claim non-Windows cancellation support.

## Continue or stop

| Condition | Required behavior |
| --- | --- |
| CLI absent or inaccessible | Report the exact missing command and checked environment as a gap. Do not install, edit PATH, start login, add an API key or switch provider/transport automatically. |
| CLI found | Run bounded version/help and supported auth-status checks. Preserve authentication as unknown if no non-inference check exists. Discovery alone never passes preflight. |
| No login, expired login, or unexpected API-key route | Stop that execution with `authentication-required` or `authentication-route-mismatch`. Describe the provider's supported login action without reading credentials; do not launch an interactive login in an unattended child. |
| Missing flag, model, effort or required skill | Report `unsupported-capability` with the exact requirement. Do not guess flags, remove required boundaries or substitute a model. |
| Permission denied | Report `permission-denied` plus the attempted action. A separate reviewed scoped permission change may unblock it; the worker never grants itself access. |
| Quota exhaustion or provider capacity error | Preserve the provider error and distinguish `quota-exhausted` from `provider-unavailable` when evidence permits. Neither proves a permission defect. No automatic retries or paid fallback. |
| Empty/malformed result, timeout, uncertain cleanup | Return incomplete with the specific failure and private evidence. Process exit zero is insufficient. |
| One provider fails in a comparison or quota request | Return the other providers' results; retain an explicit missing/failed row. Execution of a specifically selected provider stops rather than substituting. |

The labels above guide normalized reports; keep the original diagnostic privately and do not classify an ambiguous error more specifically than its evidence supports. The selector can still compare published evidence without any local CLIs, marking routes comparison-only. The updater can refresh reachable public sources while marking local probes skipped/failed and preserving their last successful verification dates. A standalone updater with no canonical source can produce a private candidate and report that applying/installing it is blocked; it must not treat an installed copy as an authorized source repository.

## Public contract versus maintainer evidence

Version numbers, paths, commands, models, permissions and outcomes dated in provider prose or a provider-specific validation reference when present are historical maintainer evidence only. They may explain why a guard exists, but they are never a default, entitlement claim, path assumption, prerequisite, current capability claim or instruction to reproduce the maintainer's setup. Revalidate every operational choice against the current target host and current CLI help. Keep platform-specific adapters gated to the OS and CLI versions they explicitly support; elsewhere report `unsupported-platform-adapter` and use another already-present verified supervisor, or stop.

Junctions, copied installations and repository projection are maintainer installation facts. A public skill run neither requires nor assumes them. Runtime discovery starts from the invoked skill directory and current host state. Installation maintenance belongs only to an explicitly requested maintainer update workflow; it must not leak into provider execution or quota handling.

## Future direct API adapters

`transport: api` is explicitly unsupported by the current discovery helper. It never falls back to CLI. Future API support must name its endpoint/provider, authentication mechanism, model identity, tool capabilities, budget basis, cancellation/retry behavior and response parser separately. An API key's presence does not establish permission to use it or spend money. CLI subscription login and quota must not be transferred to a direct API account; API usage/rate limits and remaining subscription allowance are different quantities.

Add a real API adapter and bounded tests before marking that route executable. Preserve the same result fields for provider, harness/endpoint, transport, model, authentication source without secrets, observed capabilities, cost basis, status, timestamps and cleanup. CLI-owned internal API calls used by supported quota commands do not constitute a direct inference API adapter.
