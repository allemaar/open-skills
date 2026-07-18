# Changelog — open-skills

All notable changes to this skill pack will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

**SemVer for a skill pack.** **MAJOR** = a skill removed or renamed, or a breaking
trigger/interface change. **MINOR** = a new skill or skill family. **PATCH** = fixes, docs,
or guard changes that neither add nor remove a skill.

---

## [1.3.0] — 2026-07-19

### Added

- **A `human-*` family: the contract for output a person actually reads.** Four Markdown-only skills. `human-output` is the contract itself — five policeable rules (verdict first, including anything that would reverse it; say what it costs, not what it is; label every claim confirmed/judgement/estimate; say what you did not check; no shorthand the reader must decode) over a craft layer of defaults, on the principle that a contract with twenty rules is a contract with none. `human-rewrite` is the repair pass on text that already exists, narrowed to what only exists because there is a source: fidelity guarantees, foreign-input handling, inventory-then-reconcile. `human-draw` decides whether the material wants a picture and builds it, defaulting to DRAW and downgrading to a simpler shape rather than refusing — a refusal hands a text-fatigued reader back the wall of text that caused the problem. Figures are printable ASCII only (`0x20–0x7E`): box-drawing and block glyphs are East Asian *Ambiguous* and render double-width under some locales, shearing every column below. `human-merge` owns the pass across *many* reports, which is the case the other three each refuse: it collapses reports sharing an upstream source into the single source they are, names what is superseded and whether a live decision rests on the dead figure, classifies conflicts instead of averaging them away, and pools coverage so a gap no single report had becomes visible. `human-rewrite` reads nothing beyond the one text it was handed, so the pile now routes here rather than being merged by reflex.

- **`tools/human-output-check.mjs`** — the mechanical half of the contract, since a rule with no gate drifts silently while everything else stays green. Checks acronym expansion at first use, one marked recommendation, sentence length, ASCII inside fences, and figure arithmetic. Rules 1, 3 and 4 are judgement and the file says so rather than pretending to grade them. Self-tests with `--self-test`.

- **The eight loudest skills now cite the contract** rather than restating it, each gaining a `human-*` next-skills edge: `insight-retro`, `cold-review`, `insight-cross-examine`, `plan-create`, `improve-codebase-architecture`, `investigate`, `extract-signal`, and `insight-adversarial` — each chosen for a long or decision-bearing mandated report template.

### Fixed

- **The `orient-*` skills printed a YON record at a human, and the rule that caused it is now gated.** All four carried an unconditional `MUST emit a record conformant to orient-record.yon` two lines above a *consumer-conditional* visual rule. Facing one unconditional MUST and one conditional one, an emitter obeys the unconditional one — so the machine face reached the person, contradicting `orient-contract.md` §1 ("No raw record fields or node-ids surfaced to the human") and `family-behaviors.md` §6. The MUST is now conditioned on `handler_type = agent`, a companion MUST NOT forbids any record field, node-id, gate enum, `@CFG` or `@MAP` line in a human reply, and the "Record emission" headings and step 6 emission instructions name the consumer explicitly. Mirrored into each `protocol.yon` (`rule:render-face`, `step:emit`). Nothing about the record, the schema, or the widget kit changed — only who receives which face.

### Changed

- **The four `orient-*` descriptions lead with the question they answer**, and each `SKILL.md` opens with a four-line card stating what it answers, what it does not (naming the sibling that does), and what it owns for the family. Sections 2–8 were near-identical boilerplate across the four, so the ~10% that differed was buried behind a shared preamble and a reader comparing two files saw the same document twice.

- Pack grows to **55 skills / 37 with a `protocol.yon`** (18 Markdown-only).

---

## [1.2.1] — 2026-07-18

### Changed

- **Every `gate-fires` rejection is now proven by its message, not just a non-zero exit.** The `mustSay` assertion — added so a crash (a missing fixture, a broken import) cannot score as "the gate fired" while grading nothing — covered only the three newest guards. The eight older reject scenarios (the YON parser, `yon-dag`'s two dataflow checks, and the orient and diff-recap value gates) judged on exit code alone, so a file-not-found would have passed as a rejection. Each now pins the guard's actual rejection wording, captured by running it. Verified by tampering: pointing a scenario at a missing fixture now reports `PROOF BROKEN`.

- **Cold-review cleanup: the last private-skill references the scrub missed, and three guards tightened to match their prose.** A multi-POV review found references the earlier commits did not reach — `skills-help`'s Boundary line pointed at `/paper-help` (below the menu guard's window) and `new-skill-creator`'s `CRITERION.md` still listed `allemaar-deploy`, `new-content-topic`, and `hfl` as examples — both now use skills that ship. The DCO guard no longer rejects a valid sign-off whose email host has no dot (git's own default `user@hostname`); the menu-roster guard now catches a marker-less phantom entry, not only marked ones; and `tools/lint.mjs`'s header now documents its bare-name and anchored-ref limits alongside GAP 3. A stale `## [Unreleased]` line that a later commit had already falsified was removed.

