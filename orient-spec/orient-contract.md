# Orientation render contract — text + visual

> Apache-2.0. Part of the `orient-spec/` shared contract. Companion to [`orient-record.yon`](orient-record.yon) (the structured face) and [`family-manifest.yon`](family-manifest.yon) (the footer source of truth).

Every `orient-*` skill returns **one computed, ephemeral bundle with three faces** from a single subagent sweep: the **YON record** (agent-consumable, per `orient-record.yon`), the **markdown** (human), and the **visual** (with a mandatory ASCII fallback). The text and visual faces are *lossy projections* of the same record, tuned for human offload; the YON is the lossless source. This document is the contract the markdown and visual faces obey so every skill in the family feels like one tool.

## 1. Text-render contract

**Fixed structure, in order:**
1. **🧭 Identity banner** (line 1, always) — `🧭 {name} — {kind}, {purpose-clause}.  [identity: {glyph} {weakest-tier}]`. Subject-identity is a required preamble, never a standalone skill. It carries the optional **"you are here" breadcrumb** (below) as a trailing sparse trail when the subject sits inside a bigger picture.
2. **The slice block** — a headline + a micro-table/list for the info-type this skill owns.
3. **Trust trailer** (bottom, always) — the per-field tier rollup + one `⚠️ lean your scrutiny here` line naming the load-bearing guess.

**The "you are here" breadcrumb (universal identity-banner element).** A single sparse trail line that shows where the subject sits in the bigger picture — `↳ in: {parent_subject}`, or a short multi-hop trail with the current subject emphasized (`grandparent ▸ parent ▸ **{here}**`; siblings optional / dim). It is keyed **only** on the record's existing `subject.parent_subject` (no schema change) and rides BOTH faces (text and visual). HARD RULES:
- **Sparse** — one line / a small trail, NEVER a second map. The map is the trajectory slice's job; the breadcrumb is one orienting line.
- **Omitted entirely when `parent_subject` is absent** — never fabricate a parent (the honesty floor). No `parent_subject`, no breadcrumb line; the banner stands alone.
- **Present in both faces** — a short trail in the text/ASCII banner, a small `<text>` row / breadcrumb element in the widget (no extra map). The §3 branch case (`↳ within: {trunk_ref}`) is **one instance** of this universal element, not a separate mechanism.

**Rules:**
- **Headline-first.** Each block opens with ONE bolded ≤18-word sentence (`**Now:** …`, `**{open} open · {fraction}**`, `## Δ since {anchor}`). The headline string is identical across all three faces — shared ground truth.
- **Inline provenance grammar** (reused everywhere): attested → plain text + `` `source:line` ``; inferred → italic *(soft / claimed / stated)*; guessed → italic *(inferred)* + a trailing `?` on the value. Legend printed once: `◆ attested · ◐ inferred · ◌ guessed`.
- **Micro-table shape:** 3 columns `| field | value | from |` — `from` is always the tier/source, so provenance travels with every row. Sort high-cost rows to the top (contradicted before confirmed; blocking before deferred; surprise before expected).
- **One-move terminator** (re-entry outputs): the resume-pointer is the LAST section — exactly ONE next action + ONE counter-case + the single dropped alternative. Never a menu.
- **Honest degradation is mandatory and visible.** Thin evidence renders a *different, explicit* collapse (`**~barely-started / mid / near-done — can't tell.**`, `## ETA — unknown`, `Δ … (coarse — mtime only)`) and the trust line states it plainly. A fabricated percentage or confident phase is banned. The empty-folder banner is a success state, not a failure.
- **Token discipline.** Empty buckets are dropped; a clean/no-finding result collapses to one line. Tables over prose. No raw record fields or node-ids surfaced to the human — those collapse into the trailer glyphs.
- **The record is not a human face.** The YON record is emitted to an `agent` consumer only, per [`family-behaviors.md`](family-behaviors.md) §6; the human reply carries the markdown read plus the visual and never the record itself.
- **Human-facing prose obeys the human-output contract** (`human-output/SKILL.md`); this section sets only the orientation-specific shape.

