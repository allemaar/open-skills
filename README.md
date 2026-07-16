<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/allemaar/open-skills/main/assets/allemaar-icon-ondark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/allemaar/open-skills/main/assets/allemaar-icon-onlight.png" />
    <img alt="allemaar" src="https://raw.githubusercontent.com/allemaar/open-skills/main/assets/allemaar-icon-onlight.png" width="120" />
  </picture>
</p>

<p align="center">
  <strong>open-skills</strong><br />
  Reusable skills for AI coding agents — readable before you trust them.<br />
  Each skill is a Markdown doc you can read and a declarative <strong>YON</strong> protocol you can validate.<br />
  <em>Nothing to execute on faith.</em>
</p>

<p align="center">
  <a href="#install">Install</a> · <a href="#use-it">Usage</a> · <a href="#validate-it-yourself">Validate</a> · <a href="skills/">Skills</a> · <a href="#the-orient--family">Orient</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">Apache 2.0</a> · <a href="https://allemaar.com">allemaar.com</a>
</p>

<p align="center">
  <a href="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml"><img alt="YON conformance" src="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" /></a>
  <a href="https://github.com/YounndAI/yon"><img alt="Runs on YON" src="https://img.shields.io/badge/runs%20on-YON-7c3aed.svg" /></a>
</p>

---

A skill is instructions your agent runs with your machine's access. These you can read before you trust them — each is a Markdown doc plus a declarative YON protocol you validate yourself.

This is a pack of reusable skills for AI coding agents (Claude Code, Codex, and any runtime that reads the open Agent Skills format). They're the skills I run my own agents on — review, planning, priming, deliberation — published so you can read every line before you trust them. It's a living set: I add skills here as I build the ones I need.

**Composable, not a framework.** Install one or install fifty — each stands on its own as an install decision, none require the rest, and your agent keeps room to think between them. Take what earns its place and ignore the rest.

## The idea: two files per skill

Each skill is a folder under [`skills/`](skills/) with up to two files:

| File | For whom | What it carries |
|---|---|---|
| **`SKILL.md`** | human + agent | what the skill does and when to use it, in plain language |
| **`protocol.yon`** | the runtime | the same skill's steps, rules, and gates as a **declarative protocol** it can enforce and *you* can audit |

Markdown explains the skill. **YON makes it inspectable and enforceable** — the control flow, the rules (`MUST` / `MUST_NOT`), and the gates (`ABORT` / `WARN`) are named, typed objects, not prose you hope the model follows. Of the 51 skills here, **37 ship a `protocol.yon`**; 14 are Markdown-only.

"Enforceable" is a claim you can check: [`GATE-FIRES.md`](GATE-FIRES.md) shows the public parser and the semantic linter *rejecting* deliberately-broken skills — regenerated in CI on every push, so it can't be staged.

---

## Install

Pick your path: a one-line plugin install if you just want the skills working, or clone-and-copy if you want to read them before you trust them. The second is the whole point of this pack — the first is just here if you want to try the skills before reading all of them.

### Fastest on Claude Code — the plugin marketplace

```text
/plugin marketplace add allemaar/open-skills
/plugin install open-skills@open-skills
```

This registers the repo as a Claude Code plugin marketplace and installs the pack (the plugin and the marketplace are both named `open-skills`, hence `open-skills@open-skills`); the skills are then namespaced (`/open-skills:cold-review`, `/open-skills:investigate`, …). Update in place with `/plugin marketplace update open-skills`. It's still skills your agent runs with your access — so read the ones you'll lean on; that's what the rest of this page is for.

### Read-first — clone and copy (any runtime)

No build step, no dependency on me. Clone the repo and copy the skill folders your agent reads — a frozen copy is the default, and the safest:

```bash
git clone https://github.com/allemaar/open-skills
cd open-skills

# Copy a skill into ONE skills dir — whichever your runtime reads
cp -r skills/cold-review ~/.claude/skills/cold-review     # Claude Code
cp -r skills/cold-review ~/.agents/skills/cold-review     # the shared dir — Codex, Cline, Zed, Warp
cp -r skills/cold-review ~/.codex/skills/cold-review      # Codex — older path, still read

# Windows
xcopy /E /I skills\cold-review "%USERPROFILE%\.claude\skills\cold-review"
```

