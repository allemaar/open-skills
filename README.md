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
  <a href="#install">Install</a> · <a href="#use-it">Usage</a> · <a href="#validate-it-yourself">Validate</a> · <a href="skills/">Skills</a> · <a href="LICENSE">Apache 2.0</a> · <a href="https://allemaar.com">allemaar.com</a>
</p>

<p align="center">
  <a href="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml"><img alt="YON conformance" src="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" /></a>
  <a href="https://github.com/YounndAI/yon"><img alt="Runs on YON" src="https://img.shields.io/badge/runs%20on-YON-7c3aed.svg" /></a>
</p>

---

A skill is instructions your agent runs with your machine's access. These you can read before you trust them — each is a Markdown doc plus a declarative YON protocol you validate yourself.

This is a pack of reusable skills for AI coding agents (Claude Code, Codex, and any runtime that reads the open Agent Skills format). They're the skills I run my own agents on — review, planning, priming, deliberation — published so you can read every line before you trust them. It's a living set: I add skills here as I build the ones I need.

## The idea: two files per skill

Each skill is a folder under [`skills/`](skills/) with up to two files:

| File | For whom | What it carries |
|---|---|---|
| **`SKILL.md`** | human + agent | what the skill does and when to use it, in plain language |
| **`protocol.yon`** | the runtime | the same skill's steps, rules, and gates as a **declarative protocol** it can enforce and *you* can audit |

Markdown explains the skill. **YON makes it inspectable and enforceable** — the control flow, the rules (`MUST` / `MUST_NOT`), and the gates (`ABORT` / `WARN`) are named, typed objects, not prose you hope the model follows. Of the 48 skills here, **34 ship a `protocol.yon`**; 14 are Markdown-only.

"Enforceable" is a claim you can check: [`GATE-FIRES.md`](GATE-FIRES.md) shows the public parser and the semantic linter *rejecting* deliberately-broken skills — regenerated in CI on every push, so it can't be staged.

---

## Install

No build step, no dependency on me. Clone the repo and copy the skill folders your agent reads — a frozen copy is the default, and the safest:

```bash
git clone https://github.com/allemaar/open-skills
cd open-skills

# Copy a skill into your runtime's skills dir (default)
cp -r skills/cold-review ~/.claude/skills/cold-review     # Claude Code
cp -r skills/cold-review ~/.codex/skills/cold-review      # Codex
cp -r skills/cold-review ~/.agents/skills/cold-review     # generic

# Windows
xcopy /E /I skills\cold-review "%USERPROFILE%\.claude\skills\cold-review"
```

Prefer one command? [`install.mjs`](install.mjs) does the same thing — read the catalog, copy the folder, validate its `protocol.yon` — and nothing else. It is a single zero-dependency Node file you can read in one screen before you run it:

```bash
node install.mjs cold-review     # one skill
node install.mjs --all           # the whole pack
node install.mjs --list          # see what's installable
```

It copies (never symlinks), skips an already-installed skill unless you pass `--force`, and — true to the wedge — *refuses* to overwrite a symlinked or junctioned skill rather than delete through the link into the repo. The installer is itself inspectable; read it first.

Want a skill to track the repo as you pull updates? Symlink instead of copying — POSIX `ln -s "$PWD/skills/cold-review" ~/.claude/skills/cold-review`, or a Windows junction `cmd /c mklink /J "%USERPROFILE%\.claude\skills\cold-review" "%CD%\skills\cold-review"`. One caveat worth knowing: a symlinked/junctioned skill dir means a recursive delete of your skills folder can traverse the link into this repo — copies don't have that edge.

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

Every `protocol.yon` validates against the public YON parser. The whole trust model is: the protocol is a declarative document you can parse, diff, and check — not arbitrary code you run on faith. Every skill's status is tracked in [`CONFORMANCE.md`](CONFORMANCE.md) and enforced in CI — the badge above is green only when all of them validate, alongside a cross-reference linter and a YON-DAG semantic check (dangling refs, unreachable steps).

The edges of that promise are stated plainly in [`THREAT-MODEL.md`](THREAT-MODEL.md): a skill runs with your agent's permissions, so installing one is a supply-chain decision. Inspectability removes the excuse not to read. It does not remove the need to. Validation proves a protocol is well-formed, not that it is benign — so the workflow is **read, validate, diff on update.**

---

## Start here

A few skills that pay off on their own, no setup:

| Skill | What it does |
|---|---|
| [`cold-review`](skills/cold-review/) | Summons fresh-context reviewer agents to audit your work — evidence-based findings, severity tiers, a score, and a verdict. |
| [`investigate`](skills/investigate/) | Read-only fact-gathering before you change anything — maps files, deps, and patterns. |
| [`insight-angles`](skills/insight-angles/) | Points lenses at a subject to surface the frames, connections, and assumptions you can't see. |
| [`insight-cross-examine`](skills/insight-cross-examine/) | Routes a decision through angle-discovery → critique → assess → recommend, and hands back a decision surface. |
| [`plan-create`](skills/plan-create/) | A phased, gated implementation plan before any code is written. |
| [`improve-codebase-architecture`](skills/improve-codebase-architecture/) | Finds refactors that deepen shallow modules (Ousterhout's *A Philosophy of Software Design*). |
| [`ask-gate`](skills/ask-gate/) | Triages whether a question is really yours to answer before interrupting you — an enforced gate, firing. |
| [`prime-sweep`](skills/prime-sweep/) | Parallel sub-agents absorb a large source surface; only the vetted digest reaches your context. |
| [`yon-read`](skills/yon-read/) | Reads, interprets, and explains any YON you point it at — the protocols in this pack included. |
| [`yon-write`](skills/yon-write/) | Drafts and converts content into valid YON — the fastest way to author your own `protocol.yon`. |

Browse [`skills/`](skills/) for the full set of 48 — planning, insight & decision, priming, orchestration, code & architecture, Obsidian/vault, web extraction, git, and YON authoring.

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
