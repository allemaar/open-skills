---
name: headless-codex
description: >
  Run Codex CLI safely in bounded non-interactive workflows, including /headless-codex,
  "run Codex headlessly", and "automate Codex CLI". Not for creating skills or changing
  Codex configuration.
visibility: public
triggers:
  - "/headless-codex"
  - "run Codex headlessly"
  - "automate Codex CLI"
next-skills: []
self-improvable: true
---

# /headless-codex

Before every run, read [access and failure handling](references/access.md) and discover the current host state. The bundled `scripts/check-access.mjs` discovers local CLI paths without inference; a found CLI is not proof of authentication, model access or parent supervision. Missing tools produce explicit route gaps, never automatic installation, login, API fallback or configuration change.

Run one bounded Codex CLI task non-interactively while preserving the caller's chosen model, permissions, working directory, and stop condition. Use it from Claude, Codex, or another shell-capable supervising harness, provided the target `codex` CLI is installed in that harness's environment. It does not authorize configuration changes, installation, credential changes, repository writes, or broad skill loading.

**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Preflight

Every run follows the shared [`run-contract`](references/run-contract.md). The parent must own the child process, retain its handle, capture stdout and stderr concurrently, report status, enforce the deadline, and interrupt or terminate only that process tree. Parent and child permissions compose to the narrower effective boundary: a capable child cannot exceed the parent's authority, and a permissive parent does not broaden this skill. Do not recursively delegate from the child unless that nested delegation is separately scoped, bounded, authorized, observable, and cancellable.

1. Confirm that the target `codex` executable is available with `codex --version`, then inspect `codex exec --help`. Use `codex login status` only to report authentication state. Never print, copy, or inspect credentials. Inspect the effective configuration sources relevant to the run, including inherited settings, hooks, MCP servers, and skills. Report any part that the current CLI cannot enumerate or disable as a limitation rather than claiming isolation.
2. Resolve one explicit working directory and task. Check whether it is an accepted Git workspace before inference; Codex refuses an untrusted non-Git directory by default. For an intentionally non-Git task, inspect the supported --skip-git-repo-check option and establish trust explicitly, or use an authorized private Git fixture. Do not repeat the same launch after this preflight failure. State whether the task is read-only or may write. Treat an absent or ambiguous write boundary as read-only.
3. Before every run, read `references/model-state.json` and check its freshness. When Node is available, run `node scripts/check-model-freshness.mjs <absolute-model-state-path>`; otherwise apply the same date rules using `policy.reminderDays`; missing, future-dated, failed, or explicitly invalidated evidence is due immediately. If due, the parent asks the Handler once per session whether to refresh the complete snapshot or continue with the dated snapshot. A child never asks independently. With no Handler present, report the due state to the parent and stop for that choice. Never update the snapshot automatically. Explicit model and effort choices remain controlling.
4. Choose a model and reasoning effort from the target runtime's catalog, not from a remembered or API model list. Run `codex debug models` and use only entries exposed to the caller. Use the bundled [model-selection map](references/model-selection.md); do not maintain a competing recommendation table here. See [model availability](references/models.md).
5. For a literal prompt, avoid loading optional skills or broad customization and disclose any inherited customization the CLI cannot disable. When the task explicitly selects a skill, inspect only that skill and its required references, then mention it literally, such as `$openai-docs`. Do not paste, enumerate, or request the entire catalog. A skill's requested tools do not enlarge parent or child authority.
6. Record a finite timeout and deadline, the runner's observable stdout/stderr surface, its retained process handle and scoped interruption/termination method, and a retry limit of zero by default (at most one explicitly authorized retry). The runner must return control while the process runs so the supervisor can check it within 60 seconds and enforce the deadline. If that capability is unavailable, stop before launching.

Historical maintainer validation for CLI 0.144.4 found `--ignore-user-config`; that observation is not a default or current capability claim. Use it only when the target CLI's current help exposes it and after reviewing required configuration. It skips the user config file while retaining the same CODEX_HOME authentication store, but is not proof of total hook, rule, skill or connector isolation. Do not use it when it would drop a required boundary or capability, and do not use `--ignore-rules` to evade approval rules.

