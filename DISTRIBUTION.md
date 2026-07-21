# Distribution

Where open-skills is published and how to get it.

> Install any skill without this ledger: see [`README.md`](README.md#install). This file tracks *reach* — the channels open-skills is listed/installable through.

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
| **Vercel `skills` CLI / skills.sh** | `npx skills add allemaar/open-skills` — **layout compatibility live-tested 2026-07-16 in an isolated HOME: 51/51 skills installed, `skills/` subdirectory layout handled, exit 0.** That proves the CLI *can* install this pack from our `skills/` layout. It proves nothing about **reach**: an isolated HOME has no agent dirs to detect, and skills.sh surfacing (via the CLI's install telemetry) is **still unobserved for this repo**. **Scope note: the exact invocation was not recorded.** Mode is set by `--copy` / `--yes` / the unique-agent-dir count / scope (`add.ts:760-788`) — agent detection feeds that count but doesn't set mode directly. What we can reason from what *is* known: an isolated HOME detects no agents, so an unattended 51/51 run needed `--yes`/`--all` or agent-detection, and each of those selects every agent → >1 unique dir → no prompt → **symlink**. So the run most likely exercised symlink mode, not copy. Log the command next run rather than reconstructing it. | ✅ installable · reach unmeasured |

## Log

- 2026-07-10 — ledger created; plugin-marketplace + llms.txt + install.mjs + GitHub metadata confirmed live.
- 2026-07-16 — npx/skills.sh channel live-verified (51/51, isolated-HOME test).