**Pick the dir your agent reads — one, not all three.** Claude Code reads `~/.claude/skills` and only that, never `~/.agents/skills`. On Codex, use `~/.agents/skills` — it's the current location, and other runtimes read it too; the older `~/.codex/skills` still works if you're already there. Most other tools have a dir of their own — Cursor `~/.cursor/skills`, Copilot `~/.copilot/skills` — so check yours rather than assuming `~/.agents/skills` is universal.

Prefer one command? [`install.mjs`](install.mjs) does close to the same thing — read the catalog, copy the folder, validate its `protocol.yon` — plus one edit the `cp` above doesn't make: it stamps the copy's `SKILL.md` with a `metadata:` block recording the repo, ref, and tree SHA it came from, so you can tell later whether it has drifted. That means the installed file is not byte-identical to this repo's; `--no-stamp` turns it off, and [`THREAT-MODEL.md`](THREAT-MODEL.md#what-open-skills-does-about-it) explains the trade. It is a single zero-dependency Node file you can read before you run it:

```bash
node install.mjs cold-review                    # one skill
node install.mjs --runtime claude cold-review   # into one dir only
node install.mjs --all                          # the whole pack
node install.mjs --list                         # see what's installable
```

By default it copies into **every** skills dir it finds — pass `--runtime claude|codex|agents` to target just one.

It copies (never symlinks), skips an already-installed skill unless you pass `--force`, and — true to the wedge — *refuses* to overwrite a symlinked or junctioned skill rather than delete through the link into the repo. The installer is itself inspectable; read it first.

**Want a skill to track the repo as you pull?** That means symlinking into this clone — and it's the one setup this pack argues against. A `git pull` then silently changes the instructions your agent runs, with no moment where you read the diff. That is exactly the drift [`THREAT-MODEL.md`](THREAT-MODEL.md) names, and it's why copying is the default. If you want it anyway — you're maintaining the pack, or you read every pull — link it deliberately:

```bash
# POSIX — target first, then the link
ln -s "$PWD/skills/cold-review" ~/.claude/skills/cold-review

# Windows — link first, then the target. Run this one in cmd, not Git-Bash.
mklink /J "%USERPROFILE%\.claude\skills\cold-review" "%CD%\skills\cold-review"
```

Two things to know if you do. **On Windows use `mklink /J`** — under Git-Bash/MSYS, `ln -s` by default silently makes a *copy* instead of a link, so you would believe you were tracking the repo while holding a frozen snapshot. And remove a link with `rmdir` (Windows) or `unlink` (POSIX) — never `rm -rf` through it, or the delete descends into this repo. That's the hazard [`install.mjs`](install.mjs) refuses to touch, above.

**Other ways to fetch.**

- **[Vercel `skills` CLI](https://github.com/vercel-labs/skills)** — installs straight from GitHub, no manual clone:
  `npx skills add allemaar/open-skills --skill cold-review` (drop `--skill` for the whole pack, `--list` to see them first, `npx skills update` later). Two things this page owes you about it:
  - **Pass `--copy`.** Without it you may get symlinks — junctions on Windows — which is the tracking topology above, not the frozen copy this pack prefers. Which one you get depends on how, and on what, runs it: one agent dir copies; several prompt you, recommending symlink; `--yes`/`--all` takes symlink without asking, and so does any run it detects as agent-driven, which goes non-interactive even with no flags.
  - **Set `DISABLE_TELEMETRY` or `DO_NOT_TRACK`** if you'd rather not report usage to `add-skill.vercel.sh/t` — its `find` command sends your search query along with the event. (Those variables gate that endpoint; a separate audit lookup it performs at install time isn't gated by them.)
- **`git sparse-checkout`** set to `skills/cold-review` — one skill, without the full repo.

Every fetch above ends the same way: a skill folder in your runtime's `skills/` dir that you can open and read.

**For agents.** This pack is built to be installed *by* an agent, not just a human. Enumerate every skill from [`catalog.json`](catalog.json) (name, description, triggers, gates, per-skill install + validate commands), or read [`llms.txt`](llms.txt) for a dense manifest plus a step-by-step *"For agents — how to install"* recipe (detect runtime dir → copy the folder → validate its `protocol.yon`). Copy-default, no opaque installer — the install path is itself inspectable.

---

## Use it

A worked example with [`cold-review`](skills/cold-review/) — a skill that summons fresh-context agents to audit your work.