### Scoped prerequisite-read observation

For an exact fixture that must read prerequisite directives outside its writable workspace, current CLI configuration accepts a per-invocation inline permission-profile definition: select `default_permissions`, extend `:workspace`, and place reviewed absolute roots in one filesystem table with `read` values. Use forward-slash Windows paths in that table. Do not add prerequisite roots through `--add-dir` or `workspace_roots`, because those make them writable workspace roots. Omit `--sandbox` when evaluating a profile because that flag selects legacy sandbox settings.

```text
-c 'default_permissions="<profile>"'
-c 'permissions.<profile>.extends=":workspace"'
-c 'permissions.<profile>.filesystem={"C:/reviewed/prerequisite-a"="read","C:/reviewed/prerequisite-b"="read"}'
```

This is not a proven permission remedy. A local fixture read/write passed with inherited configuration plus the inline profile, but the effective policy interaction was not observable. In that environment, inherited `sandbox_mode="danger-full-access"` and Windows `unelevated` sandboxing could have affected the result. The same profile with `--ignore-user-config` was denied on prerequisite reads, an observed interaction rather than a proven cause. Verify effective enforcement from command events and retained artifacts before relying on the profile as a boundary.

## Command shape

Use a foreground, bounded command so its output is observable and the launcher can stop it.

```text
codex exec --ephemeral --sandbox <read-only|workspace-write> -C <working-directory> -m <model> -c 'model_reasoning_effort="<effort>"' "<bounded task>"
```

- Use `--ephemeral` for one-off runs that do not need a resumable session. Omit it only when deliberate resumption is required.
- Start with `--sandbox read-only`. Use `workspace-write` only when the caller explicitly authorizes the exact workspace change.
- Historical maintainer validation for 0.144.4 exposed `-c` / `--config key=value` and used the effort field `model_reasoning_effort`. When current target help and configuration confirm the same interface, pass `-c 'model_reasoning_effort="medium"'` as one argument in PowerShell or a POSIX shell.
- Historical maintainer validation for 0.144.4 found that `codex exec` did not accept `--ask-for-approval`; inspect current `codex exec --help` instead of carrying that result to another version.
- Use `--json` when a caller needs machine-readable events. Use `--output-last-message <file>` only when the caller authorizes that output artifact and its destination.
- Quote the prompt as one argument. Do not interpolate untrusted text into shell syntax. Pass large prompts through standard input only after inspecting the local CLI help and preserving the same task boundary.

## Model and effort choice

Respect an explicit user model and effort choice. If either is absent from or unsupported by the target catalog, report the exact unavailable selection and stop; do not substitute. Only when a choice was not specified, choose a locally exposed model or supported effort that fits the task and disclose the selection.

Consult the bundled [model-selection map](references/model-selection.md) for task, cost, and long-horizon coding-quality evidence. It is a dated comparison, not a live catalog or universal task ranking: do not transfer coding benchmarks to research, writing, or other work. Preserve an explicit model and effort; when useful, propose a cheaper or stronger locally available setup with its cost/quota, quality evidence, latency, and reversal condition.

Do not claim that a model documented for the API is selectable in this Codex account. Do not silently substitute a stronger model. Re-run local discovery when the CLI, account, workspace, or host changes.

## Output, resume, and cancellation

### File-backed results for substantial work

Before launching a substantial deliverable, assign its exact result-artifact path. When the authorized write scope permits it, the worker saves the complete result there. A read-only review never gains write authority implicitly: the supervisor must instead durably capture the complete structured output at the assigned artifact through an already-authorized supervisor path. Stream stdout and stderr to retained logs while live, and retain progress or status with the child identity, deadline, and cancellation state. Preserve partial outputs on failure. Display truncation is not lost output when the persisted artifact remains complete.

Before declaring completion, verify that the artifact exists, is readable, contains the complete result, and that the requested task is correct. Return a compact artifact path, status, checks, and gaps rather than a giant transcript. Short answers do not need an unnecessary file. File-backed capture does not broaden permissions or authorize secrets in logs. On recovery, inspect the saved artifact before rerunning inference.

