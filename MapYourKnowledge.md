# Map Your Knowledge

**Map Your Knowledge (MYK)** makes any folder of markdown **navigable cold**: a person or an agent landing on any file can immediately answer three questions — *What is this? Who owns it? Where do I go next?* It is a protocol, not a product: valid with nothing but markdown, delivered through the `map-*` skills in this repository (with one small deterministic checking script bundled inside `map-check`). No database, no app, no lock-in — delete the toolkit and your vault is still perfectly readable; the maps are just good pages.

## The problem it solves

Vaults and project folders grow faster than anyone keeps them organized. Files pile up; nobody remembers what owns what; every AI agent landing in the folder re-learns the layout from scratch — or "reorganizes" it into something nobody recognizes. Data you cannot navigate is data you slowly stop using.

## The shape

```text
any-project/
├── .myk/README.md           ← the scope's MEMORY: "my front door is this map,
│                               these files are protected, this style was chosen"
│                               — opens with a plain-words note saying exactly what
│                               it is; travels with the vault, never gitignored
├── any-project-map.md       ← the FRONT DOOR: what this project is, what's in it,
│                               sub-maps, shortcuts to the important nodes,
│                               and the House Rules for working here
├── research/
│   └── research-map.md      ← a sub-map — earned when a folder grows enough
│       ...every file here carries one line: "my home is research-map"
└── archive/                 ← archived things stay findable, clearly labeled
```

Every file declares its home map; every map lists its members. Two directions means drift is **detectable** — the graph can be checked, not just hoped about. Inside an organized scope, new files are **born mapped**: creation and mapping are one step, so the graph grows organically instead of needing rescue cleanups.

## The behavior that makes it safe: elasticity

MYK's first law: **the house style outranks MYK's defaults.** Before touching anything it reads what already exists and lands on one of four verdicts — always confirmed by the human, never decided silently:

```text
Meet a folder or vault
        ↓  (reads the established inventory — or a declared sample
           on very large vaults — and writes NOTHING)
┌─ ADOPT   your conventions are compatible → MYK works in YOUR dialect:
│          your tag names, your headings, your file naming
├─ OFFER   something conflicts → you choose: "switch this to MYK"
│          or "leave it alone" — it never blends or overrides
├─ SETTLE  blank canvas (including a pile of unstructured data —
│          the native case) → MYK's sensible defaults
└─ ASK     can't tell for sure → it asks you. Uncertainty never guesses.
        ↓
Your answer is WRITTEN DOWN — you are never asked twice.
A "no" lives in your own README, in your own words — MYK writes
no file of its own into a vault that declined — and is honored
by every future agent, forever.
```

Three more promises, each a hard rule: **first value costs zero writes** (the first output is always an assessment and a proposal table; changes happen only as rows you select) · **documented house decisions are honored** (a README that says "these links are intentionally broken" is surfaced once for your confirmation, then never re-litigated) · **mutualism** (after MYK works a vault that had its own style, that vault must be *more itself* — if MYK's presence dilutes a house style, that is a defect by definition).

## The toolkit — the `map-*` family

| Skill | What it does |
|---|---|
| [`map-rules`](skills/map-rules/) | The shared rulebook agents load before touching organized markdown — ownership, linking, naming, tagging, archiving, and the elastic verdicts. Works with nothing but markdown. |
| [`map-this`](skills/map-this/) | The workhorse: "map this project." Pre-flight → zero-write assessment → proposal table → you pick → careful apply. Structures unstructured data, improves READMEs additively, asks once which files deserve shortcuts. |
| [`map-init`](skills/map-init/) | The onboarding door: checks whether MYK is already in your agents' directives ("nothing to do — you already have it") or offers to add it — globally or per-project, for EVERY agent platform on your machine (one uninformed agent can undo what the others maintain). Optional, consent-first, with a paste-this-yourself fallback per platform. |
| [`map-check`](skills/map-check/) | The honest inspector: read-only health checks via a small bundled script, always reporting what it checked *and what it cannot check* — forbidden from ever claiming an unqualified "all clear." |
| [`map-maintain`](skills/map-maintain/) | The gardener: these are living graphs that need tending — one bounded cycle of health check and repair proposals per invocation. You select; it mends. |

Two names that look alike, kept deliberately distinct: **`map-rules`** is the shared protocol everyone loads; a scope's **House Rules** are that one folder's local guidance ("drafts live in sketches/; never rename the exports") — written in the owner's voice, read by every agent, and never confused with the protocol itself.

## What MYK deliberately is NOT

Not a task manager (it organizes knowledge — what things are and where they live; work status belongs elsewhere). Not an app or a database (plain markdown in your own folders). Not a landlord (it is a guest: it adopts your conventions, remembers your answers, honors your refusals, and leaves your voice in your files).

## Getting started

1. Install the `map-*` skills (see the repository README's [Install](README.md#install) section).
2. Say **"map this project"** on any folder — you get a zero-write assessment and a proposal table.
3. Optionally run **`/map-init`** to make this every agent's default way of working.

---

Made by [Alexandru Mares](https://allemaar.com). Model-assisted, then reviewed, tested, and dogfooded in the work it describes.
