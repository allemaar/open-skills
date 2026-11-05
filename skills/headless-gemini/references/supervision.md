# Windows supervision adapter

The optional [Node script](../scripts/run-windows.mjs) runs one structured-input turn with a retained child handle, concurrent file capture, 30-second progress, an external deadline, and scoped Windows process-tree termination. It requires Node and an installed native `agy.exe`. Read it before running it. It is a supervisor, not a security boundary or a replacement for the skill's preflight.

The model filter accepts `gemini-*` and exactly `claude-opus-5-5-{low,medium,high}` and `claude-sonnet-5-5-{low,medium,high}`. Braces describe alternatives, not literal slugs. Check the exact selected slug against current local `agy models` before inference; parser acceptance alone proves neither catalog availability nor account access. GPT and other Claude slugs remain unsupported. For Claude, read [model routing and evidence](claude-models.md); the Antigravity tool monitor and permission contract apply regardless of model family.

Prepare a private prompt file and a JSON spec with absolute paths. The output directory must not already exist and its parent must exist. The script rejects symbolic links and junctions in inspected path chains. It does not provide an atomic defense against concurrent filesystem replacement; use a trusted directory without concurrent writers.

```json
{
  "executable": "<absolute-agy.exe>",
  "cwd": "<absolute-trusted-workspace>",
  "promptFile": "<absolute-private-prompt.txt>",
  "outputDirectory": "<absolute-new-private-run-directory>",
  "model": "<slug-from-agy-models>",
  "timeoutMs": 120000,
  "printTimeoutSeconds": 90,
  "shutdownGraceMs": 5000,
  "acknowledgeUnisolatedTools": true,
  "addWorkspace": false,
  "allowedFileCalls": []
}
```

The acknowledgment records a limitation already accepted during preflight; setting it does not grant authority. `shutdownGraceMs` defaults to 5 seconds and must be 100 through 30,000 milliseconds. It bounds waiting after root exit, cancellation, or a failed/hung `taskkill`; it is not proof that descendants have stopped. Empty `allowedFileCalls` means stop when any tool call is observed. It cannot prevent that call from starting. For an authorized file read, set `addWorkspace: true` and add an entry with `tool: "view_file"` and the exact absolute `path`. The only other supported monitored tool is `write_to_file`, using the same exact-path structure, and it requires prior write authorization. Without allowedCommandCall, no shell commands are allowed. Browser operations and native subagents remain unsupported.

The adapter also recognizes the `read_file` alias for an approved `view_file` path. Its parameters may contain `Path` and optional positive safe-integer `StartLine` and `EndLine` bounds, or `Path` and a nonnegative safe-integer `ByteOffset`. It rejects combined line and byte addressing, unknown fields and unapproved paths.

```powershell
node '<skill-dir>/scripts/run-windows.mjs' '<absolute-spec.json>'
```

Launch that command through a host process tool that returns control and retains a cancellable session. Read `status.json`, `stdout.ndjson`, and `stderr.txt` under the assigned output directory while it runs. They can contain private input or output; keep them out of public repositories. A 30-second heartbeat reports elapsed time even when the model is silent.

The adapter uses forced Windows termination on interruption, failure, or deadline; it does not pretend Node SIGINT is a graceful console Ctrl+C on Windows. After root exit it never calls `taskkill` using a potentially reused PID. If taskkill fails or cancellation exceeds its grace, the runner reports cleanup unverified and exits incomplete. Native file descriptors avoid the earlier inherited-pipe wait. After every exit, verify the owned process and descendants are gone through the host's native process inspection. Match executable and creation time as well as PID: Windows can reuse a PID immediately. `cleanupCheckRequired: true` remains explicit because root exit alone cannot prove descendant cleanup. Preserve the taskkill output and investigate a failed termination command. A child may finish before taskkill reaches it; prove that exit independently. Never terminate unrelated existing sessions.

An exit-zero adapter result means its parsed evidence is ready for independent verification. Check the requested artifact or answer, actual tool targets, and cleanup before completion. The adapter deliberately converts denied actions, tool errors, suspicious timeout diagnostics, malformed events, missing output, wrong model/CWD/mode, and unexpected tools into a failed run. It never retries, changes configuration, exposes credentials, or enables bypass.

The script supports one turn, the model filter above, exact file calls and one optional immutable launcher call. Resume, models outside that filter, alternative providers, selected skills, large event payloads, POSIX cancellation, and strictly isolated workloads require a different verified adapter under the same skill contract. The one-megacharacter pending-event limit is a capture guard, not a model context or output-token limit; exceeding it preserves raw bytes and fails the run.

The native process deadline is timeoutMs, followed by shutdownGraceMs for cancellation. The outer host must also bound the complete adapter process, including filesystem capture and final reporting, and investigate any cleanup-unverified result. Root close does not prove all descendants stopped.

The optional transport field accepts only cli (default). Unsupported fields, API transport and non-boolean addWorkspace are rejected before launch. Missing executables fail before output-directory creation. This adapter rejects arbitrary shell and native subagent calls; one immutable launcher is available through the contract below.

Preflight failures emit one JSON event with event=preflight_failed, status=blocked, processStarted=false and authentication=unknown, then exit 1. They do not create a run status file or launch a provider process. Consume this event as a setup failure, not a provider authentication failure.


## One immutable launcher

The optional allowedCommandCall object contains commandLine, expectedCwd, launcherPath, launcherExecutable, expectedLauncherSha256, and maxLaunches:1. Both paths must be absolute no-redirect regular files, the executable a native .exe and launcher a .mjs. commandLine must be exactly the PowerShell form `& "<native-executable>" "<launcher.mjs>"`, using forward slashes and no arguments. Quotes, dollar signs, backticks and control characters in these two paths are rejected. expectedCwd must equal the run cwd. The launcher hash is checked before launch and at each observed command step. Protect its dependencies and the launcher from parent edits; a hash is not an atomic filesystem sandbox.

Review the launcher before requesting any needed exact command permission. It must choose its own absolute child workspace, check it for redirects and pass it to every child spawn, regardless of inherited scratch cwd. Embed the fixed worker specification and import a protected copy of run-process.mjs for bounded file-backed capture. Do not accept command-line arguments or derive commands from model output. Keep its deadline below the outer adapter deadline, including shutdown grace. Inspect each child terminal result and artifact before reporting success.

Tell the parent to call run_command once with that exact CommandLine and WaitMsBeforeAsync=5000. Current 1.2.3 streams may expose only CommandLine, so absence of Cwd or WaitMsBeforeAsync in emitted parameters does not establish what the tool received. If emitted, Cwd must match and the wait must be 5000. The adapter requires one ACTIVE then DONE step. A synthetic ten-second helper and a real three-worker launcher completed without a separate command_status call; polling and other background tools remain rejected. A different CLI behavior is a capability failure, not permission to guess a polling schema.

The adapter now uses run-process.mjs and a saved structured stdin file. Native stdout/stderr use regular file descriptors and are read live every 100 ms, then parsed and retained in stdout.ndjson and stderr.txt. Native process logs are also retained under process/. This avoids the observed restricted-token pipe EPERM; it does not grant account-state writes or network access. Inspect status.json and independently verify child results and cleanup.
