# Distribution

Where open-skills is published, and how to get it. One row per channel — kept current as channels go live.

> Install any skill without this ledger: see [`README.md`](README.md#install). This file tracks *reach* — the channels open-skills is listed/installable through.

## Live

| Channel | How to get it | Status | URL / ref |
|---|---|---|---|
| **Claude Code plugin marketplace** | `/plugin marketplace add allemaar/open-skills` → `/plugin install open-skills@open-skills` | ✅ live | this repo `.claude-plugin/` |
| **Direct clone / copy** | `git clone` + copy a skill folder, or `node install.mjs <skill>` | ✅ live | [README](README.md#install) |
| **`llms.txt` agent-install** | agents auto-discover the install recipe at the repo root | ✅ live | [`llms.txt`](llms.txt) |
| **GitHub repo (topics/About/social)** | organic search + GitHub discovery | ✅ live | <https://github.com/allemaar/open-skills> |

## Passive (no submission needed)

| Channel | Mechanism | Status |
|---|---|---|
| **Vercel `skills` CLI / skills.sh** | `npx skills add allemaar/open-skills` works today against any GitHub repo; installs surface on skills.sh via install telemetry | ⏳ auto-on-use |

## To submit (handler-gated — outward actions)

| Channel | Method | Status | Notes |
|---|---|---|---|
| **awesome-claude-code** (`hesreallyhim/awesome-claude-code`) | **web issue form only** — no PR, no `gh`, human submitter required | ⏸️ hold | recs currently paused by maintainer; norm is "get users first"; form-ready one-liner prepared |
| **claudemarketplaces.com** | directory submission (web) | ⬜ planned | plugin-marketplace directory |
| **awesome-skills.com** | directory submission (web) | ⬜ planned | |
| **awesomeclaude.ai** | directory submission (web) | ⬜ planned | |
| **Show HN** | post, from proof (gate-fires + a real skill) | ⬜ planned | one-shot; spend from proof, not day-zero |

> **All "to submit" rows are human-driven web actions** — agents can't (and per some lists' rules, must not) file them. The shared norm across these lists: **submit after traction, not as launch promo.** Descriptions must be plain (state what it does; no sales pitch, no emoji, one line).

## Log

- 2026-07-10 — ledger created; plugin-marketplace + llms.txt + install.mjs + GitHub metadata confirmed live.
