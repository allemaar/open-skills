<!-- headless-family:projection -->
# Fixed outer dispatcher

`scripts/dispatch-fixed.mjs` is a Windows outer-process broker for one pre-authorized fixed task. It receives an absolute fixed spec with only `requestFile`, `requestId`, `resultFile`, `task` (a fixed `runProcess` spec), and `timeoutMs`. The dispatcher loads that task before the restricted parent starts. It never derives executable, arguments, model, sandbox, credentials, or provider behavior from the request.

The request and result files must be initially absent. The dispatcher polls the request every 100 ms and accepts exactly one JSON object at most 1 KB containing only the matching `requestId`. It validates no-follow chains for the spec, request, result, status, task output, and their existing parents. The task output directory must be new, with an existing validated parent.

Waiting, task timeout, and task shutdown grace share one dispatcher deadline. The task cannot start unless its timeout plus grace fit the remaining budget. The dispatcher retains `resultFile.status.json` with a 30-second heartbeat and writes the response both to the fixed result file and its own stdout. A response reports supervision only, never provider task acceptance; the parent independently verifies terminal protocol, output, scope, and descendants.

SIGINT and SIGTERM call the exported `runProcess` scoped stop callback when a task is active. Every result has `cleanupCheckRequired: true`. The caller owns outer-process monitoring and final descendant verification.

This is not a general-purpose broker, arbitrary command executor, API fallback, sandbox escape, or credential-copy mechanism. It cannot broaden configuration or permissions. Use it only for an already reviewed fixed worker task with immutable executable, arguments, paths, timeout, and write boundary.


## Prepare and invoke

1. The authorized outer host reviews the provider task, exact executable and arguments, model/effort, child write scope, result checks and deadline. Put the fixed spec and any launcher/dependencies outside the restricted parent writable scope. CLI-owned login/state/network access belongs to this host; do not copy credentials into the parent.
2. Choose a private request/result directory writable by the parent and readable by the dispatcher. Choose a separate new task-log directory. Prepare the spec shown below with real absolute paths. Start the dispatcher in the outer host through a retained, cancellable process tool before starting the restricted parent. If the only available shell is already restricted, a capable outer host or user terminal must perform this setup; the skill cannot manufacture one.
3. The parent atomically publishes only the exact requestId, using a temporary sibling and rename. No arguments or task body belong in this request. The dispatcher accepts it once; extra fields, wrong IDs and oversized requests fail.
4. The parent waits within its own deadline for resultFile. Check taskResult errors, timeout, process exit and cleanup state, then the provider terminal events and requested output. The outer host independently checks its own retained logs and descendants; the parent-writable response file alone is not authoritative proof.

```json
{
  "requestFile": "D:/reviewed/request/request.json",
  "requestId": "approved-task-1",
  "resultFile": "D:/reviewed/request/result.json",
  "timeoutMs": 180000,
  "task": {
    "executable": "C:/reviewed/provider.exe",
    "args": ["<reviewed-provider-arguments>"],
    "cwd": "D:/reviewed/workspace",
    "outputDirectory": "D:/reviewed/logs/new-run",
    "timeoutMs": 120000,
    "shutdownGraceMs": 5000
  }
}
```

Run `node <skill-dir>/scripts/dispatch-fixed.mjs <absolute-fixed-spec.json>` in the authorized outer host. The parent publishes `{"requestId":"approved-task-1"}`. Use task-specific deadlines with sufficient request/startup allowance; if the remaining budget cannot contain the complete task and grace, the dispatcher refuses to start. There is no daemon, queue of arbitrary commands, implicit installation or standing permission grant.
