# Changelog — open-skills

All notable changes to this skill pack will be documented in this file.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

**SemVer for a skill pack.** **MAJOR** = a skill removed or renamed, or a breaking
trigger/interface change. **MINOR** = a new skill or skill family. **PATCH** = fixes, docs,
or guard changes that neither add nor remove a skill.

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

[1.1.0]: https://github.com/allemaar/open-skills/releases/tag/v1.1.0
[1.0.0]: https://github.com/allemaar/open-skills/releases/tag/v1.0.0
