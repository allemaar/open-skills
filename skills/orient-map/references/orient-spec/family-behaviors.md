# Orientation family behaviors — the footer + the buildable F2 halves

> Apache-2.0. Part of the `orient-spec/` shared contract. Companion to [`family-manifest.yon`](family-manifest.yon) (the footer source of truth) and [`orient-contract.md`](orient-contract.md) (the render contract). Defines the cross-cutting behaviors **every** `orient-*` skill shares once two or more ship — so the family feels like one tool, not a pile of skills.

**No new schema.** Every behavior here rides fields and enums that already exist in [`orient-record.yon`](orient-record.yon) — `delta.anchor_*`, the `reason_code` enum (`subject_unchanged`, `unwritten_decision`), and the per-field `conf_tier` provenance rider. There is **no `schema_version` bump**; these are render + routing behaviors over the frozen record.

## 1. The family footer (concrete render)

Every output ends with the footer, computed from [`family-manifest.yon`](family-manifest.yon) → `family{used, suggested_next, reason_code, all}`. Four faces (`rule:footer-faces`):

- **Human** — a one-line **text** footer, ALWAYS: `· family: {used} → next: {suggested_next} ({reason_code})`.
- **`--family`** — an opt-in **visual** map of the roster, marking the `used` node and highlighting `suggested_next`; its ASCII twin is mandatory.
- **Agent** — reads `suggested_next` + the `reason_code` enum directly; no prose needed.
- **Automator** — ignores the footer entirely.

Installed-only (`rule:footer-installed`): the footer suggests **only a shipped skill** — route a `reason_code` whose target is not installed to a prose hint or `/plan-create`, never to an unbuilt sibling. `reason_code` is **evidence-derived** (`rule:footer-evidence`), never a static for-X-use-Y table.

ASCII `--family` map (information-complete fallback):
```
family:  [orient-status]✓ ──▶ orient-gaps   ·   orient-map
          used                  suggested        (also shipped)
legend:  ✓ used · ──▶ suggested-next · all three shipped
```

## 2. Staleness short-circuit (F2 half)

Keyed on the **last-look anchor** (`delta.anchor_ref` = HEAD sha + dirty-tree hash), caller-supplied or git-inferred, **never stored**. If the anchor is unchanged while wall-clock advanced:

- Return **"no change since your last look"** WITHOUT running the full evidence ladder — a cheap git-tier anchor check answers it.
- Set `reason_code = subject_unchanged`; `family_suggested_next` routes to the internal **`staleness-short-circuit`** action (per `family-manifest.yon` routing) — an internal action, **not** a skill.
- Still emit the `delta` slice honestly: empty `changes`, `no_change_zones` spanning the subject, a fresh `computed_at`, `ephemeral=true`.

The short-circuit is an **optimization, not a cache** — nothing is persisted; it simply stops the sweep early when the attested anchor proves nothing moved.

## 3. Neutral typed signal (F2 half)

A machine-readable signal that the handler is **re-looking**:

