---
name: new-skill-creator
description: Scaffold a new Agent Skill end-to-end into a skills repo you maintain (folder, SKILL.md, optional protocol.yon for dual-doc skills, tri-runtime links for Claude Code + Codex + the shared .agents/ dir, commit and push). The maintainer's authoring loop — it links your own clone into your runtimes because you write the changes those links carry. Trigger when the user runs /new-skill-creator or says "create a skill", "make a new skill for X", "add a slash command", "turn this workflow into a skill", "codify this as a skill". Not for editing existing skills — edit the SKILL.md directly. Not for installing skills you did not write — copy those, per README.md. For migrating an existing single-doc skill to the dual-doc YON pattern, see section 6 below.
disable-model-invocation: true
runtime: [claude, codex, agents]
visibility: public
self-improvable: true
next-skills:
  - skill: cold-review
    phrase: "/cold-review"
    why: "Review the new skill against its objectives before relying on it"
triggers:
  - "/new-skill-creator"
  - "create a skill"
  - "make a new skill for X"
  - "add a slash command"
  - "turn this workflow into a skill"
  - "codify this as a skill"
---

# /new-skill-creator

## What this skill does

> **This is a maintainer's authoring loop, and it assumes a skills repo you own.** It writes a new skill into your clone, links that clone into your runtimes, and pushes. The linking below is the opposite of what [`README.md`](../../README.md) tells you to do when *installing* this pack — and deliberately so. A symlink means your agent runs whatever the next `git pull` brings, with no moment where you read the diff; that is the drift [`THREAT-MODEL.md`](../../THREAT-MODEL.md) names, and it is why copying is the default there. Linking here does not make that drift go away — it accepts it, on the same terms README already states: *you're maintaining the pack, or you read every pull.* Authoring a skill does not pre-review a contributor's later commit to it, or your own work from another machine. Installing skills someone else maintains is a different act — copy those.

Creates a new skill in your skills repo, links it into all three agent runtimes (Claude Code, Codex, and the shared `.agents/` dir), commits and pushes to GitHub. Supports two formats:

- **Single-doc** — one `SKILL.md` (default for short routers, triggers, mode-setters, reference cards).
- **Dual-doc** — `SKILL.md` (human-readable, self-sufficient) + `protocol.yon` (declarative, mechanically validatable protocol) (default for heavy procedural skills with phases, gates, severity-ranked rules). See section 2b.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Steps

### 1. Gather info
Ask the user (on Claude Code, use `AskUserQuestion` for structured options; on Codex or other agents without that tool, ask via prose with options as a numbered list):

- What should this skill be called? (kebab-case, becomes /skill-name)
- What does it do — one sentence?
- When should it trigger? Give 2-3 example phrases a user might say.
- Could this skill be confused with an existing skill? If yes, list the ones it's most similar to — we'll add boundary clauses to clarify.
- Should only the user invoke it (not Claude auto-trigger)? Default: yes for workflows with side effects.
- Is this skill runtime-specific? Default: no — skills are available in all three targets (Claude Code, Codex, and the shared `.agents/` dir). Only mark runtime-specific if the skill depends on tools or capabilities that are not available in the other runtime(s).
- **Dual-doc or single-doc?** Apply the criterion below; default to single-doc if uncertain.
- **Caller Options participant?** If the skill has genuine venue or mode optionality worth surfacing to the caller, add the COP opt-in block — see [`caller-options/references/OPT-IN-BLOCK.md`](../caller-options/references/OPT-IN-BLOCK.md).
- **Next-skills participant?** If, after this skill finishes, there are natural successor skills worth recommending to the user, add the NSP opt-in block — see [`next-skills/SKILL.md`](../next-skills/SKILL.md) and the subsection below.
- **Self-improvement participant?** If this is a capable procedural skill (phases, gates, judgment) that a run could expose a tunable weakness in, add the SIP opt-in block (`self-improvable: true`) — see [`self-improve/SKILL.md`](../self-improve/SKILL.md) and the subsection below. Routers / mode-setters / reference cards omit it.
- **Public or private?** Decide `visibility:` — `private` if the skill couples to personal infrastructure or proprietary IP (vault paths, personal domains, proprietary engines); `public` if it is generic and reusable.

#### Dual-doc criterion

