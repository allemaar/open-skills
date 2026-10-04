---
name: headless-gemini
description: >
  Run bounded Gemini tasks through Antigravity CLI (agy). Trigger on /headless-gemini,
  "run Gemini headlessly", or "supervise agy". Not for the separate gemini CLI,
  installation, authentication changes, or API-key setup.
visibility: public
triggers:
  - "/headless-gemini"
  - "run Gemini headlessly"
  - "supervise agy"
next-skills: []
self-improvable: true
---

# /headless-gemini

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` discovers local CLI paths without inference; a found CLI is not proof of authentication, model access or parent supervision. Missing tools produce explicit route gaps, never automatic installation, login, API fallback or configuration change.

Run one bounded task using an installed Antigravity CLI and its existing account login. The skill name identifies the model family; the executable is `agy`, not `gemini`. It does not install software, change credentials or persistent permissions, enable paid credits, or authorize additional work.

**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync; update both when their contract changes and refresh the `@STAMP` date.

## Shared contract and freshness

Read the [shared run contract](references/run-contract.md) and [freshness policy](references/freshness.md) before every run, including explicit model selections and resume. Read [model-state.json](references/model-state.json); when Node is available run `node <skill-dir>/scripts/check-model-freshness.mjs <absolute-state-file>`, otherwise apply its timestamp rules. Missing/future/failed/invalidated state or age at least `policy.reminderDays` is due. The outer parent offers one update-all or continue-dated choice per session snapshot/reasons; an explicit update request needs no repeated question. Noninteractive children return due status to the parent, never prompt or refresh recursively. Preserve explicit model choices.

Any shell-capable parent may launch this CLI only when it can retain, monitor and cancel the process within its outer permissions. Context, budgets and native subagent identity do not transfer. Default to sibling workers under one supervisor; further delegation needs separate bounded authorization. The adapter permits one separately approved immutable launcher through its optional command contract; native subagents and arbitrary shell dispatch remain unsupported.

## Discover and bound

1. Resolve the actual executable, run `agy --version`, `agy --help`, and `agy models`. Use current local help and catalog rather than flags or model names remembered from another CLI. If a newly installed binary is missing from the supervising shell's PATH, inspect the configured user PATH and invoke the verified executable by absolute path. Do not reinstall or edit PATH.
2. Record the exact working directory, outcome, input sources, permitted tools and paths, output destination, model, effort, deadline, monitoring and cancellation mechanism, and retry limit (zero by default). Treat an ambiguous write scope as read-only. Assign an exact retained artifact before substantial work; the supervisor captures it when the worker lacks write authorization.
3. Respect an explicit model and effort. Otherwise select and disclose a locally listed Gemini model appropriate to the task. Prefer a listed effort-specific slug; use `--effort` only after verifying its supported combination. Any model named in dated validation is historical test evidence, not a default or current entitlement. An unavailable selection is a blocker, never permission to substitute another model or provider.
4. Inspect only non-secret configuration fields needed to establish the provider, permission mode, inherited allow rules, and relevant customizations. Cached login works in print mode. API-key presence is not OAuth evidence: Antigravity's direct Gemini provider is a separate configuration and billing path. Never print keys, inspect credential stores, change providers, or infer a Google AI Pro quota tier from a successful answer. Stop on authentication, billing, or model-access errors.
5. Use a trusted, minimal directory. Review any added workspace and relevant instructions, agents, plugins, hooks, or MCP servers before relying on them. Do not bulk-load skills. Default to `--disable-slash-commands` for literal prompts; omit it only for an explicitly selected, inspected skill that is available in the target runtime. It does not establish plugin or MCP isolation.

Consult the bundled [model-selection map](references/model-selection.md) for task, cost, and long-horizon coding-quality evidence. It is a dated comparison, not a live catalog or universal task ranking: do not transfer coding benchmarks to research, writing, or other work. Preserve an explicit model and effort; when useful, propose a cheaper or stronger locally listed setup with its cost/quota, quality evidence, latency, and reversal condition. The benchmark evidence does not establish that an agy model has an authorized autonomous-write route.

## Authority is weaker than a sandbox

`agy 1.2.4` exposes a broad built-in tool surface. Its help has no equivalent of Claude's per-run `--tools` plus `--strict-mcp-config` restriction. `request-review` does not mean read-only: inherited rules and workspace behavior affect actual authorization. `--mode plan` prefixes a planning instruction; it is not proof of filesystem isolation. The documented terminal sandbox covers Linux and macOS, and does not establish Windows support or containment of every tool.

For tasks requiring enforced read-only or exact tool isolation, stop unless that boundary is independently established before launch. For an authorized supervised task in a trusted environment, disclose that tool-call monitoring is detection after dispatch, not prevention. Never use `--dangerously-skip-permissions`, assume a prompt enforces permissions, or broaden settings to resolve a denial. A needed permission change is a separate, exact configuration proposal.

For file work, put absolute approved paths in the prompt. Add only the reviewed workspace with `--add-dir`; this expands access and is not an allowlist. In the initial smoke test, CWD metadata alone did not stop the model guessing paths outside the intended directory. Explicit absolute input plus `--add-dir` succeeded, while a write was denied. Later exact-path allow rules enabled read and file creation without an added workspace; the written artifact had an extra newline and failed exact-byte acceptance. Do not confuse permission success with artifact correctness or promise default workspace approval on every installation.

Before proposing permission recovery, read [pre-approval and troubleshooting](references/permissions.md). It covers scoped allow rules, interactive Project/Shared/Global setup, conflicting ask/deny rules, Windows matching, and the distinct `--mode accept-edits` control. Prepare an exact separately authorized setup change; do not let a running worker grant itself access. The bundled adapter supports one exact launcher through allowedCommandCall, described in the supervision reference. It has no execution-mode override, arbitrary shell or native subagent support. The launcher must set its own reviewed child workspace: command execution can start in the CLI scratch directory. Supply WaitMsBeforeAsync=5000 in the tool request; current streams may omit it. Background status polling remains unsupported.

A private fixed-command supervisor demonstrated launcher and child-process startup after its rule matched the actual quoted PowerShell command. Subsequent inference failed with provider capacity 503 errors. If the stream reports an opaque error step, preserve it and inspect the matching private runtime log before proposing permission or login changes; never silently switch models to hide that failure.

## Launch and observe

Use a foreground child owned by a supervising runner that returns control while it runs, retains its handle, captures stdout and stderr concurrently, and enforces an external deadline. Stop before launch if those capabilities are unavailable. Use native monitoring when it satisfies this contract, or the optional tested [Windows Node supervisor](references/supervision.md). Other operating systems need their own verified process-group cancellation adapter.

```text
agy -p "<bounded prompt with exact paths>" --model <local-gemini-slug> --output-format stream-json --disable-slash-commands --print-timeout 90s
```

The duration above is an example. Choose it for the task and set an external deadline that also covers startup and shutdown. Native `--print-timeout` alone is insufficient: the tested immediate timeout returned an empty `SUCCESS` envelope and exit code zero. No native spend, token, or turn ceiling was exposed in tested help; a deadline limits elapsed time, not account usage. Disclose that gap before expensive work and never enable credit fallback.

Pass prompt and arguments as separate process arguments with shell execution disabled. Do not interpolate input into shell syntax. For large input, use the tested `--input-format stream-json --output-format stream-json` route, send exactly one serialized `user` message, and close stdin. Plain text piped alongside `-p` was ignored in the test; do not use that shape for diffs or document content.

```json
{"event":"user","message":{"content":"<bounded task and its input>"}}
```

Retain raw stdout, stderr, process identity, deadline, exit code, and terminal result. Check the initial event's CWD, requested model and permission mode. The model field records the CLI selection; it is not independent backend attestation. Inspect actual tool names, targets and errors throughout. Stop on unexpected actions, denied actions, authentication/billing errors, malformed events, or scope drift. Preserve partial output. Emit a meaningful checkpoint within 60 seconds and at material changes.

On timeout or cancellation, interrupt through a supported native mechanism; if necessary terminate only the retained process tree and verify it stopped. The Windows adapter uses scoped `taskkill /PID <owned-pid> /T /F`, which is forced termination, not graceful SIGINT. Never kill processes by executable name. Recheck owned descendants after normal completion too. Cleanup has a finite grace period independent of root exit and inherited pipes; if termination cannot be proved, return incomplete with cleanup-unverified and have the outer host investigate. Report any uncertain stopped state.

## Accept the result

One-shot streaming output uses `event: init`, `event: step_update`, and `event: result`; the completion envelope is in `.result`. With `--output-format json`, the envelope is the whole document. In either case, answer text is `.response`, not `.result` as a text field.

Require all of these before declaring harness success:

- Process exit zero, exactly one complete terminal envelope, `status: SUCCESS`, and nonempty expected output.
- No `error`, nonempty `denied_actions`, tool error, permission-denial diagnostic, timeout diagnostic, cancellation, or unexplained truncation.
- Expected CWD/model selection and only the approved observed actions and targets.

Then independently verify the requested answer or artifact and recheck the target state. A denied command or write can produce exit zero and `SUCCESS`; check the full evidence even if the model supplies a plausible answer. A parser validates structure, not correctness. Keep raw private logs outside public repositories; publish only sanitized findings.

Return outcome, version, selected model/effort, authentication evidence and limits, observed permissions, checked paths, exit/status, result location, and material gaps. Do not claim installation, account tier, write capability, or strict isolation from a prompt-only success.

## Recovery and resume

Inspect retained output before another inference. Never automatically retry an authentication, billing, model, or permission blocker. At most one retry requires new evidence that addresses the failure, caller authorization, and a remaining recorded budget. Changing a test case does not authorize broadening its permissions.

Resume only when requested, using the exact retained `conversation_id` with `--conversation <id>`. Repeat preflight and all model, path, permission and supervision controls. Avoid `--continue` in automation because another conversation may become latest. Do not claim one-shot operation is ephemeral: the CLI may retain conversation state and logs.

## Evidence to refresh

Read [validation and source boundaries](references/validation.md) before changing command, output, authentication, or permission policy. It separates historical runtime observations from current catalog evidence and lists untested capabilities.

**Self-improvement.** If a concrete blocking or recurring skill weakness appears, propose a specific repair for approval; otherwise remain silent. Never auto-apply. No sibling skill is required.

For current account quota and reset times, use headless-usage. It attempts live reads independently of model-map freshness and labels unavailable or cached provider data explicitly.


## Choose a compatible parent route

On Windows, use the bundled [file-backed process runner](references/process-supervision.md) when Node pipe capture fails with EPERM. It retains live file-backed stdout/stderr without changing permissions. A successful version probe does not prove that a nested CLI can reach its login, writable runtime state or network.

When those remain blocked inside a parent sandbox, use the [fixed outer dispatcher](references/fixed-dispatch.md) only from an already authorized capable host. Prepare and review one immutable worker specification before starting the restricted parent. The parent can request that task by its fixed ID; it cannot supply a command, change arguments or grant itself permissions. If no such host is available, report the missing capability and the concrete setup needed. Do not copy credentials, silently switch executables/models, or weaken the parent sandbox.