- The typed value is `reason_code = subject_unchanged` (an enum member every face can read).
- The **human** nudge renders ONLY when `handler_type = human`, and it is **neutral** — *"no change since `HEAD@…`"* — **never behavioral** (*"avoiding this?"*).
- **No persisted look-counter.** A running `looks_since_change` would require cross-call memory, which the no-store invariant **forbids** (it follows directly from `orient-record.yon`'s `rule:ephemeral`). The signal is derived per-call from the anchor, never accumulated.

## 4. Anti-Goodhart disclosure (F2 half)

Evidence weight is **disclosed, never gamed**:

- A whitespace-only / trivial change is tier-tagged `◌` (guessed-weight); a substantive diff `◆` (attested). The *tier* travels in the per-field `conf_tier` provenance rider; the glyph is its human render.
- A metric that can be inflated (commit count, raw "activity") is shown **with its evidence tier**, so a hollow signal reads as hollow. The disclosure is the deliverable — there is no single gameable score.
- This surfaces most sharply in `orient-gaps --audit` (claim-vs-evidence); every `orient-*` skill also tier-tags its evidence so the disclosure is always present.

## 5. Handoff-feeder routing

When the sweep finds an **unwritten decision** or an open fork with no durable record:

- Set `reason_code = unwritten_decision`; `family_suggested_next` routes **OUT** to a durable-capture skill — one that hands the thread to the next session, or one that locks the choice — when the consumer has such a skill installed.
- These are **not** `orient-*` skills: orientation **surfaces** the gap; capture lives elsewhere. Per `rule:footer-installed`, route to them only if installed, else a prose hint.

## 6. Render-face decision (which face per consumer)

The bundle is **one record, three faces**; *which* face renders is a function of the consumer, the runtime, and whether the read is nominal — NOT a fixed "always show the dashboard". Keyed on `handler_type` — a **render-time input, not a persisted record field** (sourced caller-supplied else inferred: visualize-tool-present + interactive ⇒ `human`; a subagent/automator context ⇒ `agent`/`automator`; **neither supplied nor confidently inferred ⇒ fail-closed to the ASCII twin**, DR3). It is the same consumer-role signal the footer faces already select on, so there is no `schema_version` bump.

| Consumer / context | Face rendered |
|---|---|
| `handler_type = agent` | **YON record only** — no widget, no rich render (a widget is wasted tokens it cannot read) |
| `handler_type = human` · Claude Code · `mcp__visualize__show_widget` present · **explicit invocation** | **widget + ASCII twin** (full) |
| `handler_type = human` · auto/loop tick · **nominal** (no gap/drift/branch) | **collapsed one-line text** — dark-cockpit (render on exception, not every tick) |
| `handler_type = human` · other runtime / no visualize tool | **ASCII twin** (information-complete) |
| `handler_type = automator` | ignores the visual entirely (faces discipline) |
| `handler_type` **indeterminate** (no caller arg, inference inconclusive) | **ASCII twin — fail-closed default** (never guess the widget) |

- **Dark-cockpit (render on exception).** A board that always renders trains the eye to ignore it, so the one red state no longer stands out. For **auto/loop** callers, collapse to one line when nominal and expand only on a gap/drift/branch. An **explicit handler invocation always renders full** — the handler asked, the handler sees. (For the explicitly-invoked `orient-*` slash-commands the collapsed face is a near-empty case today; it is the contract for future loop callers.)
- **Polish ⊥ confidence (couple them).** Render-fidelity tracks evidence tier: a mostly-`◌` read renders **visibly degraded** (the `NO SUBSTRATE` card) and low-confidence elements are non-interactive. A polished widget must never imply more certainty than the evidence carries.
- **Widget-disabled escape.** A contract switch forces any skill to the ASCII twin regardless of consumer — the safety valve when a render is broken; no code change needed.

## 7. Interactivity rails (the `sendPrompt` ceiling)

Interactivity (`mcp__visualize__show_widget`'s `sendPrompt(text)`) turns a widget into a control surface — high DX, high honesty hazard. Five non-negotiable rails (`rule:interactivity-rails`):

- **R1 — human + tool only.** No interactive element exists unless `handler_type = human` ∧ the visualize tool is present; else the face is static.
- **R2 — installed / real actions only.** A control may invoke only an action that genuinely exists (extends `rule:footer-installed` from suggestions to clicks).
- **R3 — confidence-gated.** Low-confidence (`◌`) elements are non-interactive and visibly degraded.
- **R4 — never unprompted.** A `sendPrompt` fires only on an explicit human click; **hard-off in auto/loop**.
- **R5 — compose, don't execute.** A click composes a chat message for the human to send or confirm — it never performs a side-effect directly.

## 8. The "you are here" breadcrumb (universal identity-banner element)

Every `orient-*` skill's identity banner (per [`orient-contract.md`](orient-contract.md) §1) carries an optional **"you are here" breadcrumb** — a single sparse trail line showing where the subject sits in the bigger picture, so a reader who lands cold knows the surrounding frame without a second map. It rides the **frozen** `subject.parent_subject` field (no `schema_version` bump — the field already exists in [`orient-record.yon`](orient-record.yon) `rec:subject`).

- **Render** — `↳ in: {parent_subject}` as a trailing line on the banner, or a short multi-hop trail with the current subject emphasized (`grandparent ▸ parent ▸ **{here}**`; siblings optional / dim). One line in the text/ASCII banner; a small `<text>` row / breadcrumb element in the widget — **never a second map** (the trajectory slice owns topology; this is one orienting line).
- **Honesty floor** (`rule:honest-negative` applied to identity) — **omitted entirely when `parent_subject` is absent**; never fabricate a parent. No parent on record ⇒ no breadcrumb; the banner stands alone.
- **Both faces** — present in BOTH the text/ASCII banner and the widget banner; the §3 branch breadcrumb (`↳ within: {trunk_ref}`) is **one instance** of this universal element, not a separate mechanism.
- **Faces discipline** — the human sees the trail line; the agent reads `subject.parent_subject` directly off the record; the automator ignores it.

## Cross-cutting invariants

- **Faces discipline** (`rule:footer-faces`) applies to *every* behavior above: human gets prose, the agent reads the enum, the automator ignores it.
- **Ephemeral throughout** — every behavior recomputes from the current anchor; the only reference point (intent line + last-look anchor) is caller-supplied or harness-held, never written to disk.
- **One-file roster edits** (`rule:one-file`) — adding, cutting, or renaming a family skill is a single edit in `family-manifest.yon`; these behaviors read the manifest, so no N×N cross-reference update is needed.
