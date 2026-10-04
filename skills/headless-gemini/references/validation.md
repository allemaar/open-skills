# Antigravity headless validation

Latest verified route: 2026-09-15, Antigravity 1.2.3 on Windows. The repaired-route section records successful Codex, Claude and Gemini worker dispatch. The earlier observations below were checked on 2026-09-14 against `agy 1.2.2` with the existing login. These are bounded smoke observations, not guarantees for another installation. Raw prompts, process identifiers, logs and local paths remain outside the public repository.

## Observed behavior

The probes used synthetic data and `gemini-3.8-flash-low` from the current `agy models` catalog. Normal runs had a 90-second native timeout and a 120-second external ceiling. No permission bypass, credential change, direct API call or persistent permission edit was used.

| Probe | Observed result | Consequence |
| --- | --- | --- |
| Literal prompt with streaming output | Exact expected answer; init, step_update and result events; exit 0 | Existing login works headlessly; init echoes pinned model and CWD |
| JSON output and arithmetic | Envelope response was `42`; exit 0 | Read `.response` from the envelope |
| Plain stdin alongside `-p` | Returned `INPUT_ABSENT`, not the token supplied on stdin | Do not pipe a diff into that shape |
| One structured stdin message, then EOF | Returned exact supplied token and exited normally | Use stream-json input for supplied content |
| Relative file prompt with CWD alone | Guessed paths outside the fixture, read its own runtime transcript, then was stopped | CWD metadata and prompt scope are insufficient containment |
| Absolute file prompt plus reviewed added directory | One `view_file` on the intended file, correct fixture token, unchanged input hash | This exact supervised read path worked |
| Unapproved echo command | Tool error, stderr denial, `denied_actions`; empty response, `SUCCESS`, exit 0 | Both status and exit code can falsely resemble completion |
| Explicit authorized write plus added directory | Permission denied; `SUCCESS`, exit 0; target absent | User task authorization does not establish CLI permission |
| Native timeout of `1ns` | Timeout diagnostic, empty response, zero turns, `SUCCESS`, exit 0 | Retain stderr and externally bound the run |
| External cancellation at 100ms | Scoped taskkill stopped root and reported child; process exit 1 | Forced Windows process-tree termination worked in this case |
| Invalid pinned model | Error envelope and exit 1, no fallback | Preserve the explicit model failure |

The initial supervisor retained all raw output. The relative-path probe was stopped after scope drift was observed; this was not a passing read-only test. A later explicit-path probe added automated unexpected-tool/target cancellation. The fixture inventory and input hash were unchanged after the tests; no `agy` process or identified cancelled descendant remained at the final process check. Native runtime conversation logs were outside that fixture and are not claimed absent.

## What remains unproved

The bundled Windows supervisor was also exercised against the real CLI: a prompt returned `ADAPTER_OK`, an exact read returned the fixture token, a denied write produced supervisor exit 1 despite CLI exit 0, and an external deadline produced supervisor exit 1 with successful scoped termination. Final parser and capture-path revisions retained those outcomes in live checks. Static review also added capture-failure termination and rejection of unknown event shapes; disk failure and invented event streams were not injected. A denied-write termination raced natural CLI exit, so stopped state was checked separately rather than inferred from taskkill success. A later process inspection encountered a reused PID belonging to another executable; it was left untouched.

Google AI Pro tier and remaining quota; other model/effort combinations; strict read-only, MCP or plugin isolation; Windows terminal sandbox behavior; browser research; resume; multi-turn streaming; structured schema output; graceful Windows interruption; behavior on Linux/macOS. Scoped file creation and command launch were later demonstrated below; that does not establish arbitrary implementation workflows. A listed model is not evidence every account can execute it. The runtime exposed many tools even for prompt-only tests.

## Corrections to commonly mixed CLI advice

- `agy` and the separate Gemini CLI have different flag and provider contracts. Local `agy --help` supports `-p`, `--print`, `--prompt`, `--output-format`, `--print-timeout`, `--model`, and `--effort`. It does not list `--format` or `--approval-mode`.
- `--dangerously-skip-permissions` exists, but this skill prohibits it. Permission failures must not be repaired by copying that suggestion from stderr.
- An inherited API-key variable is not proof of an account login or a subscription quota. The documented direct Gemini provider requires its own selection and credential path. Installation and authentication are outside this skill.

## Permission research, 2026-09-15

Official permission, settings, headless, execution-mode and permissions-manager documentation was checked against local `1.2.2` help and retained denial evidence. The global settings file existed and had only a weather-domain allow rule; relevant omitted fields were not assumed disabled. The earlier parent run was denied reading its helper before launching children. The cause of the workspace auto-allow discrepancy remains unresolved. See [pre-approval and troubleshooting](permissions.md) for scoped setup, separate file-review controls, Windows caveats and the verification procedure. The research itself did not change settings or run inference; the separately authorized live tests followed.

## Scoped permission tests, 2026-09-15

Temporary global rules named exact synthetic input/output files and an anchored command for one fixed reviewed launcher; a deny rule protected its control directory. No broad interpreter grant, credential change, accept-edits mode, added workspace or blanket bypass was used. The original settings were restored byte-for-byte, including after a formatting-only CLI rewrite triggered the conflict guard. All identified test processes were absent at final inspection.

