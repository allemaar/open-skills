# Changelog — open-skills

All notable changes to this skill pack will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

**SemVer for a skill pack.** **MAJOR** = a skill removed or renamed, or a breaking
trigger/interface change. **MINOR** = a new skill or skill family. **PATCH** = fixes, docs,
or guard changes that neither add nor remove a skill.

---

## [Unreleased]

### Changed

- **README leads with the install, and the read-first path is labelled as the default.** Install now follows the pitch directly; the two-files-per-skill philosophy moved below it, after first value. The choice is stated as two paths — clone-and-copy (the default) and the plugin marketplace — each with its trade named once, rather than the page arguing the reader out of the faster one; the remaining fetchers moved into a subordinate *Other ways to fetch*, and the Vercel CLI's mode-selection behaviour is restated as the one composite condition [`DISTRIBUTION.md`](DISTRIBUTION.md) sources it to. *Start here* gains starter prompts you can type.
- **`install.mjs` no longer prints `Done` above a validation failure.** The failure is reported first: a run that copied something nobody could validate is not a success, and the word "Done" above it read as reassurance. The close message now says copies stay frozen until you re-copy them, and points at *README > Updating* for the diff command that makes a re-copy something you read first.

- **`new-skill-creator` says which side of the trust line it is on.** It shipped a `MUST` telling agents to symlink skills into all three runtimes — sound advice for an author, and the exact topology [`README.md`](README.md) and [`THREAT-MODEL.md`](THREAT-MODEL.md) argue against for anyone *installing* this pack. Nothing marked which case it was, so a public skill read as a hard rule contradicting the rest of the repo. It is now scoped, in the description, the body, the rules and `protocol.yon`'s `@INTENT` and `@RULE`, to what it always was: a maintainer's loop over a skills repo you own, where the change a link carries is the one you just wrote. Installing skills you did not write is still a copy.

### Added

- **`tools/dco-guard.mjs` — the sign-off [`CONTRIBUTING.md`](CONTRIBUTING.md) already requires is now checked in CI.** The DCO was stated as a rule and run by nothing, so it drifted against our own history: 7 of the 29 non-merge commits between v1.1.0 and `075a7e5` carry no `Signed-off-by`. Checked, not prevented — `git commit -s` is still what stops an unsigned commit being written. It grades the trailer's shape, not that the name is real and not against the commit author: the DCO is a certification you make, not an identity we can authenticate. Trailers come from `git interpret-trailers`, not a scan of the message, so a commit that merely *quotes* a sign-off is rejected — that message is a fixture in [`GATE-FIRES.md`](GATE-FIRES.md). One layout still passes: a fenced sign-off that *is* the last paragraph, which git reads as a real trailer — a limit taken deliberately, and reasoned out in the guard. Forward-only from `075a7e5`: the 7 stay unsigned and uncertified, and no remediation commit has landed.

---

## [1.2.0] — 2026-07-17

### Added

- **Three new skills:**
  - **`budget-check`** — a fail-closed pre-wave usage gate. Wraps `ccusage blocks --json` into go / no-go / unknown against a 95% threshold, exiting 0/1/2 so a dispatch script can gate on it. It never emits a fabricated "go": a missing, non-numeric, or unreadable figure fails closed to `unknown`, and an inferred ceiling is labelled as what it is rather than passed off as a real budget.
  - **`diff-recap`** — turns a git diff into a PR-pasteable recap: one row per changed file, whose path, status, and line counts are transcribed verbatim from `git diff --numstat` (true by construction — the model writes only the labels), emitted as an inline annotated widget plus a mandatory ASCII twin. Ships `tools/diff-recap-check.mjs`, the value gate that holds the record to its arithmetic: the totals must equal the sum of the rows, and no row may hide.
  - **`orient-roadmap`** — the multi-horizon read, joining the `orient-` family over the same `orient-record` schema: the increment arc (built → current → next), what shipped, the gates, the next increment's clusters, and the runway of stage boxes, plus the deferred lanes.
- **Claude Code plugin marketplace** — `/plugin marketplace add allemaar/open-skills` then `/plugin install open-skills@open-skills` installs the pack and namespaces the skills (`/open-skills:cold-review`, …). Updates in place with `/plugin marketplace update open-skills`.
- **A visual face for the `orient-` family** — `orient-status`, `orient-map` and `orient-gaps` each render their record as an inline widget, with a **mandatory ASCII twin** so the read survives anywhere the widget doesn't, plus a family-wide "you are here" breadcrumb. The render face is a contract in `orient-spec/`, not per-skill decoration.
- **`install.mjs` now stamps provenance into the copy it makes.** The installed `SKILL.md` gains a `metadata:` block recording the repo, ref, and tree SHA it came from — the same keys `gh skill` writes, so `gh skill list` / `gh skill update --dry-run` work on copies this installer made (verified against gh v2.96.0). **This means the installed file is no longer byte-identical to the repo's.** When this clone can't honestly back the claim — no origin, detached HEAD, local edits, or unpushed commits — it records a plain `local-path` instead. `--no-stamp` copies byte-for-byte and records nothing.
- **[`DISTRIBUTION.md`](DISTRIBUTION.md)** — the distribution ledger: where the pack is published, a falsifiable traction gate with named thresholds for the held submissions, and an append-only measured-signals log. It also records the measurement cost it accepts: the read-first install paths are untelemetered by design, so the numbers undercount.
- **`insight-angles`** gains a Cartography/Representation lens family (17-family roster).
- Pack grows to **51 skills / 37 with a `protocol.yon`** (14 Markdown-only).

