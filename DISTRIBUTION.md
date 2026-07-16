# Distribution

Where open-skills is published, how to get it, and — since 2026-07-16 — the measured signals and the falsifiable gate that decide when the held submissions fire.

> Install any skill without this ledger: see [`README.md`](README.md#install). This file tracks *reach* — the channels open-skills is listed/installable through — and, since 2026-07-16, the **measured signals** and the **falsifiable gate** that decide when the held submissions fire.

## Live

| Channel | How to get it | Status | URL / ref |
|---|---|---|---|
| **Claude Code plugin marketplace** | `/plugin marketplace add allemaar/open-skills` → `/plugin install open-skills@open-skills` | ✅ live | this repo `.claude-plugin/` |
| **Direct clone / copy** | `git clone` + copy a skill folder, or `node install.mjs <skill>` | ✅ live | [README](README.md#install) |
| **`llms.txt` agent-install** | agents auto-discover the install recipe at the repo root | ✅ live | [`llms.txt`](llms.txt) |
| **GitHub repo (topics/About/social)** | found via topics / About / search — no install step of its own | ✅ live | <https://github.com/allemaar/open-skills> |

## Passive (no submission needed)

| Channel | Mechanism | Status |
|---|---|---|
| **Vercel `skills` CLI / skills.sh** | `npx skills add allemaar/open-skills` — **layout compatibility live-tested 2026-07-16 in an isolated HOME: 51/51 skills installed, `skills/` subdirectory layout handled, exit 0.** That proves the CLI *can* install this pack from our `skills/` layout. It proves nothing about **reach**: an isolated HOME has no agent dirs to detect, and skills.sh surfacing (via the CLI's install telemetry) is **still unobserved for this repo** — check at each sample. **Scope note: the exact invocation was not recorded.** Mode is set by `--copy` / `--yes` / the unique-agent-dir count / scope (`add.ts:760-788`) — agent detection feeds that count but doesn't set mode directly. What we can reason from what *is* known: an isolated HOME detects no agents, so an unattended 51/51 run needed `--yes`/`--all` or agent-detection, and each of those selects every agent → >1 unique dir → no prompt → **symlink**. So the run most likely exercised symlink mode, not copy. Log the command next run rather than reconstructing it. | ✅ installable · reach unmeasured |

## The traction gate (falsifiable — added 2026-07-16)

Submissions below are **held on traction** ("doctrine" in the tables = this repo's own submit-after-traction rule). "Traction" is now a number, not a vibe. Thresholds are **PROVISIONAL** — set before any calibration data existed; recalibrate after 2 sampling cycles rather than treating them as targets.

| Action | Fires when (any one) | Why this signal |
|---|---|---|
| Submit to the directories (claudemarketplaces / awesome-skills / awesomeclaude) | **≥25 stars** OR **≥50 unique cloners/14d** — a **raw sample value, not a delta** over the day-0 baseline of 37 (which already mixes CI/bot/CLI noise; if noise dominates at recalibration, raise the number) | Cheap, low-variance listings; fire on first evidence of organic pull |
| awesome-claude-code web form | directory gate met AND the maintainer un-pauses new recommendations | External blocker + their own "get users first" norm |
| **Show HN** | **first external issue or PR** (observable, unambiguous) | One-shot; spend from proof. Third-party mentions are searched at each sample as *context* for recalibration, not a trigger |

**Measurement cost, accepted:** the read-first install paths (clone/copy, `install.mjs`) are **untelemetered by design** — no phone-home, ever, consistent with the pack's inspectability thesis — and the price is that these numbers UNDERCOUNT real installs. Proxies only: GitHub traffic (14-day API retention — **a sampling gap >14 days silently loses clone data**), stars, skills.sh (fires only via the npx channel, which the README lists under "Other ways to fetch" — a positioning decision, not a data absence), and `@younndai/yon-parser` npm downloads (a **composite reach proxy**: self-inflated by `install.mjs`'s own `npx` validation and by CI).

**Sampling contract:** sampling automation is planned; until it lands, **a sample is taken whenever this repo is worked on — and never more than 14 days apart** (the clone window expires). The maintainer interprets; nobody hand-collects on a calendar.

## Measured signals (append-only; sample ≤ every 14 days)

| Date | Stars | Forks | Clones 14d tot (uniq) | Views 14d tot (uniq) | skills.sh | parser npm wk | Notes |
|---|---|---|---|---|---|---|---|
| 2026-07-16 | 0 | 0 | 74 (**37**) | 4 (3) | not yet checked | 65 | **Row 0 baseline.** 37 unique cloners with 0 stars = passive pull already flowing (npx CLI clones + agents + CI mixed in); invisible until this row existed. |

## To submit (handler-gated — outward actions)

| Channel | Method | Status | Hold type | Notes |
|---|---|---|---|---|
| **awesome-claude-code** (`hesreallyhim/awesome-claude-code`) | **web issue form only** — no PR, no `gh`, human submitter required | ⏸️ hold | **external** (maintainer paused) + doctrine | form-ready one-liner prepared (kept outside this repo) |
| **claudemarketplaces.com** | directory submission (web) | ⬜ gated | doctrine (gate above) | plugin-marketplace directory |
| **awesome-skills.com** | directory submission (web) | ⬜ gated | doctrine (gate above) | |
| **awesomeclaude.ai** | directory submission (web) | ⬜ gated | doctrine (gate above) | |
| **Show HN** | post, from proof: a demo-worthy skill + the live enforcement evidence ([GATE-FIRES.md](GATE-FIRES.md)) | ⬜ gated | doctrine (gate above) | one-shot; spend from proof, not day-zero |

> **All "to submit" rows are human-driven web actions** — agents can't (and per some lists' rules, must not) file them. The shared norm across these lists: **submit after traction, not as launch promo.** Descriptions must be plain (state what it does; no sales pitch, no emoji, one line).

## Tooling triggers (named, not vibes)

- **`install.mjs --outdated` / `--diff`** — **NOT BUILDING. Decided 2026-07-16 after re-examining the premise; existing tools already do both halves.**
  - *Staleness:* `gh skill update --dry-run` (core command since gh v2.90.0, preview) reads the `metadata:` stamp `install.mjs` now writes and reports which copies are behind — **verified end-to-end against gh v2.96.0 in a container, unauthenticated, on install.mjs-made copies.** Building ours would reimplement a first-party command against a spec we don't own. This ledger's own E1 entry already states the rule: *evaluate recommending the CLI before building our own.*
  - *The diff:* `git diff --no-index -I '^(metadata:|  (github-|local-path))'` compares an installed copy against your clone, needs no network or account, and catches local edits gh structurally cannot see (gh compares the recorded stamp, never your bytes). THREAT-MODEL step 5 now prescribes exactly that command.
  - *Why the old trigger was wrong to fire:* it was retired on the reasoning that "the ask is already filed **by the author**" — an author-filed ask is not external evidence, it is the vibe the traction gate above exists to exclude. Against 0 stars and 0 external issues, building update tooling was the discovery-spend-ahead-of-validation error this file names two sections up.
  - **What would re-open it:** a real external ask (issue/PR) for update tooling; or gh changing/removing the `github-*` metadata contract, which would strand the copies we stamp.
- **E1 — canonical copy + bridge junction** (copy to `~/.agents/skills/<name>`, then junction `~/.claude/skills/<name>` at it, so one canonical copy serves every runtime): **fires on** the first external ask for a non-Claude runtime, OR the first issue reporting a missing or duplicated skills dir.
  - **Check first — it may already exist.** `npx skills add` **can produce this exact topology** (canonical `~/.agents/skills/<name>` + per-agent symlink/junction) — though **not by default**: it needs a *global* install in *symlink* mode, whereas an interactive run **prompts** for scope (`add.ts:734`) and only falls to project when non-interactive, and mode falls to copy when a single agent dir is targeted. If E1's trigger fires, first evaluate *recommending that CLI with the right flags* over building our own; only build if that is unacceptable.
  - **Kill-condition:** Anthropic ships `~/.agents/skills` discovery — the bridge would be dead code before it shipped. Tracking: [#31005](https://github.com/anthropics/claude-code/issues/31005) (open), [#56193](https://github.com/anthropics/claude-code/issues/56193) and [#66352](https://github.com/anthropics/claude-code/issues/66352) (**both closed `not_planned`**). Read honestly: the request has been declined twice, so this kill-condition currently looks **unlikely to fire** — which is itself part of the bet, and makes the deferral below more justified, not less.
  - **Why not today:** it buys a permanent link-removal obligation on exactly the hazard class [`install.mjs`](install.mjs) refuses to touch, on strangers' Windows boxes, for a user with no evidence of existing yet.
  - **Dated bet, not a constant:** `~/.agents/skills` is an unowned convention — no spec, no governing body — so if it is moved or renamed, everything built on it breaks at once; if E1 is ever built it needs a CI path re-verify.

## Log

- 2026-07-16 — **traction gate + measured-signals log added** (falsifiable thresholds, provisional; row-0 baseline sampled; measurement-cost acceptance recorded). **npx/skills.sh channel live-verified** (51/51, isolated-HOME test). `--outdated` deferral trigger named.
- 2026-07-10 — ledger created; plugin-marketplace + llms.txt + install.mjs + GitHub metadata confirmed live.
