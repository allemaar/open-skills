---
name: synthesize-init
description: >-
  Opt-in installer for a minimal standing /synthesize route in existing agent
  directive files. Shows exact per-file diffs, requires approval, backs up,
  writes atomically, verifies, and supports removal.
disable-model-invocation: true
visibility: public
triggers:
  - "/synthesize-init"
  - "make synthesize my default"
  - "wire synthesize into my directives"
  - "inject synthesize"
  - "synthesize on every session"
next-skills:
  - skill: synthesize
    phrase: "/synthesize"
    why: "Use the output contract now without changing directives."
---

# /synthesize-init

Install, update, or remove one managed route. Never create a directive file.

## Consent

Approval is per target, operation, and exact bytes. Before writing, show the
target, `INSTALL`, `UPDATE`, or `REMOVE`, and the exact diff. Record the current
byte hash and the proposed replacement byte hash. Approval binds to all four:
target, operation, current bytes/hash, and replacement bytes/hash. One approval
may cover the displayed set. Any change to that set requires new approval.

## Discover and classify

1. **Resolve each runtime.** For every possible target, verify `synthesize` is
   installed or otherwise resolvable by that runtime. A roster in one runtime
   proves nothing about another. Exclude unresolved runtimes and state why. If
   none resolve, stop with the relevant installation route.
2. **Discover targets.** Consider only existing standing directive files that
   the runtime documents or the user names. A project-scoped request excludes
   global files. List eligible files and ask which to touch. No eligible file
   means stop.
3. **Classify exact current bytes.** Ignore markers inside fenced code. Marker
   lines must contain only the exact marker.
   - `MANAGED`: exactly one begin marker and one later end marker, with no
     nesting. The bytes between them may be current or stale.
   - `COMPATIBLE`: no markers and a semantic equivalent that requires
     substantive output to load and follow `/synthesize`, keeps simple answers
     plain, and on a missing skill preserves meaning, leads with the bottom
     line, and states material uncertainty.
   - `PARTIAL`: no markers and a narrower, non-conflicting rule that provides
     only part of that behavior. Name the missing behavior.
   - `UNMANAGED`: no markers and no related rule.
   - `CONFLICT`: no markers and a rule whose required behavior conflicts with
     the managed block. Name the conflict; do not hide it as a partial rule.
   - `MALFORMED`: any other marker state, including duplicates, reversal, or
     nesting.

## Operation matrix

| Current state | `INSTALL` | `UPDATE` | `REMOVE` |
|---|---|---|---|
| `MANAGED` | no-op if current; otherwise replace only the managed block | replace only the managed block | remove only the managed block |
| `COMPATIBLE` | no-op | no-op | no-op |
| `PARTIAL` | append the managed block after naming the retained partial rule | stop: not managed | no-op |
| `UNMANAGED` | append the managed block | stop: not managed | no-op |
| `CONFLICT` | stop | stop | stop |
| `MALFORMED` | stop | stop | stop |

An install or update is valid only in the states allowed above. Removal is a
mutation only for `MANAGED`; removal from an unmanaged, partial, or compatible
file is an explicit no-op. Never delete text merely because it resembles the
route.

## Safe replacement

For every mutating matrix cell:

1. Build the complete replacement bytes and show the exact diff. Bind approval
   as described above.
2. Immediately before writing, inspect the target and every parent component
   without following links. Stop on a symlink, junction, mount, or equivalent
   redirect. Require the current bytes and hash to equal the approved preimage.
3. Create a uniquely named backup with exclusive create semantics; never reuse
   or overwrite a path. Copy the approved preimage and verify its byte hash.
4. In the target directory, create a uniquely named staging file with exclusive
   create semantics. Write the full replacement, flush it, reopen it, and
   verify its byte hash equals the approved replacement hash.
5. Recheck target and parent metadata plus the target preimage. Use only a
   documented same-filesystem primitive that atomically replaces the target
   with the verified staging file. If the runtime or filesystem cannot provide
   that guarantee, stop before replacement.
6. Reopen the target and require exact replacement bytes and hash. Report the
   operation, backup, staging disposition, and verification.

On failure, preserve backups. Remove only a staging file created exclusively by
this invocation, and only after its identity and expected bytes are rechecked;
never clean another process's artifact. Earlier successful files remain as
written. Report every target as changed, unchanged, or failed so mixed state is
explicit.

Removing the managed block through this same procedure is the normal undo.
Restoring an entire backup is a separate replacement: first compare backup,
current, and proposed bytes, show the exact diff and hashes, and obtain fresh
approval. A restore never overwrites edits made after the backup silently.

## Managed block

Insert this verbatim:

```markdown
<!-- synthesize-init:begin -->
Before composing substantive reader-facing output, load and follow `/synthesize`. Simple answers remain plain. If unavailable, preserve meaning, lead with the bottom line, and state material uncertainty.
<!-- synthesize-init:end -->
```

Only approved managed-block bytes may change inside the directive file. Named
backup and same-directory staging artifacts are permitted solely for safe
replacement. Do not reorder or edit other directive content.

This skill installs routing only. It does not run proactively or enforce that
future agents obey the route.
