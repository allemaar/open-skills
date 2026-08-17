---
name: synthesize-init
description: >-
  Opt-in installer that sets /synthesize as the standing output default in an
  agent's directive files (CLAUDE.md, AGENTS.md, or equivalent), telling each
  future session to load it before its first nontrivial reply — a standing
  instruction, not deterministic enforcement; the live skill's best-effort
  boundary for later turns stays as it is. Shows the exact per-file diff first,
  backs the file up, writes between managed markers, and reports how to undo.
  Trigger phrases: "/synthesize-init", "make synthesize my default", "wire
  synthesize into my directives", "inject synthesize", "synthesize on every
  session".
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
    why: "The skill this installer wires in — use it directly for the current output without touching any directive file."
---

# /synthesize-init

You are about to edit someone's standing directives — the file every one of their future sessions reads. Nothing here happens silently, nothing happens without the exact bytes being shown first, and everything is reversible by design.

## The one law over everything

**Consent is per-file, per-operation, and byte-exact.** Before any write, the user sees: every target file, the operation for each (INSERT, UPDATE, or REMOVE), and the exact before/after diff per file. One explicit yes may cover several files ONLY when that whole list was shown; a changed list or changed bytes consumes the approval and requires a fresh one. No approval, no write.

## The procedure — every time, in this order

1. **Verify /synthesize PER PLATFORM.** For each runtime whose directive file may be targeted, verify the `synthesize` skill is resolvable for THAT platform: its skills directory (`~/.claude/skills/synthesize/` for CLAUDE.md, `~/.codex/skills/synthesize/`, `~/.agents/skills/synthesize/`), OR any other verifiable install route that platform supports (plugin, marketplace, roster) — a verified resolution counts wherever it lives. A roster entry in the current runtime proves nothing about the others. Exclude a platform only when you cannot verify the skill there at all, name the exclusion and why, and give the install route (`node install.mjs synthesize`, or the user's skill manager). All platforms unverifiable → stop after saying so.
2. **Detect targets, then ASK.** Candidate directive files, checked for existence, never created: `~/.claude/CLAUDE.md` · `~/.codex/AGENTS.md` · `~/.agents/AGENTS.md` · the current project's `CLAUDE.md`/`AGENTS.md` when the user says "this project only". List what exists (minus step-1 exclusions) and ask which to touch. No file found → say so and stop. A project-scoped ask touches only the project file.
3. **Classify managed state FIRST, then check for an unmanaged equivalent — fail closed.** Count marker lines, ignoring any marker inside a fenced code block (```…```) — fenced markers are documentation, not managed state — and counting only lines that contain the exact marker text and nothing else. Exactly `1` begin and `1` end, begin before end, nothing nested → this file is MANAGED: UPDATE or REMOVE is available (a managed block is never re-judged as a "duplicate"). `0` begin and `0` end → NOW scan the whole file for an UNMANAGED semantic equivalent — a standing rule that names `/synthesize` and directs sessions to load and follow it for substantive output. Found → NO-OP: say what is there, change nothing. Not found (a bare name mention or partial rule is not an equivalent — name it and continue) → INSERT is available. ANY other marker state (lone begin, lone end, reversed, duplicates, nesting, a line mixing a marker with other content) → STOP for that file and report malformed managed state; never append, replace, or delete around a malformed block.
4. **Show the exact change, hash what was shown, get the yes.** Per file: the operation, and the exact diff — for INSERT the block below and where it lands (end of file); for UPDATE the current managed bytes AND the proposed bytes; for REMOVE the exact block being deleted. Hash the file's CURRENT bytes at this moment — the approval binds to THAT hash and those exact shown bytes, nothing else. Then the one explicit yes over the whole named list. The block is self-contained — it references only the installed skill, never external paths, vaults, or URLs.
5. **Write safely, per approved file, in this exact order:** (a) re-check that the file and every parent directory is not a symlink or junction — a link anywhere in the chain stops that file with a report of where it points; (b) hash the current bytes and REQUIRE equality with the step-4 approved hash — any difference means the file changed after approval: stop, show the new diff, get a fresh yes; (c) create the backup at `<file>.YYYY-MM-DD.bak` with exclusive creation — if that name exists, try `-2`, `-3`, … until creation succeeds; NEVER overwrite an existing backup — and populate it from the APPROVED bytes, verifying the backup's hash equals the approved hash; (d) build the complete replacement bytes in staging, derived from the approved bytes; (e) re-hash the source one final time — still the approved hash, or stop; (f) replace atomically (write temp in the same directory, then rename over); (g) reopen and verify the final bytes match staging. If a later file in the list fails, earlier completed files STAY completed — report the exact mixed state, file by file.
6. **Report.** One short receipt: per file — operation, bak path, verified. Plus the undo line: "delete the marker block, or restore the .bak".

## The injected block — verbatim, between these exact markers

```markdown
<!-- synthesize-init:begin -->
### Output governance — /synthesize owns the report layer

Structure every substantive reply a person will read with the installed `/synthesize` skill: route by what the reader will DO with the output, bottom line first with the confidence inside it, the protected set preserved (negations, numbers, attribution with stance, reversing conditions, coupled units), rendered per the skill's grammar. Load `/synthesize` before the first nontrivial output of a session — this is a standing instruction to each session, not runtime enforcement. A simple answer stays plain prose — the skill's no-op is a legal result; never give a short answer report ceremony. Three obligations hold at full force: label every material claim's truth state (confirmed / inferred / estimated / unknown) and name what was NOT checked whenever it could change the decision — restructuring never upgrades truth status; update ongoing work at start, material transition, blown ETA, blocker, and completion — between updates report only material change; close every decision-bearing report with the ordered next action, its gate where one exists, and the condition that would change the recommendation. If `/synthesize` is missing, fall back to its two portable laws: fidelity is the floor, and the bottom line leads.
<!-- synthesize-init:end -->
```

Never edit the user's other directives, never reorder their file, never write anywhere but the managed block. The block's wording is owned by THIS skill's version — a wording change ships as a new skill version, and reaches existing installs through the UPDATE path.

## Refusals and edges

- **A directive file that already mandates /synthesize** — handled INSIDE the procedure (step 3, first action), not as an afterthought: a genuine semantic equivalent means no-op; a bare mention means INSERT proceeds with the mention named to the user.
- **Removal** — `/synthesize-init` with "remove" runs the same steps 2-6 with operation REMOVE: same target ask, same malformed-state stop, same exact-diff consent, same backup and atomic write. The skill uninstalls its own footprint; nothing else.
- **"Just do it everywhere"** — still show every file, operation, and diff once; the single yes covers exactly that shown list.

## Boundaries with siblings

`/synthesize` owns the output contract itself; this skill only wires it into standing directives, and only on request. It never runs as part of `/synthesize`, never fires proactively, and never edits any file outside the approved target list.
