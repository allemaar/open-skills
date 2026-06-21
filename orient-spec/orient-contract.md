# Orientation render contract — text + visual

> Apache-2.0. Part of the `orient-spec/` shared contract. Companion to [`orient-record.yon`](orient-record.yon) (the structured face) and [`family-manifest.yon`](family-manifest.yon) (the footer source of truth).

Every `orient-*` skill returns **one computed, ephemeral bundle with three faces** from a single subagent sweep: the **YON record** (agent-consumable, per `orient-record.yon`), the **markdown** (human), and the **visual** (with a mandatory ASCII fallback). The text and visual faces are *lossy projections* of the same record, tuned for human offload; the YON is the lossless source. This document is the contract the markdown and visual faces obey so every skill in the family feels like one tool.

## 1. Text-render contract

**Fixed structure, in order:**
1. **🧭 Identity banner** (line 1, always) — `🧭 {name} — {kind}, {purpose-clause}.  [identity: {glyph} {weakest-tier}]`. Subject-identity is a required preamble, never a standalone skill.
2. **The slice block** — a headline + a micro-table/list for the info-type this skill owns.
3. **Trust trailer** (bottom, always) — the per-field tier rollup + one `⚠️ lean your scrutiny here` line naming the load-bearing guess.

**Rules:**
- **Headline-first.** Each block opens with ONE bolded ≤18-word sentence (`**Now:** …`, `**{open} open · {fraction}**`, `## Δ since {anchor}`). The headline string is identical across all three faces — shared ground truth.
- **Inline provenance grammar** (reused everywhere): attested → plain text + `` `source:line` ``; inferred → italic *(soft / claimed / stated)*; guessed → italic *(inferred)* + a trailing `?` on the value. Legend printed once: `◆ attested · ◐ inferred · ◌ guessed`.
- **Micro-table shape:** 3 columns `| field | value | from |` — `from` is always the tier/source, so provenance travels with every row. Sort high-cost rows to the top (contradicted before confirmed; blocking before deferred; surprise before expected).
- **One-move terminator** (re-entry outputs): the resume-pointer is the LAST section — exactly ONE next action + ONE counter-case + the single dropped alternative. Never a menu.
- **Honest degradation is mandatory and visible.** Thin evidence renders a *different, explicit* collapse (`**~barely-started / mid / near-done — can't tell.**`, `## ETA — unknown`, `Δ … (coarse — mtime only)`) and the trust line states it plainly. A fabricated percentage or confident phase is banned. The empty-folder banner is a success state, not a failure.
- **Token discipline.** Empty buckets are dropped; a clean/no-finding result collapses to one line. Tables over prose. No raw record fields or node-ids surfaced to the human — those collapse into the trailer glyphs.

## 2. Visual-render contract

- **One primary visual per info-type**, chosen so the *encoding is the meaning*: identity = nameplate card; position = a track/spine; remaining = a load bar + ledger; ETA = a fading uncertainty band (a point-marker is BANNED — the uncertainty is the point); map = a node/edge graph (path / tree / dag); delta = a two-lane change strip; gaps = a stall board / sieve (the hole is the deliverable). Gaps may overlay the map's graph rather than draw their own.
- **Mandatory text fallback.** Every visual ships its ASCII/markdown twin ALONGSIDE the spec, ALWAYS emitted, and it is the ONLY render in a no-SVG channel. The fallback is **information-complete** — every datum in the visual is in the ASCII. A one-line legend is printed with each fallback.
- **Shared encoding grammar** (imported by every visual — this *is* the confidence overlay): node/edge style encodes tier — SOLID/filled ● = attested, DASHED = inferred, DOTTED+faded = guessed; a node past the cursor fades by tier so the eye sees where certainty ends. The cursor / `here` / 📍 is always the visually dominant element. Severity/surprise = color.
- **Chrome-free theming** for any SVG/HTML widget: CSS variables, transparent background, no top-level padding. Prefer mermaid (`gitGraph`/`flowchart LR`) or a hand-built SVG spine with branches as drop-down sub-spines.
- **No fabrication in pixels.** Denominator-unknown renders an open-ended bar (`▰▰▰▒╌╌?`, no right edge), not a full bar; an unschedulable portion renders a distinct striped notch; a guessed branch-tip renders a dotted faded leaf. The estimate-vs-observed and attested-vs-guessed firewall is enforced in the visual exactly as in text and YON.
- **Forbidden below a grounding threshold** (modal field tier = guessed): do NOT draw the structural visual — replace it with a visibly different `NO SUBSTRATE` card.

## 3. Tree / branch handling (generic — no arc model)

The single rule: render a **spine** normally, a **TREE** when on a branch / side-quest; the tree is the same renderer rotated.

- **Detection (any evidence):** `on_branch` when EITHER (a) git — current branch ≠ base AND `ahead > 0`, `fork_node = merge-base`; OR (b) plan-level — an active sub-phase below the trunk phase; OR (c) a side-quest that never became a git branch. When no base exists, `on_branch = unknown` (honest, not assumed-trunk).
- **Load-bearing fields** (owned by the trajectory slice, handed to every other slice so none recompute topology): `on_branch`, `cursor_node`/`here`, `fork_node` (the fork/merge-base point), `ahead`, `behind`, `trunk_ref` (the trunk branch). These are the exact field names in `rec:trajectory`.
- **Spine (on-trunk):** one horizontal track, done → `here` → next, left to right.
- **Tree (on a branch):** the trunk stays a faint horizontal line; at `fork_node` a `└─▶` drops to an indented lane carrying the side-quest's nodes; the cursor sits on the branch lane; a dotted return-arrow shows where it rejoins. ETA refuses to forecast the trunk from a branch (`trunk eta: n/a — not on this path`).
- **Identity exception:** identity never becomes a tree (it is a point); on a branch its card gains a `↳ within: {parent_subject}` breadcrumb only.

## 4. Bundle invariants (cross-face)

- **Ephemeral.** `computed_at` + `ephemeral=true` on every envelope; nothing stored. The only reference point (intent line + last-look anchor) is caller-supplied or harness-held.
- **Three faces, one record.** The text and visual are projections of the YON record; they may compress differently but never *contradict* it.
- **Footer.** Every output ends with the family footer from `family-manifest.yon` — human text always, `--family` visual opt-in, agent reads `suggested_next` + `reason_code`.