Use **dual-doc** (SKILL.md + protocol.yon) when the skill has any of:
- 3+ ordered phases or steps
- Explicit gates / checks / verification points
- Tabular routing or decision logic (decision tables, lookup maps)
- Severity-ranked rules (MUST/SHOULD/MUST_NOT)
- Projected length > ~150 lines

Use **single-doc** (SKILL.md only) when the skill is:
- A trigger / router / mode-setter
- A reference card or schema doc
- A short utility wrapper (< ~100 lines)
- Mostly explanatory prose with no enforceable rules

When in doubt, single-doc. You can always migrate later via the section 6 recipe.

### 2. Create the skill folder and SKILL.md (single-doc default)

Create: `<skills-repo>\skills\{skill-name}\SKILL.md`

Frontmatter:
- name: {skill-name}
- description: {one sentence + trigger examples, max 250 chars}
- disable-model-invocation: true (if user confirmed yes above — see criterion below)
- runtime: (optional, see below) — list of runtimes this skill supports. Default is all three: `[claude, codex, agents]`. Omit the field entirely when the default applies.
- visibility: `public` or `private` — required (see the "Public or private?" item in Step 1). The canonical value lives in front-matter; if your library keeps a separate public/private index, record it there too.

**Description rules:**
- One sentence describing what the skill does.
- Followed by 2-3 example trigger phrases the user might say.
- Keep under 250 characters total when possible (some skills exceed this — don't pad, don't truncate at the cost of clarity).
- **Sibling-boundary clauses**: if this skill could be confused with an existing skill (similar trigger phrases or domain), include in the description a "Not for X — use Y" clause that points to the sibling. Example: `obsidian-markdown` description ends with "Use obsidian-cli instead when the action needs a running Obsidian". Boundary clauses are how the auto-router disambiguates similar skills — without them, two skills with overlapping trigger phrases will compete and one will silently lose.

#### `disable-model-invocation` criterion

See [references/CRITERION.md](references/CRITERION.md) for the full rule, examples, and decided borderline cases. Apply it when writing the front-matter `disable-model-invocation:` field.

#### Next-skills (NSP) opt-in

If the skill has natural successor skills, join the Next Skills protocol by adding three synced parts (per-skill front-matter is canonical):

1. **Front-matter** — a `next-skills:` list, each entry `skill` + `phrase` (activation phrase) + `why` (one line):
   ```yaml
   next-skills:
     - skill: insight-assess
       phrase: "/assess"
       why: "Evaluate the options you just generated and pick one"
   ```
2. **SKILL.md prose pointer** — paste as the **last** section of the body (NSP runs on completion, unlike COP which runs first):
   > **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.
3. **protocol.yon** (dual-doc only) — a closing `@STEP rid=step:nsp` as the last step. See [`next-skills/SKILL.md`](../next-skills/SKILL.md) for the exact form.

#### Self-improvement (SIP) opt-in

If the skill is a capable procedural skill (phases, gates, judgment — i.e. something a run can expose a tunable weakness in), join the Self-Improvement Protocol so the skill proposes its own fixes when a run surfaces a concrete signal. Pure single-doc routers, mode-setters, and reference cards omit it — there's nothing to tune from a run. **Dual-doc skills should declare the field either way:** a genuinely-exempt dual-doc skill (rare — e.g. a meta-protocol that would detect itself, like `self-improve`) sets `self-improvable: false` to record the deliberate decision. Three synced parts (per-skill front-matter is canonical):

1. **Front-matter** — `self-improvable: true`.
2. **SKILL.md prose pointer** — paste as the **last** section of the body (SIP runs on completion, after NSP where present):
   > **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
3. **protocol.yon** (dual-doc only) — a closing `@STEP rid=step:sip` as the last step, after `step:nsp`. See [`self-improve/SKILL.md`](../self-improve/SKILL.md) for the exact form.

Content: write clear step-by-step instructions based on what the user described.

### 2b. Create the skill folder and dual-doc files (dual-doc skills)

When the dual-doc criterion applies, scaffold two files:

```
skills/{skill-name}/
├── SKILL.md          # frontmatter + human overview + self-sufficient body + pointer to protocol.yon
└── protocol.yon      # @DOC kind=skill | profile=exec — rules, steps, checks
```

**SKILL.md shape (dual-doc):**

