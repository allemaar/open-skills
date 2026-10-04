# Family validation

Last execution verification: 2026-09-15, Windows. This is the current result; the historical failures below explain the repairs. Model-catalog freshness is tracked separately and is not advanced by these execution checks.

## Verified parent routes

| Parent | Codex worker | Claude worker | Antigravity worker | Required route |
| --- | --- | --- | --- | --- |
| Claude Haiku | Passed | Passed | Passed | Exact approved Bash launcher with bounded workers. |
| Codex Terra low | Passed | Passed | Passed | Sandboxed parent atomically requests one pre-reviewed task through an already authorized outer dispatcher. |
| Antigravity Flash low | Passed | Passed | Passed | One exact approved immutable launcher, explicit child working directory, file-backed stdio and bounded workers. |

Workers were Codex 0.154.0-alpha.6.2 with Terra low, Claude Code 2.1.272 with Haiku, and Antigravity 1.2.3 with Gemini 3.8 Flash low. Each returned its exact no-tool marker. The Claude and Codex parents returned PARENT_COMPAT_OK; Antigravity completed its single matched launcher step and all child results were checked. Temporary Antigravity permission settings were restored byte-for-byte. Identified test processes were checked stopped.

These are dispatch and inference checks, not certification of every nested editing workflow. Codex's outer dispatcher is a separate authorized host process, not evidence that account-state writes and network access work inside its restricted child sandbox. The request contains only a fixed task ID; no executable or arguments come from the parent.

## Other verified behavior

| Surface | Evidence and limit |
| --- | --- |
| Codex literal and file fixture | Exact literal passed with the narrowly identified skill-description-shortening advisory. A later 33-byte copy passed with inherited configuration plus an inline prerequisite-read profile; enforcement of that profile independently of legacy settings remains unproved. |
| Claude exact read/write | Current 2.1.272 Haiku runs passed with exact Read and Edit permission patterns, expected tools and independently checked bytes. Edit permission governs the exposed Write tool. |
| Antigravity files | Literal and exact read passed. A separately approved write created the file but added a newline, so exact-byte acceptance failed. No general write guarantee follows from command success. |
| Quota | Codex and Antigravity live direct reads and Claude interactive usage were observed. Claude has no verified standalone headless quota API. Missing-provider and report-file failure handling preserved other live results. |
| Freshness | Current state, the configured reminder boundary, failed attempts preserving old success, missing/future dates and invalidation checks passed. The update offer is parent-owned; there is no background scheduler. |
| Updater | Its installed finite-time DeepSWE fetch returned 70 configurations. This did not refresh every model/price source or launch benchmark inference. |
| Installation | All six skills were installed in the established runtimes. Final source/runtime byte parity passed; all 42 shared projections matched. Plugin installation does not prove every skill was invoked through a slash command. |
| Static validation | Lint and machine-path checks passed; 46/46 skill protocols passed conformance. These checks do not prove runtime behavior. |

## Installed failure-handling checks

The earlier installed family passed eleven bounded access, quota-output and Gemini preflight checks, including empty and partial PATH, missing executables, unsupported API transport, unknown options and preservation of live quota data after a report-file conflict.

After the dispatcher and file-backed runner repair, six further installed checks passed: missing CLI without creating run output; unsupported API-field rejection; timeout tree cancellation; live capture-callback failure cancellation; a valid fixed request; and rejection of request-supplied arguments before launch. Both cancellation fixtures included a descendant, and native inspection found their owned processes absent afterward. The installed Gemini adapter then returned its exact literal marker without failures.

A Node executable reached through a junction was correctly rejected. The fixture succeeded after discovery selected the reviewed canonical native executable. This does not authorize following redirected output paths.

## Historical failures and their resolution

- Node pipe capture caused EPERM for all three native version commands under a Windows restricted token. File descriptors removed that process-creation failure. Real nested inference still hit account-state and network restrictions; the fixed outer dispatcher supplies the verified Codex-parent route.
- Antigravity initially ran a launcher in its scratch directory despite the session cwd. The repaired launcher sets and validates its own child workspace. A missing WaitMsBeforeAsync caused a tool error in another probe; subsequent synthetic and real worker commands completed without a separate status-poll tool. Arbitrary background polling remains unsupported.
- Earlier Antigravity attempts encountered provider-capacity 503 errors. Exact permission grants later worked, and the final named worker routes passed. Do not repair a capacity error by changing login, permissions or model silently.
- A Codex write returned a completion claim after a prerequisite read was denied, with no output file. Independent artifact verification caught it. An Antigravity SUCCESS envelope likewise accompanied a failed launcher.
- The Codex dispatcher test's private wrapper searched the request directory instead of the separate worker directory. Direct inspection of the authoritative dispatcher result, worker outputs and parent response established success without rerunning inference.
- An earlier nested probe used a forbidden rule-skipping option. It was excluded and supplies no passing compatibility evidence.
- Historical pipe-based lifecycle fixtures returned cleanup-unverified promptly when descendants retained output handles. The current file-backed runner still requires outer descendant verification; root exit is never sufficient proof.

## Remaining boundaries

Another installation must establish its own native CLI paths, supported flags, login, model entitlement, permissions, network and capable supervising host. Missing tools produce setup gaps, never automatic installation or API fallback. A listed or high-scoring model is not proof of local execution access.

Linux/macOS supervision, direct API adapters, every model/effort combination, every resume route, exact-byte Antigravity writing and nested file-edit permissions remain unverified. CLI-owned state/log writes may occur outside task fixtures. Full private logs remain outside the public repository; benchmark costs, subscription quota and actual workload charges remain distinct.
