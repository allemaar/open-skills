# Orientation family behaviors — the footer + the buildable F2 halves

> Apache-2.0. Part of the `orient-spec/` shared contract. Companion to [`family-manifest.yon`](family-manifest.yon) (the footer source of truth) and [`orient-contract.md`](orient-contract.md) (the render contract). Defines the cross-cutting behaviors **every** `orient-*` skill shares once two or more ship — so the family feels like one tool, not a pile of skills.

**No new schema.** Every behavior here rides fields and enums that already exist in [`orient-record.yon`](orient-record.yon) — `delta.anchor_*`, the `reason_code` enum (`subject_unchanged`, `unwritten_decision`), and the per-field `conf_tier` provenance rider. There is **no `schema_version` bump**; these are render + routing behaviors over the frozen record.

## 1. The family footer (concrete render)

Every output ends with the footer, computed from [`family-manifest.yon`](family-manifest.yon) → `family{used, suggested_next, reason_code, all}`. Four faces (`rule:footer-faces`):

- **Human** — a one-line **text** footer, ALWAYS: `· family: {used} → next: {suggested_next} ({reason_code})`.
- **`--family`** — an opt-in **visual** map of the roster, marking the `used` node and highlighting `suggested_next`; its ASCII twin is mandatory.
- **Agent** — reads `suggested_next` + the `reason_code` enum directly; no prose needed.
- **Automator** — ignores the footer entirely.

Installed-only (`rule:footer-installed`): the footer suggests **only a shipped skill**. Until a sibling ships, route its `reason_code` to a prose hint or `/plan-create` — never to an unbuilt `/orient-gaps`. `reason_code` is **evidence-derived** (`rule:footer-evidence`), never a static for-X-use-Y table.

ASCII `--family` map (information-complete fallback):
```
family:  [orient-status]✓ ──▶ orient-map   ·   orient-gaps (planned)
          used                  suggested        not installed — prose hint only
legend:  ✓ used · ──▶ suggested-next · (planned) not installed
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
- This surfaces most sharply in `orient-gaps --audit` (claim-vs-evidence) once that skill ships; until then every `orient-*` skill still tier-tags its evidence so the disclosure is present.

## 5. Handoff-feeder routing

When the sweep finds an **unwritten decision** or an open fork with no durable record:

- Set `reason_code = unwritten_decision`; `family_suggested_next` routes **OUT** to a durable-capture skill — `/lyt-handoff` (hand the thread to the next session) or `/lyt-decision` (lock the choice).
- These are **not** `orient-*` skills: orientation **surfaces** the gap; capture lives elsewhere. Per `rule:footer-installed`, route to them only if installed, else a prose hint.

## Cross-cutting invariants

- **Faces discipline** (`rule:footer-faces`) applies to *every* behavior above: human gets prose, the agent reads the enum, the automator ignores it.
- **Ephemeral throughout** — every behavior recomputes from the current anchor; the only reference point (intent line + last-look anchor) is caller-supplied or harness-held, never written to disk.
- **One-file roster edits** (`rule:one-file`) — adding, cutting, or renaming a family skill is a single edit in `family-manifest.yon`; these behaviors read the manifest, so no N×N cross-reference update is needed.