## 2. Visual-render contract

The visual face is rendered by the Claude **`mcp__visualize__show_widget`** MCP tool **(Claude Code only)** — an availability- and consumer-gated *enhancement over the mandatory ASCII twin*, never a replacement. There is no stored template: call **`mcp__visualize__read_me`** once per session (silently) for the authoritative design system, build the fragment from the kit below, then call `show_widget`. `read_me` is authoritative and wins on any conflict with this document.

- **Render-face is consumer-gated** — see [`family-behaviors.md`](family-behaviors.md) §6 and `family-manifest.yon` `map:render-face`. In short: an **agent** consumer gets the YON record only (a widget is wasted tokens it cannot read); a **human on Claude Code, tool present, on an explicit invocation** gets the widget **plus** the ASCII twin; an **auto/loop nominal** read collapses to the one-line text face (dark-cockpit — render on exception); **any other runtime / no tool** gets the ASCII twin. The widget is the *human-on-Claude* face, not merely the "rich" face.
- **One primary visual per info-type**, chosen so the *encoding is the meaning* — built from this kit (the A0-verified renderer path noted per item):
  - **identity** = a nameplate card (HTML card).
  - **position / spine** = a track (hand-SVG, fixed 680 viewBox).
  - **remaining** = a load bar + ledger (HTML; open-ended when the denominator is unknown).
  - **ETA** = a **fading uncertainty band** — a point-marker is BANNED, the uncertainty IS the datum. Render as a hand-SVG band using the single permitted two-stop `<linearGradient>` (the one documented gradient exception) or two stacked flat-fill rects.
  - **map** = a node/edge graph (path / tree / dag), hand-SVG from the flowchart primitives (`class="node|box|arr"`, the `#arrow` marker, `c-{ramp}` fills). **No native gitGraph/flowchart exists** — keep it ≤ ~5 nodes / a shallow tree, or decompose into overview + sub-flow (coordinate math is the highest-failure-rate case).
  - **delta** = a two-lane change strip (HTML rows).
  - **gaps** = a stall board / sieve — the hole is the deliverable (HTML grid); may overlay the map graph rather than draw its own.
  - **dashboard** (status roll-up) = prebuilt HTML components only — metric cards in an auto-fit grid (`repeat(auto-fit, minmax(160px,1fr))`), status pills on the semantic `--color-background-{success|warning|danger}` fills, Tabler **outline** icons. Lowest friction; no SVG.
