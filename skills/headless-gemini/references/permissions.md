# Pre-approve headless work

Last verified 2026-09-15 on Windows, including Antigravity 1.2.3. One exact immutable launcher completed Codex, Claude and Gemini workers with independently checked results; see the repaired-route section below. Earlier 1.2.2 permission and capacity failures are historical evidence. This guide does not authorize configuration changes. Temporary permission rules were removed and original settings bytes restored.

## Diagnose the denied action

Read retained stderr and the actual tool target before proposing a change. Permission resources differ from tool names: a `view_file` denial can require `read_file(...)`, and `write_to_file` can require `write_file(...)`. A successful login or prompt does not establish tool access. Headless approval requests can be denied while the CLI returns exit zero and `SUCCESS`; reject results containing denials or tool errors. The official pre-approval route is an `action(target)` entry in `permissions.allow`. [Headless documentation](https://antigravity.google/docs/cli/headless/).

The local global settings contained only a weather-domain allow rule. The earlier parent probe failed reading its fixed helper before any child launched. This confirms the immediate blocker, but does not prove why the runtime did not recognize that file as an auto-approved workspace file. Do not describe that remaining ambiguity as a diagnosed CLI bug.

## Choose the scope before adding a rule

The interactive `agy` command **/permissions** offers Project, Shared and Global scopes; Project is unavailable without an active project. Select Project for project-specific grants when available. Shared affects other Antigravity products; Global affects other sessions. The manager has allow, ask and deny tabs, validates added rules, and supports removal. Its exact project/shared backing files and merge behavior have not been verified here, so use the manager rather than inventing configuration paths. [Permissions manager](https://antigravity.google/docs/cli/commands/permissions).

Global preferences are documented at `~/.gemini/antigravity-cli/settings.json`; that file was present locally. Missing settings can mean defaults, not disabled behavior. Inspect relevant permission, tool-review, artifact-review and workspace-access fields without exposing credentials. A temporary edit to this global file still affects concurrent and later sessions until restored. No targeted per-run allow-rule or alternate-settings-file flag appeared in local `1.2.2` help. [Settings reference](https://antigravity.google/docs/cli/settings).

## Rules and Windows caveats

Rules use `action(target)` under `permissions.allow`, `ask` or `deny`. Conflict order is deny, then ask, then allow: a broad ask rule can defeat a narrow allow. File-directory grants cover descendants; write grants imply read, while read denial also blocks writes. Commands use word-prefix matching or `regex:`. Windows commands that cannot be split cleanly need exact matching. Windows path normalization strips drive letters and converts backslashes to slashes. Do not treat a drive-qualified rule as proven drive isolation. These are documented semantics, not locally tested matcher guarantees. [Permission rules](https://antigravity.google/docs/cli/permissions).

An illustrative global merge fragment, not a replacement settings file:

```json
{
  "permissions": {
    "allow": [
      "read_file(D:/approved-work/input.txt)",
      "write_file(D:/approved-work/output.txt)",
      "command(regex:^& \"C:/tools/node\\.exe\" \"D:/approved-launchers/worker-smoke\\.mjs\"$)"
    ]
  }
}
```

Replace every example with reviewed actual paths and the exact emitted command. Preserve existing settings and all unrelated rules. Do not silently remove conflicting ask/deny rules. Avoid interpreter-wide grants such as `command(node)` or `command(powershell)`: these authorize much more than one worker. The quoted PowerShell command shape above matched in the live test with its actual executable and launcher paths. An initial rule for the unquoted form was correctly denied when the model emitted the quoted form. Derive the anchored pattern from the observed command, escaping regex metacharacters and then JSON-encoding it; do not broaden the rule to accommodate arbitrary variations. Recheck matching on another installation.

A fixed launcher must itself be reviewed and protected from worker edits. It must enforce child models, arguments, working directories, deadlines and cancellation. Permission to execute a launcher does not constrain what its children can do. These are supervision requirements, not properties supplied by an allow rule.

## File edit approval is a separate control

`--mode accept-edits` is documented and listed in local help. It applies to one invocation, automatically approves standard file edits, and is inherited by native subagents. It does not grant shell-command permission. This can be relevant when file review remains the blocker, but it is broader than approving one output file and has not been exercised here. Do not infer that it overrides explicit denies. `--mode plan` supplies planning instructions, not containment. [Execution modes](https://antigravity.google/docs/cli/modes).

The bundled `run-windows.mjs` has no execution-mode override; it permits one reviewed immutable launcher and rejects arbitrary shell/native subagent calls. Do not add unknown spec keys and assume they work. To test accept-edits or child dispatch, first provide a separately reviewed capable supervisor or explicitly extend and validate this adapter. Pre-approving commands alone does not remove that adapter boundary. `--add-dir` expands workspace access; it is not a restrictive file allowlist.

## Apply only a concrete approved setup, then verify

The parent prepares the exact scope, settings diff, affected sessions, launcher bytes, test targets and rollback before requesting any approval not already given. The running worker never grants itself access. Do not use blanket permission bypass or change authentication, billing, non-workspace access or sandbox settings as a shortcut.

After an authorized setup change, start a fresh bounded run. Test only the needed capability: exact synthetic read, exact output creation with independent byte comparison, then fixed child dispatch if separately authorized and supported by the supervisor. Capture stdout, stderr and settings preimages; verify targets, denials, tool errors and owned-process cleanup. Stop on the first blocker. Remove temporary grants through the same owner or restore only the approved diff after checking for concurrent edits. A CLI rewrite changed JSON formatting during the test: if bytes differ, compare parsed values before deciding whether a real concurrent edit occurred. Restore the original bytes only when the current values still equal the applied candidate; otherwise preserve unrelated changes and reconcile only the owned diff. Record successful and failed capabilities separately; documentation research must not advance live-test timestamps.

## Tested outcome and capacity diagnosis

The exact read returned the fixture token without an added workspace directory. The write completed with no denial, but its file had an extra trailing newline: authorization passed, exact artifact acceptance failed. No accept-edits mode or blanket bypass was needed for that write. The matched command started the fixed launcher and a child agy process. A later parent probe failed before dispatch. Runtime logs for both failures reported HTTP 503 / UNAVAILABLE and no server capacity for the selected Gemini model. This is not evidence that command permission or nested execution is forbidden.

The stream surfaced an `error_message` step without a useful cause; the current supervisor stops on that unrecognized step rather than accepting it as success. Preserve the failure and inspect the matching CLI-owned log by run timestamp. On this installation it was under `~/.gemini/antigravity-cli/log/cli-<timestamp>.log`; the top-level `cli.log` was insufficient. Logs may contain account data, so retain them privately and report only the relevant sanitized diagnosis. A transient startup auth warning was followed by successful auth setup; it was not the terminal cause. Do not change login or permissions to repair a confirmed capacity error, or switch model silently. Stop and use the normal bounded recovery policy. The first 35-second probe also timed out before inference; its single 90-second retry eventually returned the correct read.


## Earlier parent-dispatch failures, 2026-09-15

A separately reviewed Antigravity 1.2.3 parent command probe matched its exact temporary permission rule. Its tool nevertheless started the launcher in the CLI scratch directory, although the init event named the requested session directory. The launcher rejected that inherited directory before starting children. A follow-up tool call failed because WaitMsBeforeAsync was required; the prompted Cwd field was absent from the emitted parameters. Both temporary settings changes were restored to their exact original bytes.

Do not infer command working directory from init.cwd. The repaired fixed launcher validates an absolute designated workspace and passes it explicitly to every child process. Background identifier/status handling would require separate verification if a future route needs polling. These streams did not establish that schema. That initial extension was withheld. The later repair below supports one immutable launcher after real testing. Use independently supervised sibling workers from a capable outer host. Pre-approval alone cannot add missing supervision support.


## Repaired route, 2026-09-15

The final synthetic command ran for ten seconds and returned its expected output without a status-poll tool. The real immutable launcher then completed three sequential no-tool workers: Codex 0.154.0-alpha.6.2 Terra low, Claude Code 2.1.272 Haiku, and Antigravity 1.2.3 Gemini 3.8 Flash low. Each returned its exact expected marker. The parent used one matched command step and returned success; temporary global permission settings were restored byte-for-byte. The helper explicitly chose its workspace and used file-backed child stdio. Read the supervision reference for the optional command contract. This does not certify arbitrary scripts, background polling, other operating systems or every model.
