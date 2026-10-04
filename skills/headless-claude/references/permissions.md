# Claude Code scoped file permissions

Claude Code separates tool availability from permission. `--tools Read,Write` exposes only
those built-in file tools; under `--permission-mode dontAsk`, `--allowedTools` must approve
each write.

For one exact file write, use an `Edit(...)` permission rule even though the model invokes the
`Write` tool. Claude Code documents that `Edit` rules apply to all built-in editing tools. Do
not use `Write(...)` as a scoped rule.

On Windows, Claude normalizes `D:\\path\\file` to `/d/path/file`; an absolute rule therefore
uses a double slash:

```text
--tools Read,Write
--allowedTools "Read(//d/work/fixture/input.txt),Edit(//d/work/fixture/output.txt)"
--permission-mode dontAsk --permission-prompts none
```

The paths must be the exact approved files. Do not replace them with a bare tool grant, a
directory wildcard, `acceptEdits`, or a bypass mode. Keep `--restricted --strict-mcp-config`
and verify the final stream has no permission denial.

Source: [Claude Code permissions](https://code.claude.com/docs/en/permissions), “Read and
Edit” and its Windows path-normalization section. Checked 2026-09-15.
