# Direct reader

Requires Windows and Node.js 22 or later. Resolve actual native executables from installed tools; do not pass a PowerShell shim, command string or guessed versioned path. No executable is downloaded. Keep the spec, report and raw logs outside public repositories because raw provider replies may contain account identifiers.

Example spec (replace every path with verified local paths):

```json
{
  "outputDirectory": "C:/private/usage/unique-run",
  "providers": ["codex", "agy", "claude"],
  "executables": {
    "codex": "C:/tools/codex.exe",
    "agy": "C:/tools/agy.exe"
  },
  "timeoutMs": 30000,
  "history": false
}
```

The output directory must not exist; its parent must exist and paths must not traverse links. Each provider receives its own directory. Calls run independently. CLI version/help and query processes have finite deadlines and cleanup grace. The parent must retain its task handle, observe completion and report unverified cleanup, never dispatch and forget.

The optional `transport` field accepts only `cli`, the default. Unknown spec fields and API transport are rejected before any query or output-directory creation. Missing or invalid executable paths affect only their provider. API support must be implemented separately; an API key or CLI login never triggers an implicit fallback.

Invoke `node <skill-directory>/scripts/usage.mjs <absolute-spec-path>`. Standard output and `report.json` contain the normalized report; raw stdout/stderr stay in provider directories. Exit 0 means all requested providers returned live data, 2 means partial live data, and 1 means none returned live data or the spec was invalid. Claude is intentionally unavailable in this direct reader; the skill can supplement it with a separately dated terminal observation.

The report has `schemaVersion`, `checkedAt`, `completedAt` and `results`. Each provider result has source, status, runtimeVersion, observedAt, windows, errors and process evidence. Each window contains bucket, windowMins, usedPercent, remainingPercent, resetsAt (UTC ISO) and resetInSeconds. Unknown fields remain null or absent. Do not infer an unreturned window. Optional activity is provider-reported usage history, not billing or quota arithmetic.

For an automated caller with no terminal control, this report is the complete supported result, including Claude's explicit access gap. Do not hide a partial exit or present cached/manual values as script-generated live results.

If writing report.json fails after provider reads, stdout still retains their normalized results plus a top-level report-file error; exit 1 signals that persistence failed. Do not discard those partial readings or claim the report file was saved.