| Probe | Observed result | Limit |
| --- | --- | --- |
| Exact read allow | Correct token, no denial, approximately 73 seconds on the retry | First 35-second attempt timed out before any tool call |
| Exact write allow | File created, no denial, approximately 53 seconds | Extra trailing newline failed exact-byte acceptance; do not call the artifact test passed |
| Unquoted command pattern | Denied when the model emitted PowerShell ampersand plus quoted paths | Exact command spelling matters |
| Anchored pattern matching emitted PowerShell command | Launcher executed and started a child agy process | Child inference failed with provider 503 / no model capacity |
| Separate parent route prepared for Codex/Claude workers | Parent emitted an error before dispatch | Runtime log confirmed the same model-capacity failure; neither worker launched |

The child and parent streams exposed `error_message`, rejected by the current supervisor as an unknown step shape. CLI-owned logs supplied the discriminating 503 cause. This is a provider-capacity blocker, not a demonstrated nested-agent prohibition or permission failure. The command probe used a private supervisor extended for one exact command and polling only its returned identifier; the adapter at that stage was file-only, and background command polling was not exercised. That failed probe did not establish a complete parent chain; the later repaired route did. The local Codex executable had also changed to 0.154.0-alpha.6.2; Terra low remained listed, but that new binary was not reached by this parent test.

## Official sources

Refresh these before a material policy change. Their sidebar identified CLI v1.2.0 when local testing used 1.2.2; prioritize discriminating local evidence when behavior differs.

- [Headless mode](https://antigravity.google/docs/cli/headless/): print invocation, structured streams, result envelopes, resumption, model selection and denial behavior.
- [Installation and authentication](https://antigravity.google/docs/cli/install/): cached account login and separate direct-provider setup.
- [Permissions](https://antigravity.google/docs/cli/permissions): inherited allow/ask/deny rules and workspace defaults. The write probe did not demonstrate the documented auto-allow expectation.
- [Execution modes](https://antigravity.google/docs/cli/modes/): planning behavior is distinct from permission enforcement.
- [Sandbox](https://antigravity.google/docs/cli/sandbox): terminal containment documentation identifies Linux and macOS; Windows remains unverified here.
- [Settings](https://antigravity.google/docs/cli/settings): settings that may affect the effective run.

The skill and its YON protocol are instructions. Parser, structural and graph checks validate only their stated properties. Runtime safety and successful task execution require the preflight, live supervision and independent verification described in the skill.

## Lifecycle repair verification, 2026-09-14

A native Windows fixture reproduced root exit with a descendant retaining inherited output handles. The repaired supervisor returned exit 1 with cleanup-unverified within its configured 300 ms grace (about 402 ms including startup). An external deadline fixture returned exit 1 in about 1.8 seconds for a 1.5-second deadline. Fixture descendants self-expired and process inspection found none remaining. The adapter does not claim to terminate an already orphaned descendant: the outer host must investigate its explicit uncertain-cleanup result. That historical pipe-based adapter bounded final report flushing to 500 ms after synchronous status/log retention; the current file-backed adapter uses the process deadline, shutdown grace and outer-host bound described in supervision.md. A real installed agy prompt then returned ADAPTER_OK, exit zero and no parser failures; the owned process was absent afterward. Taskkill launch/hang error handling is source-reviewed; fault injection for those helpers remains untested.

## Earlier 1.2.3 file smoke, 2026-09-15

The installed file-only supervisor returned the exact literal marker in approximately 20 seconds and the exact file token in approximately 31 seconds. The read used one approved absolute view_file call and a reviewed added workspace. Both runs had exit zero, one SUCCESS envelope, correct initialization, no denial/error diagnostics and independently checked output. The input hash was unchanged. This supersedes the earlier capacity failure only for these two invocations; it does not prove writes or nested agents.


## Earlier parent-dispatch failures, 2026-09-15

A separately reviewed Antigravity 1.2.3 parent command probe matched its exact temporary permission rule. Its tool nevertheless started the launcher in the CLI scratch directory, although the init event named the requested session directory. The launcher rejected that inherited directory before starting children. A follow-up tool call failed because WaitMsBeforeAsync was required; the prompted Cwd field was absent from the emitted parameters. Both temporary settings changes were restored to their exact original bytes.

Do not infer command working directory from init.cwd. The repaired launcher validates an absolute designated workspace and passes it explicitly to every child process. Background identifier/status handling would require separate verification if a future route needs polling. These streams did not establish that schema. That initial extension was withheld. The later repair below supports one immutable launcher after real testing. Use independently supervised sibling workers from a capable outer host. Pre-approval alone cannot add missing supervision support.


## Repaired route, 2026-09-15

The final synthetic command ran for ten seconds and returned its expected output without a status-poll tool. The real immutable launcher then completed three sequential no-tool workers: Codex 0.154.0-alpha.6.2 Terra low, Claude Code 2.1.272 Haiku, and Antigravity 1.2.3 Gemini 3.8 Flash low. Each returned its exact expected marker. The parent used one matched command step and returned success; temporary global permission settings were restored byte-for-byte. The helper explicitly chose its workspace and used file-backed child stdio. Read the supervision reference for the optional command contract. This does not certify arbitrary scripts, background polling, other operating systems or every model.