**1 — Read what it does.** [`SKILL.md`](skills/cold-review/SKILL.md) is plain language: *"Run outside-agent review of actual work artifacts against objectives, with classification, fresh reviewer lenses, evidence-based findings, scoring, and thresholds."*

**2 — Read what it's allowed to do.** [`protocol.yon`](skills/cold-review/protocol.yon) names every gate. You can see, before running anything, that the skill *aborts* rather than inventing a review out of thin air:

```yon
@STEP rid=step:establish | n:int=1 | op=std:ai.prompt@v1 | args=[task="Identify the work assessed, objectives, constraints, available evidence."]
@CHECK rid=check:target-exists | assert="a concrete artifact exists to review" | fail=ABORT | msg="No concrete artifact. Stop and ask the user — do not review from vague memory."
@RULE rid=rule:max-three | lvl=MUST_NOT | when="sizing the reviewer pool" | then="spawn more than 3 reviewers without explicit user confirmation"
```

That's the trust model in three lines: a named gate (`check:target-exists`, `fail=ABORT`), a bounded fan-out (`rule:max-three`, `MUST_NOT`), and a provenance stamp — all readable, none of it arbitrary code.

**3 — Validate it yourself**, against the public YON parser — no install of mine required:

```bash
npx @younndai/yon-parser validate skills/cold-review/protocol.yon --profile exec
# ✓ protocol.yon: Valid
```

**4 — Run it.** In your agent:

```text
/cold-review the auth refactor on this branch
```

```text
Cold review — backend-code · 2 reviewers (Correctness, Security)
  Critical  0
  Major     1   token refresh races on concurrent requests  (auth/session.ts:88)
  Minor     2
  Score 82/100 — acceptable with concerns. Fix the Major before high-stakes use.
```

The skill classified the work, sized the reviewer pool, briefed fresh agents on evidence only, and handed back severity-tiered findings with file-level evidence, a score, and a verdict — exactly the contract its `protocol.yon` declares.

---

## Validate it yourself

Every `protocol.yon` validates against the public YON parser. The whole trust model is: the protocol is a declarative document you can parse, diff, and check — not arbitrary code you run on faith. Every skill's status is tracked in [`CONFORMANCE.md`](CONFORMANCE.md) and enforced in CI — the badge above is green only when all of them validate, alongside a cross-reference linter, a YON-DAG semantic check (dangling refs, unreachable steps), an orient value gate that rejects out-of-enum or fail-open orientation records the structural validator passes, and several more guards — leak scan, spine-sync, gate-fires, and the orient round-trip (the full list is in [`conformance.yml`](.github/workflows/conformance.yml)).

The edges of that promise are stated plainly in [`THREAT-MODEL.md`](THREAT-MODEL.md): a skill runs with your agent's permissions, so installing one is a supply-chain decision. Inspectability removes the excuse not to read. It does not remove the need to. Validation proves a protocol is well-formed, not that it is benign — so the workflow is **read, validate, diff on update.** That diff is one command, and it needs nothing from us: `git pull` in your clone, then

```bash
git diff --no-index -I '^(metadata:|  (github-|local-path))' ~/.claude/skills/cold-review skills/cold-review
```

