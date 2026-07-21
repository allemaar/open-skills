# orient-spec — the shared contract for the `orient-` family

> Apache-2.0. Shared infrastructure (not a skill). The `orient-*` skills each emit a slice of one computed, ephemeral **orientation record**; this folder defines that record and how it renders, so every skill — and a private conforming mirror — agrees on shape without sharing code.

## What `orient-` is

A small family of **orientation** skills: a handler (human *or* an agent orienting itself) asks "where are we / show me the map / what's stuck", and a bounded read-only **subagent** computes a fresh answer and returns only the signal — a **triple bundle** (a YON record + markdown + a visual). Nothing is stored; it is recomputed each call. Orientation = SEE / ORIENT / REBUILD-CONTEXT, orthogonal to the `insight-` family (THINK / DECIDE).

## The files here

| File | What it is |
|---|---|
| [`orient-record.yon`](orient-record.yon) | The structured record schema (envelope, subject, the per-field provenance rider, and the per-slice shapes) + the invariant rules and gates. **Reserved-tag emission, no custom tags, no domain.** |
| [`orient-contract.md`](orient-contract.md) | The text-render + visual-render contracts (banner → block → trust trailer; one visual per slice + a mandatory ASCII fallback; tree-when-on-a-branch). |
| [`family-manifest.yon`](family-manifest.yon) | The single source of truth for the footer: the skill roster, each skill's `gate_field` + `trigger`, and the evidence-derived `reason_code` routing. One-file edit to add/cut/rename a skill. |
| [`family-behaviors.md`](family-behaviors.md) | The cross-cutting family behaviors over the frozen record: the concrete footer render (four faces), the staleness short-circuit, the neutral typed signal, the anti-Goodhart disclosure, and handoff-feeder routing. No schema bump — all ride existing fields/enums. |
| [`subagent-protocol.md`](subagent-protocol.md) | How a skill spawns its bounded, read-only, depth-1 subagent and receives only the bundle. |

## Validate it yourself

```bash
# run from the open-skills/ repo root
npx @younndai/yon-parser validate orient-spec/orient-record.yon --profile exec
npx @younndai/yon-parser validate orient-spec/family-manifest.yon --profile exec
npx @younndai/yon-parser validate orient-spec/examples/orient-record.example.yon --profile exec
```

## Two tiers, one contract

`orient-*` (public, here) reads only universal surfaces — git, plan/TODO files, the file tree, the conversation. a private conforming extension is independently implemented and reads its own declared artifacts, but conforms to this same record so the two interoperate with **no shared code and no separate domain**. (That extension is private; its internals are intentionally not described here.)

> **Status:** [`orient-status`](../skills/orient-status/), [`orient-map`](../skills/orient-map/), and [`orient-gaps`](../skills/orient-gaps/) are all **shipped** against this contract. A worked, validatable example record ships at [`examples/orient-record.example.yon`](examples/orient-record.example.yon).