Capture the process handle, stdout, stderr, exit code, event stream, and final output. Require exit zero, a complete terminal success result, nonempty expected output, and no terminal error, tool error, permission denial, timeout, cancellation, malformed event, or unexplained truncation. Report a checkpoint within 60 seconds and at material changes while monitoring the externally enforced deadline. On timeout or cancellation, interrupt that process through the supervising runner, confirm exit, and use its scoped termination mechanism if interruption fails. Report whether it stopped and preserve partial output. A successful process is evidence only that the run finished; verify the requested artifact or change separately.

Do not treat a parent agent's ability to launch a helper as proof that the helper can spawn its own provider CLIs. A current Windows compatibility attempt completed prerequisite reads but each nested provider `--version` spawn failed with `EPERM`. Preserve that exact blocker and route execution to a capable outer supervisor; do not weaken sandbox, rules, or permissions to conceal it.

Current Codex may encode this exact advisory as an `item.type: error`: “Skill descriptions were shortened to fit the skills context budget. Codex can still see every skill, but some descriptions are shorter. Disable unused skills or plugins to leave more room for the rest.” Preserve that exact message as a warning when required skills remain available and the turn otherwise completes correctly. It does not say skill content or task output was lost. Do not whitelist other item errors, actual omitted required skills, tool denials or terminal failures, and do not disable rules to suppress a warning.

On authentication, model, permission, or billing failure, preserve the exact error and stop without substitution or automatic retry. Empty, malformed, truncated, or missing final output is an incomplete result, even with exit code zero. A retry requires new evidence addressing the failure, explicit authorization, and remaining time within the recorded deadline; never exceed the recorded limit of at most one retry.

For a non-ephemeral run, record the session ID printed by Codex. Continue only with the exact ID:

```text
codex exec resume <session-id> "<bounded follow-up>"
```

The local CLI also exposes `codex exec resume --last`; avoid it in automation because another run may become the latest session. Before resuming, repeat preflight and inspect local resume help to preserve the approved model, effort, working directory, and sandbox through supported options; stop if those boundaries cannot be established. Apply the same deadline and monitoring requirements. The observed CLI exposes no dedicated `exec cancel` command. Keep the process owned by the supervising runner and observable; do not launch an unmonitored background run.

## Completion report

Report the CLI version, authentication state without secrets, selected model and effort, sandbox, working directory category, exact command shape with sensitive values redacted, exit code, observed output location, and any unverified claims or warnings. Do not report a write as complete without checking the changed target.

## Source boundary

The command behavior in this skill is based on the installed CLI help and a read-only smoke run, not a promise that every account has the same models or permissions. Consult [model availability](references/models.md) and current official Codex documentation before changing model policy or relying on a new flag.

**Self-improvement.** If the run surfaced a concrete blocking or recurring weakness in this skill, propose a specific fix for the Handler to approve; otherwise remain silent. Never auto-apply. This completion step is self-contained and requires no sibling skill.

For current account quota and reset times, use headless-usage. It attempts live reads independently of model-map freshness and labels unavailable or cached provider data explicitly.

Read [current validation](references/validation.md) when diagnosing a zero-exit run with missing artifacts or skill-context errors. The tested current CLI could return a completion claim after a policy-denied action; independent artifact verification remains mandatory.


## Choose a compatible parent route

On Windows, use the bundled [file-backed process runner](references/process-supervision.md) when Node pipe capture fails with EPERM. It retains live file-backed stdout/stderr without changing permissions. A successful version probe does not prove that a nested CLI can reach its login, writable runtime state or network.

When those remain blocked inside a parent sandbox, use the [fixed outer dispatcher](references/fixed-dispatch.md) only from an already authorized capable host. Prepare and review one immutable worker specification before starting the restricted parent. The parent can request that task by its fixed ID; it cannot supply a command, change arguments or grant itself permissions. If no such host is available, report the missing capability and the concrete setup needed. Do not copy credentials, silently switch executables/models, or weaken the parent sandbox.