Silence means identical. (The `-I` skips the `metadata:` provenance block `install.mjs` writes into your copy.) [`THREAT-MODEL.md`](THREAT-MODEL.md#audit-a-skill-before-you-install-it) has the whole workflow, including a loop for checking every skill you installed.

---

## Start here

Most skills are slash commands you invoke when you want them (`/cold-review …`); a couple — `orchestrate-mode`, `multi-agent-mode` — are persistent session modes, and several fire on their own when their trigger shows up. Each skill's `SKILL.md` says which. A few that pay off on their own, no setup:

| Skill | What it does |
|---|---|
| [`cold-review`](skills/cold-review/) | Summons fresh-context reviewer agents to audit your work — evidence-based findings, severity tiers, a score, and a verdict. |
| [`investigate`](skills/investigate/) | Read-only fact-gathering before you change anything — maps files, deps, and patterns. |
| [`orient-status`](skills/orient-status/) | A fresh "where are we" on any repo, plan, or task — position, what's left, and a banded ETA; `--resume` rebuilds context after a gap. |
| [`insight-angles`](skills/insight-angles/) | Points lenses at a subject to surface the frames, connections, and assumptions you can't see. |
| [`insight-cross-examine`](skills/insight-cross-examine/) | Routes a decision through angle-discovery → critique → assess → recommend, and hands back a decision surface. |
| [`plan-create`](skills/plan-create/) | A phased, gated implementation plan before any code is written. |
| [`improve-codebase-architecture`](skills/improve-codebase-architecture/) | Finds refactors that deepen shallow modules (Ousterhout's *A Philosophy of Software Design*). |
| [`ask-gate`](skills/ask-gate/) | Triages whether a question is really yours to answer before interrupting you — an enforced gate, firing. |
| [`prime-sweep`](skills/prime-sweep/) | Parallel sub-agents absorb a large source surface; only the vetted digest reaches your context. |
| [`yon-read`](skills/yon-read/) | Reads, interprets, and explains any YON you point it at — the protocols in this pack included. |
| [`yon-write`](skills/yon-write/) | Drafts and converts content into valid YON — the fastest way to author your own `protocol.yon`. |

Browse [`skills/`](skills/) for the full set of 51 — planning, insight & decision, [orientation](#the-orient--family), priming, orchestration, code & architecture, Obsidian/vault, web extraction, git, diff recap, and YON authoring.

---

## The orient- family

When you sit down to a repo, a plan, or a task and ask *"where are we?"* — that's orientation. The `orient-` skills answer it. Each spins up a bounded, read-only subagent, computes a fresh read, and hands back one ephemeral bundle — a structured YON record, a markdown read, and a small visual — then forgets it. Nothing is stored; every call recomputes from current reality.

| Skill | Asks | Hands back |
|---|---|---|
| [`orient-status`](skills/orient-status/) | where are we? | position, what's left, and a banded ETA; `--resume` rebuilds context after a gap |
| [`orient-map`](skills/orient-map/) | show me the shape | what changed since your last look, plus done → here → next as a path (or a tree on a branch) |
| [`orient-gaps`](skills/orient-gaps/) | what's stuck? | blockers, open forks, loose ends, and inferred silent gaps; `--audit` adds claim-vs-evidence disclosure |
| [`orient-roadmap`](skills/orient-roadmap/) | show me the roadmap | the increment arc (built → current → next), the gates, the next increment's clusters, and the runway of now → gated-next → future stages plus the deferred lanes |

All four emit slices of **one shared orientation record** — the record schema, the render contract, and the family rules live in [`orient-spec/`](orient-spec/), so the skills agree on shape without sharing code. On Claude Code the bundle also renders as a sparse visual widget; an information-complete ASCII twin is always emitted, so no runtime is left without the full read.

---

## Runs on YON

The `protocol.yon` files are written in [**YON**](https://github.com/YounndAI/yon) — a stream-first data format for AI-agent workflows, with a public [specification](https://github.com/YounndAI/yon-spec), conformance vectors, and an Apache-2.0 reference parser (`@younndai/yon-parser`). YON is what lets a skill's rules and gates be machine-checkable instead of merely described — data, intent, provenance, and thought in one readable stream.

**Read and write it yourself.** Two skills put YON directly in your agent's hands: [`yon-read`](skills/yon-read/) interprets and explains any YON content, and [`yon-write`](skills/yon-write/) drafts and converts content into valid YON. Together they are the shortest path from reading a `protocol.yon` to producing your own.

**Highlight it in your editor.** The whole pitch here is that you *read* the protocol before you trust it — so make the read easy. The official **YON extension** adds syntax highlighting, snippets, and language support for `.yon` files: install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=YounndAI.yon) or [Open VSX](https://open-vsx.org/extension/YounndAI/yon) (source: [yon-vscode](https://github.com/YounndAI/yon-vscode) · [yon-textmate](https://github.com/YounndAI/yon-textmate)).

---

## Contributing

A contribution here is a skill other people read before they run it. The bar is readable, honest, and — where it ships a protocol — machine-checkable. See [`CONTRIBUTING.md`](CONTRIBUTING.md). The project uses DCO sign-off, not a CLA. Found a vulnerability? [`SECURITY.md`](SECURITY.md) — never a public issue for a live one.

## License

Apache-2.0 — see [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE). Free to use, fork, and adapt.

A personal, independent project by **[Alexandru Mares](https://allemaar.com)** ([allemaar.com](https://allemaar.com)). It is not a YounndAI™ product; "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL.

---

<p align="center">
  Read the skills. Run the ones you trust.<br />
  <em>The whole design exists so that "trust" is something you earn by reading, not something you extend on faith.</em>
</p>