- **Mandatory text fallback.** Every visual ships its ASCII/markdown twin ALONGSIDE the spec, ALWAYS emitted, and it is the ONLY render in a no-SVG channel. The fallback is **information-complete** — every datum in the visual is in the ASCII. A one-line legend is printed with each fallback.
- **Shared encoding grammar** (imported by every visual — this *is* the confidence overlay): node/edge style encodes tier — SOLID/filled ● = attested, DASHED = inferred, DOTTED+faded = guessed; **confidence renders as opacity/fade** — a node past the cursor fades by tier so the eye *sees* where certainty ends. The cursor / `here` / 📍 is the visually dominant element (the hero — scale + the strongest stop). Severity/surprise = color.
- **Accessibility (load-bearing, redundant by construction).** State is **never color-alone** — the `◆◐◌` tier glyphs carry *shape*, paired with text; color is secondary. **HTML** widgets open with a visually-hidden `<h2 class="sr-only">` one-sentence summary; **SVG** widgets instead carry `role="img"` with `<title>`+`<desc>` as the first children (SVG does NOT use the sr-only h2). Text on a colored fill uses the **800/900 stop of that same ramp**, never black/gray.
- **Chrome-free theming** — CSS variables / `c-{ramp}` classes only (never hardcoded hex except where `read_me` requires it: Chart.js canvas, physical-color scenes, SVG connector strokes), transparent outer container, no top-level padding, **never `position:fixed`** (it collapses the iframe to a stub). Flat — no gradient/shadow/blur (the ETA-band `<linearGradient>` and functional focus-rings are the only exceptions). Sentence case, no emoji, font weights 400/500 only.
- **Parity is a drift-resistant emitter obligation, not a machine guarantee.** Per [`orient-record.yon`](orient-record.yon) the enum/gate/parity are emitter obligations plus a conformance test — `yon validate` checks structure, not values. The `orient-validate` guard ([`tools/orient-validate.mjs`](../tools/orient-validate.mjs)) machine-checks the *value* half `yon validate` skips — enum membership and the fail-closed cross-field gate — against the emitted record. The widget and the ASCII twin MUST be projections of **one node-structure**; the `orient-roundtrip` guard machine-checks that every node, change, and zone label appears in **both** faces (word-boundary matched) and that the widget carries the `◆◐◌` tier glyphs and obeys the chrome + a11y rules. **Edges and per-field tiers stay emitter obligations — not machine-compared between faces.** (A deterministic record→ASCII+SVG renderer is the triggered escalation if live emissions are observed to drift.)
- **Widget-disabled escape.** A single contract switch degrades any skill to the ASCII twin with no code change — the safety valve for a broken host, an undefined CSS var, or a bad render.
- **No fabrication in pixels.** Denominator-unknown renders an open-ended bar (`▰▰▰▒╌╌?`, no right edge), not a full bar; an unschedulable portion renders a distinct striped notch; a guessed branch-tip renders a dotted faded leaf. The estimate-vs-observed and attested-vs-guessed firewall is enforced in the visual exactly as in text and YON.
- **Forbidden below a grounding threshold** (modal field tier = guessed): do NOT draw the structural visual — replace it with a visibly different `NO SUBSTRATE` card.

## 3. Tree / branch handling (generic — no arc model)

The single rule: render a **spine** normally, a **TREE** when on a branch / side-quest; the tree is the same renderer rotated.

- **Detection (any evidence):** `on_branch` when EITHER (a) git — current branch ≠ base AND `ahead > 0`, `fork_node = merge-base`; OR (b) plan-level — an active sub-phase below the trunk phase; OR (c) a side-quest that never became a git branch. When no base exists, `on_branch = unknown` (honest, not assumed-trunk).
- **Load-bearing fields** (owned by the trajectory slice, handed to every other slice so none recompute topology): `on_branch`, `cursor_node`/`here`, `fork_node` (the fork/merge-base point), `ahead`, `behind`, `trunk_ref` (the trunk branch). These are the exact field names in `rec:trajectory`.
- **Spine (on-trunk):** one horizontal track, done → `here` → next, left to right.
- **Tree (on a branch):** the trunk stays a faint horizontal line; at `fork_node` a `└─▶` drops to an indented lane carrying the side-quest's nodes; the cursor sits on the branch lane; a dotted return-arrow shows where it rejoins. ETA refuses to forecast the trunk from a branch (`trunk eta: n/a — not on this path`).
- **Identity exception:** identity never becomes a tree (it is a point); on a branch its card gains a breadcrumb only — the **universal "you are here" breadcrumb** of §1 (`↳ in: {parent_subject}`), here in its branch instance `↳ within: {trunk_ref}` ("within the trunk this branch forked from"). Same single sparse line, never a second map; omitted when `parent_subject` is absent.

## 4. Bundle invariants (cross-face)

- **Ephemeral.** `computed_at` + `ephemeral=true` on every envelope; nothing stored. The only reference point (intent line + last-look anchor) is caller-supplied or harness-held.
- **Three faces, one record.** The text and visual are projections of the YON record; they may compress differently but never *contradict* it.
- **Footer.** Every output ends with the family footer from `family-manifest.yon` — human text always, `--family` visual opt-in, agent reads `suggested_next` + `reason_code`.