1. Frontmatter (same fields as single-doc).
2. One-paragraph human overview — what the skill does and when it triggers.
3. **Self-sufficient summary body** — instructions complete enough that a runtime which ignores `protocol.yon` (Codex today, and other agents reading the shared dir) still produces acceptable behavior. This is non-negotiable because of multi-runtime.
4. Pointer block, exact phrasing: *"**Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date."*
5. Optional: critical examples or trace formats that benefit from prose.

**protocol.yon shape:**

Use an existing dual-doc skill's `protocol.yon` in this repo as a template — e.g. [`cold-review/protocol.yon`](../cold-review/protocol.yon) for a governed, multi-step skill.

Required elements:

- `@DOC ver=2.0 | kind=skill | id={skill-name} | title="..." | profile=exec | fmt=min | guide="https://yon.younndai.com/yon-guide.txt"`
- `@INTENT goal="..." | trigger="..."`
- `@STAMP ts:ts=YYYY-MM-DDTHH:MM:SSZ | src=human | method=manual`
- `@SEC` blocks for logical grouping
- `@RULE rid=... | lvl=MUST|SHOULD|MUST_NOT | when="..." | then="..."` for constraints
- `@STEP rid=... | n:int=N | op=... | args=[...] | in=[...] | out=[...]` for ordered steps
- `@CHECK rid=... | assert="..." | fail=WARN|ABORT|SKIP | msg="..."` for gates
- `@CATCH` / `@RETRY` for error handling where relevant
- `@MAP` for tabular configs (decision tables, routing tables, lookup tables)
- Closing `@STAMP` for the YON-author pass

**Drafting the protocol.yon:**

- Use [yon-write](../yon-write) to draft the body.
- Reference [yon-read](../yon-read) for the canonical tag and type registry.
- Validate the result with the public parser before committing: `npx @younndai/yon-parser validate protocol.yon --profile exec`.

**Multi-runtime safety (critical):**

The `SKILL.md` body MUST be execution-sufficient on its own. Runtime discovery and loading behavior varies, and the presence of `protocol.yon` does not prove that a host reads or enforces it. Treat `protocol.yon` as an inspectable, mechanically validatable companion that adds precision for readers and tooling; never make operational completeness depend on implicit YON loading.

### 3. Link into all three runtimes

