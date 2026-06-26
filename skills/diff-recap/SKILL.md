---
name: diff-recap
description: >
  Turn a git diff into a PR-pasteable recap — one row per changed file whose path, status, and line counts are transcribed verbatim from `git diff --numstat` (true by construction; the model writes only the labels), emitted as an inline annotated widget plus a mandatory ASCII twin and a `diff-recap/1` record whose totals equal the sum of the rows. Fills the PR-summary gap the orient- family does not cover. Not /orient-map (shape + delta of the work) or /orient-status (position + ETA) — diff-recap recaps a concrete change-set. Zero external dependency: it renders inline, never to a hosted service.
visibility: public
self-improvable: true
triggers:
  - "/diff-recap"
  - "recap this diff"
  - "summarize these changes for a PR"
  - "what changed in this branch"
  - "write a PR summary"
next-skills:
  - skill: cold-review
    phrase: "/cold-review"
    why: "Before you open the PR, hand the recapped change-set to a fresh-context reviewer."
  - skill: handoff
    phrase: "/handoff"
    why: "Turn the recap into an inter-session brief — it already carries the attested change-summary the next agent needs."
---

# /diff-recap

Turns a **git diff into a recap you can paste into a pull request** — a per-file change table whose numbers are *transcribed from git*, grouped and labelled, rendered as an inline annotated widget with a **mandatory ASCII twin**, and backed by a `diff-recap/1` record. It fills the gap the `orient-` family leaves open: `orient-map` shows the *shape* of the work and `orient-status` shows *where you stand*, but neither recaps **what a concrete change-set contains** for a reviewer. diff-recap does exactly that, and only that.

Its differentiator is **true by construction**: the structured numbers (per-file `added`/`removed`/`status` and the headline totals) come straight from `git diff --numstat` and `--name-status` — the model authors *only* the prose labels. A record whose totals don't equal the sum of its rows is **rejected by a value gate before it can be shown**, so the recap cannot quietly lie about the diff. And unlike a hosted recap renderer, it has **zero external dependency** — the ASCII twin is self-contained and PR-pasteable in any channel.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical steps, rules, and gates; this file is the human-readable, self-sufficient explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## When to use

- "Recap this diff / summarize these changes for a PR" — you want a reviewer-ready change summary, not a fresh read of the whole tree.
- "What changed in this branch" as a **change-set**, grouped by area with a one-line why per file.
- Right before opening a pull request, when you want a paste-able summary whose numbers you can trust.

## How it works (self-sufficient — works without `protocol.yon`)

Every call recomputes from the real diff; nothing is stored.