### Changed

- **`verify` and `cold-review` now re-check claims against source rather than trusting a report.** `verify` gained an active per-claim source re-check — an agent's self-report of having checked is not evidence, so the claim is re-derived from the artifact that actually ships (the committed blob, the built output, the served route), not the working tree. `cold-review` gained a self-verify pass over its own synthesis: evidence is re-opened, findings are posed as questions, and anything that doesn't survive a fresh read is dropped.
- **CI hardened** — `leak-guard` and `consistency-guard` join the workflow, alongside the orient **value gate** (`tools/orient-validate.mjs`), which enforces what the parser structurally cannot: enum membership, required fields, and the fail-closed cross-field gate, checked against the schema read live so the rules can't drift from it.
- **`handoff-execute`'s scope-expansion halt now fires less often.** `rule:no-scope-expansion` is a `MUST_NOT` that used to halt execution whenever it needed a source the brief did not list. It now halts only when the *agent itself* decides, on its own judgment, that it needs an unlisted source. A file the brief's own prose cites as an edit target, or a fact it names without saying where it lives, is read on demand and recorded in `@DELTA_FROM_BRIEF` rather than halted on.
- **`extract-signal`** is now model-invocable (it is read-only, so the invocation flag bought nothing).
- README leads with the plugin-marketplace install, states the "composable, not a framework" position, and surfaces the `orient-` family and its spec.

### Fixed

- **False and misleading statements on the install surface.** The runtime-dir table named the wrong runtimes for `~/.agents/skills` (Cursor, Copilot and OpenCode use their own dirs; Codex reads `.agents` as its current location, with `~/.codex/skills` still read for backward compatibility). The symlink recipe sold repo-tracking as a feature while warning only about deletes, never drift — and its POSIX `ln -s` line silently makes a *copy* under Git-Bash/MSYS. `install.mjs` copying into **every** runtime dir it finds was undocumented, as was `--runtime`. The Vercel CLI's symlink-by-default behaviour and its telemetry are now disclosed.
- **THREAT-MODEL step 5 had no procedure for the copy default** — the pack's own default. It prescribed reviewing a diff for symlinked skills, the one topology the same document rejects. It now gives the copy path a real command. The "Silent drift" bullet no longer frames symlinking as the norm.

---

## [1.1.0] — 2026-06-22

### Added

- **The `orient-` family** — orientation skills that compute a fresh, honest read of where work stands, over one shared, validatable confidence layer:
  - **`orient-status`** — quick "where are we": current position, what's left, and a banded ETA, computed fresh via a bounded read-only subagent. `--resume` rebuilds context after a gap (one next move + counter-case).
  - **`orient-map`** — delta-first "show me the shape": what changed since your last look, plus done → here → next as a path on the trunk or a **tree on a branch**.
  - **`orient-gaps`** — the stall surface: blockers, open forks, and loose ends; `--audit` adds the anti-Goodhart disclosure (signals inflated past their evidence).
  - **`orient-spec/`** — the shared `orient-record` schema (`schema_version = orient-record/1`) every orient- skill emits a slice of, plus `family-behaviors.md` (the shared footer + staleness short-circuit, neutral re-look signal, and handoff-feeder contract).
- Pack grows to **48 skills / 34 with a `protocol.yon`** (14 Markdown-only).

### Changed

- **CI hardened** — `tools/orient-roundtrip.mjs` is now wired into the conformance workflow (the orient-record worked example must survive a parse → format → parse round-trip on every push), joining the existing validation, lint, YON-DAG, spine-sync, and gate-fires checks.
- README "start here" + category list now surface the orientation skills; added this changelog.

## [1.0.0] — 2026-06-16

Initial public release of the **open-skills** pack — reusable skills for AI coding agents (Claude Code, Codex, and any runtime that reads the open Agent Skills format), each a readable `SKILL.md` plus a declarative, validatable `protocol.yon`. Ships:

- the dual-doc format (Markdown explains; YON makes rules and gates inspectable and enforceable);
- a zero-dependency `install.mjs` (copy-default, never symlink; validates each `protocol.yon` on install; refuses to delete through a junction);
- the machine catalog (`catalog.yon` / `catalog.json` / `llms.txt`) for agent and registry discovery;
- CI conformance — YON validation, a cross-reference/structural lint, a YON-DAG semantic check, spine-manifest sync, and a `gate-fires` proof that the guards actually reject broken input;
- Apache-2.0 license, NOTICE, THREAT-MODEL, CONTRIBUTING (DCO), and SECURITY policy.

[1.2.0]: https://github.com/allemaar/open-skills/releases/tag/v1.2.0
[1.1.0]: https://github.com/allemaar/open-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/allemaar/open-skills/releases/tag/v1.0.0