*Authoring your own skills only — see [what this skill does](#what-this-skill-does). Linking makes your edits live without a re-copy on every save, which is what you want while writing a skill and not what you want while running someone else's.*

Your skills repo is the single source of truth. Each runtime reads from its own directory, so we create three **parallel direct runtime links**, all pointing back to the same repo source. No chaining — every link goes straight to the repo. The links are at the **directory** level, so any companion files (`protocol.yon`, `references/`, `personas/`, etc.) travel automatically with no extra symlinking needed.

> In the commands below, `$HOME` / `%USERPROFILE%` / `$env:USERPROFILE` expand to your home directory on any machine — no edit needed. The repo path shown (`<skills-repo>`) is your clone of the skills repo; substitute your own clone path if it differs.

On Linux/macOS:
```
ln -s /path/to/skills-repo/skills/{skill-name} "$HOME/.agents/skills/{skill-name}"
ln -s /path/to/skills-repo/skills/{skill-name} "$HOME/.claude/skills/{skill-name}"
ln -s /path/to/skills-repo/skills/{skill-name} "$HOME/.codex/skills/{skill-name}"
```

> **Windows + Git Bash:** do **not** use `ln -s` even though bash is available. On this setup, `ln -s` silently creates a real directory copy instead of a symbolic link (no error, no warning) — confirmed by the v2 phase 4 dry-run. Use the Windows `mklink /D` commands below, prefixing the bash invocation with `MSYS_NO_PATHCONV=1` when running via the Bash tool to keep paths intact.

#### Windows

On Windows 11 with Developer Mode, use either `mklink /D` (directory symbolic link) or `mklink /J` (junction). Both are acceptable if each link points directly to the repo source:

```cmd
cmd.exe /c mklink /D "%USERPROFILE%\.agents\skills\{skill-name}" "<skills-repo>\skills\{skill-name}"
cmd.exe /c mklink /D "%USERPROFILE%\.claude\skills\{skill-name}" "<skills-repo>\skills\{skill-name}"
cmd.exe /c mklink /D "%USERPROFILE%\.codex\skills\{skill-name}" "<skills-repo>\skills\{skill-name}"

:: Junction alternative
cmd.exe /c mklink /J "%USERPROFILE%\.agents\skills\{skill-name}" "<skills-repo>\skills\{skill-name}"
cmd.exe /c mklink /J "%USERPROFILE%\.claude\skills\{skill-name}" "<skills-repo>\skills\{skill-name}"
cmd.exe /c mklink /J "%USERPROFILE%\.codex\skills\{skill-name}" "<skills-repo>\skills\{skill-name}"
```

Alternatively, in PowerShell with Administrator privileges:

```powershell
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.agents\skills\{skill-name}" -Target "<skills-repo>\skills\{skill-name}" -Force
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.claude\skills\{skill-name}" -Target "<skills-repo>\skills\{skill-name}" -Force
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.codex\skills\{skill-name}" -Target "<skills-repo>\skills\{skill-name}" -Force
```

> **Note:** Despite Developer Mode being enabled, `New-Item -ItemType SymbolicLink` still requires elevation in some Win 11 builds. `mklink /D` is preferred when symbolic links are available; `mklink /J` is an acceptable fallback. If runtime link creation fails, stop and report — do not try to elevate or work around it.

#### Why three runtime links (not a chain)
- `.claude/skills/` is consumed by **Claude Code** — which reads only its own dir, never `.agents/`.
- `.codex/skills/` is Codex's **older** user location, still read for backward compatibility (`$CODEX_HOME/skills`).
- `.agents/skills/` is the **shared cross-runtime dir** — Codex's *current* user location, and read by Cline, Zed, and Warp. Other tools use dirs of their own (Cursor `~/.cursor/skills`, Copilot `~/.copilot/skills`), so it is not universal.

Each runtime's directory is read independently. A chain (e.g. `.claude/` → `.agents/` → repo) would mean a broken `.agents/` link silently breaks Claude Code. Three direct links keep every runtime independent and resilient.

#### Agent-specific skills
If a skill is intentionally Claude-only or Codex-only — because it depends on tools that aren't available in the other runtime — the author MAY skip the runtime links for the unsupported runtimes. In that case the author MUST add a `runtime:` field to the front-matter listing the supported runtimes. Examples:

```yaml
runtime: [claude]          # Claude Code only
runtime: [codex]           # Codex only
runtime: [claude, codex]   # both LLM runtimes, skip the shared .agents/ dir
```

The default (when `runtime:` is omitted) is all three: `[claude, codex, agents]`. The `runtime:` field is documentation today, not enforced — it's how an author signals intent to humans and to future tooling.

### 4. Commit and push
```
cd <skills-repo>
git add skills/{skill-name}
git commit -m "skill: add {skill-name}"
git push
```

### 5. Confirm
Tell the user:
- Skill created: `/{skill-name}`
- Format: single-doc or dual-doc (and if dual-doc: `protocol.yon` companion present)
- Linked into all three runtimes: `~/.claude/skills/`, `~/.codex/skills/`, `~/.agents/skills/` (or only the subset listed in `runtime:` if the skill is runtime-specific)
- Pushed to GitHub
- Pickup behavior per runtime:
  - **Claude Code** usually picks up new skills immediately; if the new skill doesn't show up in your agent's skill list, restart the agent or trigger a skill reload (e.g. Claude Code: restart; Codex: next session start).
  - **Codex** picks up the skill on next session start.
  - **`.agents/`** pickup depends on the consumer of that mirror.

### 6. Migrating an existing single-doc skill to dual-doc

When promoting an existing skill from single-doc markdown to dual-doc YON:

1. **Snapshot.** Create `archive/` subfolder and copy current `SKILL.md` to `archive/SKILL-YYYY-MM-DD.md` (today's date). The `archive/` subfolder is invisible to the skill loader and travels through directory junctions like everything else. Multiple migrations get multiple stamped files.
2. **Draft `protocol.yon`** following section 2b. Use [yon-write](../yon-write) with the snapshot as input. Hand-edit for fidelity.
3. **Validate `protocol.yon`** with the public parser before committing: `npx @younndai/yon-parser validate protocol.yon --profile exec`.
4. **Rewrite `SKILL.md`** to the dual-doc shape (section 2b): frontmatter unchanged, one-paragraph overview, self-sufficient summary body, pointer block to `protocol.yon`. Target: 30–50% of original line count.
5. **Smoke test (Claude Code).** Trigger via natural-language phrase + slash command. Confirm routing unchanged. Run on a typical task; confirm the model reads `protocol.yon` (visible in tool-call traces).
6. **Smoke test (Codex), if cross-runtime.** Trigger from a Codex session. Codex will likely ignore `protocol.yon` — the SKILL.md must carry the load on its own.
7. **Atomic commit per skill.** Message format: `skill: dual-doc migration for {name}`. Push immediately so the symlinks propagate and you get incremental signal.

### 7. Renaming an existing skill

Renames touch four surfaces: the folder, the front-matter, the OS-level symlinks, and every cross-reference across other skills + indexes. Missing any one of these leaves the library inconsistent. Follow in order — see [`references/RENAME-CHECKLIST.md`](references/RENAME-CHECKLIST.md) for the 30-second card.

1. **Rename the folder** — `mv skills/<old>/ skills/<new>/` (or PowerShell `Rename-Item`).
2. **Update front-matter + heading** — in `skills/<new>/SKILL.md`, change `name: <old>` to `name: <new>` and the `# /<old>` heading to `# /<new>`.
3. **Update `protocol.yon`** (dual-doc only) — change the `@DOC id=<old>` to `@DOC id=<new>` and refresh the `@STAMP` date.
4. **Rebuild the three symlinks.** Drop the old ones and create new ones, all three runtimes:
   - **Windows:** `cmd /c rmdir "%USERPROFILE%\.claude\skills\<old>"` then `cmd /c mklink /D "%USERPROFILE%\.claude\skills\<new>" "<skills-repo>\skills\<new>"` — repeat for `.codex` and `.agents`. (Run via Bash tool: prefix with `MSYS_NO_PATHCONV=1` so paths aren't mangled.)
   - **POSIX:** `rm ~/.claude/skills/<old> && ln -s "$REPO/skills/<new>" ~/.claude/skills/<new>` — repeat for `.codex` and `.agents`.
5. **Sweep cross-references.** Run `grep -rn "<old>" skills/ README.md CONFORMANCE.md` and update every hit. The common surfaces:
   - Other skills' `next-skills:` front-matter `skill:` values.
   - Sibling-boundary clauses in other skills' `description:` fields ("Not for X — use `<old>`").
   - `README.md` inventory section.
   - `skills-help/SKILL.md` menu entries (if the rename crosses families, also re-categorize).
   - Any other skill's prose that names the one you renamed.
6. **Run the lint.** `node tools/lint.mjs` — expect clean. If a broken link/reference, `next-skills-orphan`, or `name-mismatch` fires, fix and re-run.
7. **Atomic commit.** Message format: `skill: rename <old> → <new>`. Push.

### 7a. Renaming verification (dry-run)

Before relying on the procedure for a real rename, exercise it on a throwaway branch:

1. `git checkout -b "tmp/rename-dryrun-$(git rev-parse --short HEAD)"`.
2. Snapshot symlink state — POSIX: `ls -la ~/.claude/skills ~/.codex/skills ~/.agents/skills > "$TMPDIR/symlinks-before.txt"`. Windows PowerShell: `Get-ChildItem ~\.claude\skills, ~\.codex\skills, ~\.agents\skills | Out-File "$env:TEMP\symlinks-before.txt"`.
3. Round-trip rename `reflect` → `reflect-v2` → `reflect`, running the lint after each direction. Skip step 7 (no commits / push).
4. Diff fresh symlink listing against the snapshot — must be byte-equal.
5. `git diff main` — expect empty (round-trip reverts cleanly).
6. `git checkout main && git branch -D tmp/rename-dryrun-<sha>`.

**On dry-run failure** — manually restore symlinks per the snapshot, then `git checkout main && git branch -D tmp/rename-dryrun-<sha>`. The OS-level state must be reconciled before re-attempting; git alone won't fix half-renamed symlinks.

## Rules
- NEVER overwrite an existing skill without asking first
- Always confirm the skill name and description with the user before writing files
- kebab-case names only
- Keep SKILL.md under 500 lines (longer skills are good candidates for dual-doc — see section 2b)
- Three parallel direct runtime links, never a chain — into a skills repo you author; installing a pack you do not maintain is a copy, not a link
- For dual-doc skills, the SKILL.md body must remain execution-sufficient on its own — `protocol.yon` adds precision, never replaces the SKILL.md

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