1. **Take `range`, `repo`, and `intent` as inputs — never prompt.** `range` defaults to the working tree against `HEAD` (or a `A..B` range, or `--staged`); `repo` defaults to the cwd. `intent` (the PR's goal) shapes the labels — if it's ungrounded, the recap still emits the mechanical facts but **caps the labels to descriptive** and never invents a rationale.

2. **Gather from git, transcribe verbatim.** Run `git diff --name-status` and `git diff --numstat` over the range. For each file, copy the `status` (`A`/`M`/`D`/`R`) and the `added`/`removed` counts **exactly as git reports them**. A binary file reports `-`/`-` in numstat → record `0`/`0` and mark the row binary in its label. **The model never counts by hand** — the numbers are git's.

3. **Group and label — the only model-written fields.** Cluster the files by area (feature / tests / docs / config / …), and write one concise label per file and a one-line summary per group. `path`, `status`, `added`, `removed` are git-attested; `label` and `group` are the model's only freedom.

4. **Set the totals as the sum of the rows.** `total_files`, `total_added`, `total_removed` are the exact count and sums of the per-file rows — *that* is the true-by-construction invariant: the headline is, by definition, the sum of the attested rows.

5. **Fail closed.** No git, or an empty diff → `gate_status = barren`, `attested = false`, and a **NO DIFF card** — never a fabricated recap. A `clean` recap requires a real git source (`attested = true`); a partial source caps the verdict at `partial`.

6. **Emit the triple bundle.** The YON record (below), the PR-pasteable markdown summary, and the visual face (Claude Code only). diff-recap honors the **three render-face branches**: a human on Claude Code with the visualize tool present on an explicit invocation gets the **widget + ASCII twin**; an **agent** gets the YON record only; any **other runtime / no tool / indeterminate `handler_type`** gets the **ASCII twin** (fail-closed). (That decision originated in the orient- family — see [`orient-spec/family-behaviors.md`](../../orient-spec/family-behaviors.md) for its full statement; diff-recap adopts only the render-face branching, **not** the orient family's footer roster, "you are here" breadcrumb, or staleness short-circuit.) The **information-complete ASCII twin is always emitted** — it carries every file row, count, group, and total the widget does (worked trio at [`examples/diff-recap.{ascii.txt,widget.svg,example.yon}`](examples/)).

## Record emission (the YON face — reserved tags only)

The record is a `diff-recap/1` instance ([`recap-schema.yon`](recap-schema.yon)). **Reserved tags only.** The envelope is `@CFG id=recap`; each changed file is one `@CFG id=file.<n>`; **list fields (`groups`, `provenance`) go in a sidecar `@MAP`, never an in-set bracket-list** (an in-set list corrupts the record *silently and still validates*). **Never run `yon format` on an instance** — `CANON` mode is destructive on set-internal lists. Validate with `--profile exec`, then run the value gate. Skeleton:

```
@CFG id=recap | set=[schema_version=diff-recap/1,computed_at:ts=…,ephemeral:bool=true,tool=diff-recap,range="HEAD",repo=".",total_files:int=4,total_added:int=155,total_removed:int=7,attested:bool=true,gate_status=clean,overall_trust=high]
@CFG id=subject | set=[name=…,kind=repo,purpose=…,intent_status=stated]
@CFG id=file.f1 | set=[path="src/rate-limit.ts",status=A,added:int=88,removed:int=0,group=feature,label="new token-bucket limiter"]
@CFG id=file.f2 | set=[path="src/server.ts",status=M,added:int=24,removed:int=6,group=feature,label="wire the limiter in"]
@MAP name=groups | pairs=["feature"->"limiter + wiring (2 files, +112/-6)"]
@MAP name=provenance | pairs=["recap.total_added"->"git-attested:high:git diff --numstat"]
```

On **barren** evidence the envelope degrades honestly: `gate_status=barren, attested:bool=false`, no file rows, and the visual is the **NO DIFF card**. A full worked instance ships at [`examples/diff-recap.example.yon`](examples/diff-recap.example.yon).

### The value gate — why the recap can't lie

`yon validate` checks *structure*, not *values*: a record can be valid YON yet state `total_added=999` while its rows sum to `155`. [`tools/diff-recap-check.mjs`](../../tools/diff-recap-check.mjs) is the missing half — it asserts **Σ per-file == totals**, enum membership, and the fail-closed/attested gates, and with `--numstat` it checks every row against the real git numstat. An emitter runs it before emit; CI runs it on the worked example + two deliberately-broken fixtures, so the gate is provably alive (see [`GATE-FIRES.md`](../../GATE-FIRES.md)).

```bash
node tools/diff-recap-check.mjs skills/diff-recap/examples/diff-recap.example.yon --numstat skills/diff-recap/examples/diff-recap.numstat
```

## Output — worked examples (markdown / ASCII face)

```
📋 acme-api — add per-route rate limiting.    range: HEAD     [counts: ◆ git --numstat]
## 4 files · +155 / −7                                          ◆ git diff --numstat

feature   +112 / −6
  + src/rate-limit.ts         +88 / −0    new token-bucket limiter (per-route)      ◆ A
  ~ src/server.ts             +24 / −6    wire limiter in; drop old fixed counter   ◆ M
tests     +40 / −0
  + test/rate-limit.test.ts   +40 / −0    burst, refill, per-route isolation        ◆ A
docs      +3 / −1
  ~ README.md                 +3  / −1    document the RATE_LIMIT env var           ◆ M

Σ rows = +155 / −7  ==  headline  ✓  (true by construction)
**→ PR summary:** per-route token-bucket rate limiter + unit tests + env-var doc.
Trust: ◆◆◆ every count git-attested · the model wrote only the labels · gate: clean
```

**Barren (honest degradation is the success case):**
```
📋 ToDo — no git, or an empty diff.
┌───────────────────────────────┐
│  NO DIFF                       │   nothing to recap — no commits, no changes.
└───────────────────────────────┘
**→ Next:** stage or commit a change, and the recap becomes visible.
Trust: ◌◌◌ · [gate: barren · attested: false]
```

The ASCII twin + the `Σ rows == headline` line + the trust trailer are **mandatory** on every output.

## Boundaries

- **Not `/orient-map`** — that shows the *shape + delta* of the work (done → here → next); diff-recap recaps a *concrete change-set* for a reviewer. They never overlap: orient-map is trajectory, diff-recap is a PR table.
- **Not `/orient-status`** — that reports *position + remaining + ETA*; diff-recap reports *what a diff contains*.
- **Not a code review** — it summarizes *what changed*, it does not judge whether the change is good. Pipe it into `/cold-review` for that.
- **Read-only.** It runs `git diff` and reads the tree; it never mutates state.
- **No hosted dependency.** Unlike a hosted recap renderer, the ASCII twin is the floor and is self-contained — the recap works with no visualize tool, no server, no account.

## Rules

- MUST be **true by construction** — transcribe `path`, `status`, `added`, `removed` verbatim from `git diff --name-status`/`--numstat`; never count by hand. The model authors **only** `label` and `group`.
- MUST set `total_files`/`total_added`/`total_removed` to the exact count and sums of the rows, so the headline equals the sum of the attested rows; the value gate **rejects** any record where they drift.
- MUST **fail closed** — no git or an empty diff → `gate_status = barren`, `attested = false`, NO DIFF card; a `clean` verdict requires `attested = true`.
- MUST always emit the **information-complete ASCII twin** — it is the only render in a no-SVG channel and is PR-pasteable verbatim.
- MUST render the visual face per the render-face contract (Claude Code only, via `mcp__visualize__show_widget`): agent → YON record only; human + Claude + tool + explicit invocation → widget + ASCII twin; other runtime / no tool / indeterminate `handler_type` → ASCII twin (fail-closed). Widget and ASCII twin are projections of **one row-structure** (same rows + totals), chrome-compliant (no hardcoded color, `role="img"` with non-empty title/desc, fixed 680 viewBox).
- MUST emit file rows as `@CFG id=file.<n>` and list fields (`groups`, `provenance`) as sidecar `@MAP`; never a bare in-set bracket-list; never `yon format` an instance.
- MUST take `intent` as input and cap labels to descriptive when it's ungrounded — never fabricate a rationale.

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
