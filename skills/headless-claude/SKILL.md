---
name: headless-claude
description: >
  Run a bounded, observable Claude Code headless task with explicit model, least-privilege tools, and preserved authorization. Trigger on /headless-claude, "run Claude headlessly", "use Claude -p", or "supervise a Claude harness". Not for changing Claude authentication or installing Claude Code.
visibility: public
triggers:
  - "/headless-claude"
  - "run Claude headlessly"
  - "use Claude -p"
  - "supervise a Claude harness"
next-skills:
  - skill: verify
    phrase: "/verify"
    why: "Verify the target artifact independently after a successful harness run."
self-improvable: true
---

# /headless-claude

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` discovers local CLI paths without inference; a found CLI is not proof of authentication, model access or parent supervision. Missing tools produce explicit route gaps, never automatic installation, login, API fallback or configuration change.

Run a Claude Code task non-interactively without turning a review or a bounded automation into an unmonitored shell. This skill is portable: use the locally installed `claude` executable and its own `--help` as the authority for supported flags. It does not install Claude Code, change credentials, call an API directly, or grant permissions beyond the requested task.

**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Decide the run

Every run follows the shared [`run-contract`](references/run-contract.md). The parent must own the child process, retain its handle, capture stdout and stderr concurrently, report status, enforce the deadline, and interrupt or terminate only that process tree. Parent and child permissions compose to the narrower effective boundary. Do not recursively delegate from the child unless that nested delegation is separately scoped, bounded, authorized, observable, and cancellable.

Before launch, record the exact working directory, requested outcome, read/write scope, model choice, timeout, status surface, stop command, retry limit, and any locally supported spend or turn controls. Run a foreground process owned by a supervising runner that can retain its handle, read output while it runs, and interrupt it. This workflow prohibits `--bg` with `-p`; do not claim the CLI rejects that combination unless it was verified in the target version. Use `--output-format stream-json --verbose --include-partial-messages`; retain stdout, stderr, the final `result` event when present, and exit code. When local help supports `--max-budget-usd` or `--max-turns`, set an agreed bound appropriate to the run. Such controls are stop limits, not an exact billing guarantee. Do not make a subscription, credit, or billing claim unless current primary documentation confirms it for the chosen authentication route.

Do not use `--bare` for a subscription-login run. `--bare` deliberately skips OAuth and system-keychain credentials and requires a supported API-key path instead. A normal `claude -p` can use the existing subscription login.

In noninteractive mode, an inherited `ANTHROPIC_API_KEY` takes precedence over subscription OAuth. Diagnose only variable presence and scope, never print its value. If the Handler explicitly chooses the existing subscription identity, clear that variable only in the child process before launch. Do not alter user, machine, shell-profile, keychain, or Claude configuration state. If authentication, billing consent, model access, or a permission prompt blocks the run, return the exact error and stop.

## Models and effort

Before every run, read `references/model-state.json` and check its freshness. When Node is available, run `node scripts/check-model-freshness.mjs <absolute-model-state-path>`; otherwise apply the same date rules using `policy.reminderDays`; missing, future-dated, failed, or explicitly invalidated evidence is due immediately. If due, the parent asks the Handler once per session whether to refresh the complete snapshot or continue with the dated snapshot. A child never asks independently. With no Handler present, report the due state to the parent and stop for that choice. Never update the snapshot automatically. Explicit model and effort choices remain controlling.

Last checked: 2026-09-10 against the Claude Code model configuration documentation. Documented selections are `default`, `best`, `fable`, `sonnet`, `opus`, `haiku`, `sonnet[1m]`, and `opus[1m]`, plus provider-supported full model names. A documented option is not proof that the current account, policy, provider, or plan permits it. Confirm the selected model from the `system/init` event or final result; never claim untested models were available.

Respect an explicit Handler model. Otherwise these are recommendations, not capability claims:

Consult the bundled [model-selection map](references/model-selection.md) for task, cost, and long-horizon coding-quality evidence. It is a dated comparison, not a live account catalog or universal task ranking: do not transfer coding benchmarks to research, writing, or other work. Preserve an explicit model and effort; when useful, propose a cheaper or stronger available setup with its cost/quota, quality evidence, latency, and reversal condition. The benchmark's Fable 5 result does not establish performance for the current Fable 5.1 alias.

Check both the flag in `claude --help` and effort support for the selected model in current model documentation. CLI-wide accepted levels do not prove model support. Haiku does not support effort selection; omit `--effort` for it. If an explicit model or effort is unsupported, report the blocker and stop. Do not use model fallback, `best`, Fable, or any usage-credit path silently when it would change the Handler’s cost or model choice.

## Minimize authority

For a read-only inspection, combine `--restricted --strict-mcp-config` with a fixed built-in read-only tool list, such as `Read,Glob,Grep`, plus `--permission-mode dontAsk --permission-prompts none`. Verify these flags in local help before launch. Supply no MCP configuration: `--tools` limits built-in tools only, while `--strict-mcp-config` excludes inherited MCP servers. Do not claim that a built-in tool list alone excludes MCP tools. For a write task, name exact writable paths and obtain the authorization required by the host before enabling only the necessary edit tools. For an exact file grant, expose `Write` in `--tools` but authorize its path with `Edit(<path>)`: Claude Code applies `Edit` rules to every built-in editing tool. On Windows use its normalized absolute pattern, such as `Edit(//d/agent-spaces/fixture/output.txt)`, and pair it with an equally exact `Read(//d/.../input.txt)` when needed. Do not use `Write(...)`, a bare tool grant, a directory wildcard, or `acceptEdits` as substitutes. See [scoped file permissions](references/permissions.md). Never use `bypassPermissions` or either dangerously-skip flag for this workflow.

Tool exposure and noninteractive authorization are separate. For least-privilege web research, `--tools WebSearch,WebFetch` exposes those built-ins but does not authorize their use under `dontAsk`; pair it with `--allowedTools WebSearch,WebFetch`. The failure symptom is a permission denial after a tool is visible in `system/init`. The deterministic correction is that exact help-supported `--allowedTools` pair, while retaining `--permission-mode dontAsk --permission-prompts none`; do not replace it with bypass or dangerously-skip flags. Immediately after launch, confirm `system/init` lists only the approved web tools. Afterward, retain evidence of the requested `WebSearch`/`WebFetch` events and no permission denial, including an empty `permission_denials` result field when emitted.

Launch from a trusted working directory. `--add-dir <path>` grants file access to an additional directory; it is not general configuration discovery. Claude Code does load `.claude/skills/` found in an added directory, so add only a deliberately reviewed directory. Do not bulk-inject skills, enable additional `CLAUDE.md` loading, or accept a skill's `allowed-tools` as permission to broaden this harness.

For a literal prompt, pass `--disable-slash-commands` by default and use `--safe-mode` when local help confirms it and no required configuration depends on customizations. For a selected skill, omit those disabling flags as necessary, select only that relevant installed skill, read its `SKILL.md` and required references, and include its literal slash invocation in the bounded prompt. Verify that it is available in the target Claude environment; if it is required but unavailable, stop and report that gap. A skill needing tools outside the approved list is a scope blocker. Do not enable those tools automatically. Inspect `system/init` for effective skills, slash commands, plugins, MCP servers, and tools; report anything the CLI cannot enumerate or disable as a limitation.

## Invoke, supervise, and close

### Output capture is part of the harness

Do not use a PowerShell asynchronous scriptblock callback for child-output capture unless its runspace safety has been verified. Those callbacks can run without the execution context needed to capture output, which has caused repeated supervisor failures. Prefer Node `child_process` stream handlers, or another verified runspace-safe method. Retain the child handle, collect stdout and stderr concurrently, preserve startup evidence including `system/init`, and keep the external timeout plus scoped cancellation and cleanup under the supervising runner. A capture failure is an incomplete harness run, not a model failure.

### File-backed results for substantial work

Before launching a substantial deliverable, assign its exact result-artifact path. When the authorized write scope permits it, the worker saves the complete result there. A read-only review never gains write authority implicitly: the supervisor must instead durably capture the complete structured output at the assigned artifact through an already-authorized supervisor path. Stream stdout and stderr to retained logs while live, and retain progress or status with the child identity, deadline, and cancellation state. Preserve partial outputs on failure. Display truncation is not lost output when the persisted artifact remains complete.

Before declaring completion, verify that the artifact exists, is readable, contains the complete result, and that the requested task is correct. Return a compact artifact path, status, checks, and gaps rather than a giant transcript. Short answers do not need an unnecessary file. File-backed capture does not broaden permissions or authorize secrets in logs. On recovery, inspect the saved artifact before rerunning inference.

Use the help-verified noninteractive shape below, replacing placeholders deliberately:

```text
claude -p "<bounded task>" --model <explicit-model> --restricted --strict-mcp-config --tools <exact-tools> --permission-mode dontAsk --permission-prompts none --output-format stream-json --verbose --include-partial-messages
```

For a WebSearch/WebFetch run, use this least-privilege variation:

```text
claude -p "<bounded research task>" --model <explicit-model> --restricted --strict-mcp-config --tools WebSearch,WebFetch --allowedTools WebSearch,WebFetch --permission-mode dontAsk --permission-prompts none --output-format stream-json --verbose --include-partial-messages
```

Add `--safe-mode` when disabling customizations is appropriate and will not defeat an explicitly required configuration. Do not add `--bare` to a subscription-authenticated run. Do not pass credentials in the prompt, command line, log, or result.

At launch, capture the runner process handle and the `system/init` fields for CWD, effective model, tools, and authentication source. Cancel if observed tools exceed the approved set. For web research, also stop if the expected web tools are absent, and do not treat tool exposure as authorization until the run shows the tools were used without a permission denial. Report a meaningful checkpoint within 60 seconds, then at material state changes. Enforce the agreed deadline externally. On timeout, interrupt the process through the runner with Ctrl+C/SIGINT and confirm it stopped; if interruption fails, use the runner's scoped process termination capability and report the outcome. Resume only a persisted session with `claude -p --resume <session-id> "<bounded follow-up>"` when the Handler asks, after repeating preflight and supplying the same approved model, tool, permission, and supervision controls. Do not pretend `--no-session-persistence` sessions can resume.

Treat a successful process exit as harness completion, not proof that the requested work is correct. Report the final result text, exit code, effective model, inspected or changed paths, scope actually checked, and material gaps. Recheck the target state after a read-only review if concurrent edits could have made its evidence a mixed snapshot.

If output is empty, malformed, truncated, or lacks a final result, preserve the available output and report an incomplete run. Preserve stderr for launch errors and stdout result errors for in-run failures. Retry at most once, only when new evidence changes the launch configuration and the Handler authorizes it within the recorded limit; never silently retry an authentication, billing, model, or permission blocker.

## Sources to refresh before a material release

- [Claude Code headless mode](https://code.claude.com/docs/en/headless)
- [Claude Code model configuration](https://code.claude.com/docs/en/model-config)
- [Claude Code authentication](https://code.claude.com/docs/en/team)
- [Claude Code permissions](https://code.claude.com/docs/en/permissions)
- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-usage)

**Next skills.** On completion, offer the frontmatter verification recommendation if that skill is installed. This offer needs no sibling protocol and never auto-invokes another skill.

**Self-improvement.** If the run surfaced a concrete blocking or recurring weakness in this skill, propose a specific fix for the Handler to approve; otherwise remain silent. Never auto-apply. This completion step is self-contained and requires no sibling skill.

For current account quota and reset times, use headless-usage. It attempts live reads independently of model-map freshness and labels unavailable or cached provider data explicitly.


## Choose a compatible parent route

On Windows, use the bundled [file-backed process runner](references/process-supervision.md) when Node pipe capture fails with EPERM. It retains live file-backed stdout/stderr without changing permissions. A successful version probe does not prove that a nested CLI can reach its login, writable runtime state or network.

When those remain blocked inside a parent sandbox, use the [fixed outer dispatcher](references/fixed-dispatch.md) only from an already authorized capable host. Prepare and review one immutable worker specification before starting the restricted parent. The parent can request that task by its fixed ID; it cannot supply a command, change arguments or grant itself permissions. If no such host is available, report the missing capability and the concrete setup needed. Do not copy credentials, silently switch executables/models, or weaken the parent sandbox.
