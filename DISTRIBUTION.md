# Distribution

Where open-skills is published, what has actually been observed, and how to get it. The shared [installation/update guide](docs/installation.md) owns current method and prerequisite wording.

> Install any skill without this ledger: see [`README.md`](README.md#install). This file tracks *reach* — the channels open-skills is listed/installable through.

## Live

| Channel | How to get it | Status | URL / ref |
|---|---|---|---|
| **Claude Code plugin marketplace** | `/plugin marketplace add allemaar/open-skills` → `/plugin install open-skills@open-skills` | ✅ live | this repo `.claude-plugin/` |
| **Direct clone / copy** | `git clone` + copy a skill folder, or `node install.mjs <skill>` | ✅ live | [README](README.md#install) |
| **`llms.txt` agent-install** | agents auto-discover the install recipe at the repo root | ✅ live | [`llms.txt`](llms.txt) |
| **GitHub repo (topics/About/social)** | found via topics / About / search — no install step of its own | ✅ live | <https://github.com/allemaar/open-skills> |

## Passive (no submission needed)

The compatibility observation below covers the historical 51-skill inventory, not a fresh installation of the current candidate. A later directory observation is recorded below; it does not refresh the historical CLI installation evidence. The optional [skills.sh.json](skills.sh.json) is generated from the same family taxonomy as the catalog by `node tools/spine.mjs`; do not maintain a second grouping by hand. It controls directory presentation only. See the [platform's customization documentation](https://skills.sh/docs/customize) for processing and cache behavior; adding the file alone is not evidence that the listing has refreshed.

| Channel | Mechanism | Status |
|---|---|---|
| **Vercel `skills` CLI / skills.sh** | `npx skills add allemaar/open-skills` — **layout compatibility live-tested 2026-07-16 in an isolated HOME: 51/51 skills installed, `skills/` subdirectory layout handled, exit 0.** That proves the CLI *can* install this pack from our `skills/` layout. It proves nothing about **reach**: an isolated HOME has no agent dirs to detect, and skills.sh surfacing (via the CLI's install telemetry) is **still unobserved for this repo**. **Scope note: the exact invocation was not recorded.** Mode is set by `--copy` / `--yes` / the unique-agent-dir count / scope (`add.ts:760-788`) — agent detection feeds that count but doesn't set mode directly. What we can reason from what *is* known: an isolated HOME detects no agents, so an unattended 51/51 run needed `--yes`/`--all` or agent-detection, and each of those selects every agent → >1 unique dir → no prompt → **symlink**. So the run most likely exercised symlink mode, not copy. Log the command next run rather than reconstructing it. | ✅ installable · reach unmeasured |

## Directory observation, 2026-11-05

The [repository page](https://www.skills.sh/allemaar/open-skills) returned 53 listed names: 52 from the released 3.0.1 inventory and retired new-skill-creator. Thirty-eight released skills were absent. This is directory-page evidence, not a live inventory of all source files or proof of new-user reach. The platform's [FAQ](https://www.skills.sh/docs/faq) says listings arise from installation telemetry; its [grouping documentation](https://www.skills.sh/docs/customize) says grouping changes presentation only. Individual omission causes were not exposed.

The current optional CLI package, skills@1.7.6, declares Node >=22.20.0. Current CLI execution was not performed during this preparation because the available Node did not meet that minimum. No runtime upgrade, artificial installation, telemetry opt-in or directory submission was performed. The source layout and grouping are maintained; do not claim that either forces the directory to list every skill. The bundled Node installer has separate exact-byte evidence and requirements.

## Log

- 2026-07-10 — ledger created; plugin-marketplace + llms.txt + install.mjs + GitHub metadata confirmed live.
- 2026-07-16 — npx/skills.sh channel live-verified (51/51, isolated-HOME test).
- 2026-11-05 — directory page observed at 53 names, with its released-source mismatch and current external-CLI verification gap recorded above.