- **The `skills-help` menu lists the skills this pack actually ships, and a guard keeps it that way.** Exported from a larger private library, the public menu advertised ~18 skills a reader could never have — the whole `paper-*`, `hfl*`, and `yas-*` families, plus `new-content-topic` and `allemaar-deploy` — while omitting six that do ship (`budget-check`, `diff-recap`, and the four `orient-*`). The snapshot is now curated to the 51 public skills, and `tools/consistency-guard.mjs` fails the build if the menu ever again names a skill with no directory — a gate-fires scenario proves it rejects a phantom entry and accepts the real menu. The reverse case, a shipped skill not yet in the menu, stays with the skill's own render-time self-heal by design.

- **`tools/lint.mjs` now sees the reference class it was built to catch.** It was written after a review found ~16 references to files that don't exist here, yet two blind spots let exactly that class through: it never scanned the companion markdown under `skills/*/` (`references/`, `personas/`, `profiles/`, `examples/` — only each skill's `SKILL.md` and the 5 root docs), and its path check resolved only `tools/`- and `skills/`-shaped tokens, so a `docs/…` leftover was skipped. Both are closed: companions are scanned (tracked files, via `git ls-files`), and the check resolves repo-root dirs (including `docs/`, whose absence *is* the defect) and the pack's own `skill-name/SKILL.md` shorthand — targeted, not "any slash is a path", which floods on npm scopes and URLs. A gate-fires scenario proves it rejects a broken `docs/` ref and accepts a clean one. Known limit, documented in the header: a path inside a backticked shell command is still skipped.

- **The COP register and three skills stop citing skills the public pack does not ship.** The export dropped private files and skills but kept the pointers, so `caller-options`'s register cited `docs/nsp-cop-audit.md` and `MAYBE.md` — including a `MUST` to agree with a file no reader can open — and four skills named `skills-audit`, `paper-check`, and the old `yon-writer` (renamed to `yon-write` and never swept). The register now resolves a disagreement by the self-orchestrator exclusion test alone, which is self-contained; the dangling citations became plain statements of the verdict they cited; the renamed skill is corrected everywhere; the two absent skills are dropped from the boundary map and criterion examples. The substance — the exclusion test, the verdicts, the rename sweep — is unchanged.

- **README leads with the install, and the read-first path is labelled as the default.** Install now follows the pitch directly; the two-files-per-skill philosophy moved below it, after first value. The choice is stated as two paths — clone-and-copy (the default) and the plugin marketplace — each with its trade named once, rather than the page arguing the reader out of the faster one; the remaining fetchers moved into a subordinate *Other ways to fetch*, and the Vercel CLI's mode-selection behaviour is restated as the one composite condition [`DISTRIBUTION.md`](DISTRIBUTION.md) sources it to. *Start here* gains starter prompts you can type.
- **`install.mjs` no longer prints `Done` above a validation failure.** The failure is reported first: a run that copied something nobody could validate is not a success, and the word "Done" above it read as reassurance. The close message now says copies stay frozen until you re-copy them, and points at *README > Updating* for the diff command that makes a re-copy something you read first.

- **`new-skill-creator` says which side of the trust line it is on.** It shipped a `MUST` telling agents to symlink skills into all three runtimes — sound advice for an author, and the exact topology [`README.md`](README.md) and [`THREAT-MODEL.md`](THREAT-MODEL.md) argue against for anyone *installing* this pack. Nothing marked which case it was, so a public skill read as a hard rule contradicting the rest of the repo. It is now scoped, in the description, the body, the rules and `protocol.yon`, to what it always was: a maintainer's loop over a skills repo you own. The drift a link carries is not absent there, only accepted on README's terms. Installing skills you did not write is still a copy.

- **`new-skill-creator`'s rename checklist pointed at tooling this repo does not ship.** [`references/RENAME-CHECKLIST.md`](skills/new-skill-creator/references/RENAME-CHECKLIST.md) told you to run `python tools/lint_skills.py --check-symlinks`, and to sweep `VISIBILITY.md` and `docs/` — all three are the private library's, carried over on export and never re-pointed. The lint is `node tools/lint.mjs`, it takes no flags, and it does not check symlinks: nothing shipped here does, so the checklist now says the snapshot diff is what verifies them rather than naming a command that cannot run.

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

[1.3.0]: https://github.com/allemaar/open-skills/releases/tag/v1.3.0
[1.2.1]: https://github.com/allemaar/open-skills/releases/tag/v1.2.1
[1.2.0]: https://github.com/allemaar/open-skills/releases/tag/v1.2.0
[1.1.0]: https://github.com/allemaar/open-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/allemaar/open-skills/releases/tag/v1.0.0
