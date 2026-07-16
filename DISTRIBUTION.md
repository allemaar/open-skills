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
| **Vercel `skills` CLI / skills.sh** | `npx skills add allemaar/open-skills` — **live-tested 2026-07-16 in an isolated HOME: 51/51 skills installed, `skills/` subdirectory layout handled, exit 0**; installs reportedly surface on skills.sh via the CLI's install telemetry (not yet observed for this repo — check at each sample) | ✅ verified working |

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

## Deferred tooling (named triggers, not vibes)

- **`install.mjs --outdated`** (read-only staleness diff for copy-path users): build on **first external ask** (issue/PR requesting update tooling) OR **second observed stale-copy incident** — not before. Until then the update story is the README Updating table + `install.mjs`'s existing `--force` procedure.

## Log

- 2026-07-16 — **traction gate + measured-signals log added** (falsifiable thresholds, provisional; row-0 baseline sampled; measurement-cost acceptance recorded). **npx/skills.sh channel live-verified** (51/51, isolated-HOME test). `--outdated` deferral trigger named.
- 2026-07-10 — ledger created; plugin-marketplace + llms.txt + install.mjs + GitHub metadata confirmed live.
