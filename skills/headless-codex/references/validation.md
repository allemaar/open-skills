# Current local validation

Observed on 2026-09-15 with Codex CLI `0.154.0-alpha.6.2`, ChatGPT authentication, `gpt-5.6-terra`, low reasoning, and an ephemeral private Git fixture on Windows.

## Literal execution

A read-only literal prompt returned the requested exact text and its owned process exited with code zero. The JSONL event stream also contained an `item` error stating that skill descriptions were shortened to fit the skills context budget. A per-run `-c skills.max_context_tokens=10000` override did not remove it. Inspection of the exact diagnostic corrected the earlier classification: it explicitly says every skill remains visible, so this precise advisory is retained as a warning, not a blocking task error. The literal smoke passed with that warning. Other errors and lost required context remain blocking.

## Fixture write execution

A workspace-write prompt was authorized only to copy a marker from `input.txt` to `output.txt`. The agent returned `write-complete` and the root process exited with code zero, but `output.txt` was absent. Its stderr recorded a rejected `exec_command` that attempted to read an installed directive-operations skill entrypoint outside the fixture.

This is a local inherited-directive conflict: the agent attempted to load an inherited directive located outside the workspace, and the policy router rejected that command. It does not establish that `--ignore-user-config` caused the denial, and it does not establish a universal Codex behavior across hosts, configurations, or policy profiles.

## Inline profile and nested-spawn observation

On the same native CLI, a private fixture read/write passed after an inline profile defined direct `read` entries for the canonical directive roots. The table used forward-slash Windows paths, `default_permissions`, and `:workspace`; prerequisite roots were not added as writable workspace roots. The resulting command events showed directive reads and the 33-byte authorized fixture copy. This does not prove the profile enforced that access: inherited configuration included `sandbox_mode="danger-full-access"` and Windows `unelevated` sandboxing, so the effective policy interaction was not observable. An otherwise similar run with `--ignore-user-config` denied prerequisite reads; that is an observed interaction, not a proven cause.

A later nested compatibility launcher ran after the directive reads passed, but each child provider `--version` process failed with `spawn EPERM` for Codex, Claude, and agy. The launcher therefore did not pass and does not establish a grant remedy for nested executables. Preserve the exact error and run such provider children under a capable outer supervisor rather than weakening policy, sandbox, or rules.

## Acceptance rule

An exact final answer and exit code zero are insufficient for a write task. Require a clean terminal event stream, no denied tool action, and direct verification that the authorized artifact exists and has the requested content. Retain the process record plus stdout and stderr for each run.


## Repaired compatibility routes, 2026-09-15

A no-inference restricted-token discriminator held the profile and executable paths fixed: Node pipe stdio caused EPERM for every provider, while inherited/file-backed descriptors allowed all three native version checks. The bundled run-process runner removes that capture failure. Real nested inference then exposed separate host limits: Codex could not write its runtime state or start its in-process app-server, and other CLIs lacked runtime storage/network access. A new login or a permission-profile claim would not repair these facts.

The fixed outer dispatcher resolved that topology: a sandboxed Terra-low Codex parent atomically published one reviewed task ID; the already authorized outer host launched Codex Terra low, Claude Haiku and Antigravity Flash low. All returned exact no-tool markers and the parent returned PARENT_COMPAT_OK. The original private wrapper looked for results under the request directory and exited nonzero; direct inspection found the dispatcher result and all three worker outputs in the designated worker directory. This was a reporting-path mistake, not an inference failure. No model retry was needed. The shipped dispatcher is a one-task mechanism; it accepts no dynamic command from the parent.
