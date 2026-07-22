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
  <a href="#install">Install</a> · <a href="#updating">Update</a> · <a href="#use-it">Usage</a> · <a href="#validate-it-yourself">Validate</a> · <a href="skills/">Skills</a> · <a href="#the-orient--family">Orient</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="LICENSE">Apache 2.0</a> · <a href="https://allemaar.com">allemaar.com</a>
</p>

<p align="center">
  <a href="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml"><img alt="YON conformance" src="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" /></a>
  <a href="https://github.com/YounndAI/yon"><img alt="Runs on YON" src="https://img.shields.io/badge/runs%20on-YON-7c3aed.svg" /></a>
</p>

---

## Why this exists

A skill is instructions your agent runs with your machine's access: you hand a document to something that can touch your files. So the rule here is that you should be able to **read a skill before you trust it** — each is a Markdown doc, and 39 of the 57 also ship a declarative YON protocol you validate yourself.

These are reusable skills you can run your own agents on — Claude Code, Codex, and any runtime that reads the open Agent Skills format: review, planning, priming, deliberation. Each exists because a problem showed up in real work, showed up again, and was worth solving once instead of re-prompting around it every time.

**In daily use and evolution for over 18 months.** Precisely: not all 57 skills are that old. Some are at least that old; others were designed along the way, as the work demanded them. That is the author's own account, not a number you can verify from here. What's published is the working set, not a demo, and it keeps growing.

**Composable, not a framework.** Install one or install fifty — each is its own decision, and your agent keeps room to think between them. Take what earns its place.

They also cooperate. A few skills cite companion protocols — `caller-options`, `human-output`, `self-improve` — so the pack behaves most fully with those present. Add the companions when you want the fuller behaviour.

---

## The idea: two files per skill

Each skill is a folder under [`skills/`](skills/) with up to two files:

| File | For whom | What it carries |
|---|---|---|
| **`SKILL.md`** | human + agent | what the skill does and when to use it, in plain language |
| **`protocol.yon`** | the runtime | the same skill's steps, rules, and gates as a **declarative protocol** you can read, diff, and validate before anything runs |

Markdown explains the skill. **YON makes it inspectable** — control flow, steps, rules (`MUST` / `MUST_NOT`) and gates (`ABORT` / `WARN`) are named, typed, declared objects, not instructions buried in a paragraph. Read them, diff them between versions, validate them mechanically before you run anything — and [`GATE-FIRES.md`](GATE-FIRES.md) lets you check that the validator actually rejects broken ones, rather than taking anyone's word for it. Of the 57 skills here, **39 ship a `protocol.yon`**; 18 are Markdown-only.

**Now the limit, stated plainly, because you would find it yourself and rightly distrust everything else on this page.** There is no runtime interpreter standing over the model mid-run, policing each declared step as it executes. The runtimes named above read `SKILL.md`. The checking here is author-side and CI-side — the conformance workflow and [`GATE-FIRES.md`](GATE-FIRES.md) — plus the one validate command you run yourself, below.

What remains is not small. A declared gate is a named object with a type and a failure mode: auditable, diffable, mechanically checkable before you install anything. A paragraph of prose is none of those three. You see a skill's abort conditions and `MUST_NOT` bounds without running it, and see exactly what changed when you pull.

---

## Validate it yourself

Every `protocol.yon` validates against the public YON parser — nothing of the author's is in the loop:

```bash
npx @younndai/yon-parser validate skills/cold-review/protocol.yon --profile exec
# ✓ skills/cold-review/protocol.yon: Valid
```

That line is the whole trust model: the protocol is a declarative document you can parse, diff, and check — not arbitrary code you run on faith. Every skill's status is tracked in [`CONFORMANCE.md`](CONFORMANCE.md) and enforced in CI — the badge above is green only when all of them validate, alongside a cross-reference linter, a YON-DAG semantic check (dangling refs, unreachable steps), an orient value gate that rejects out-of-enum or fail-open orientation records the structural validator passes, and more guards — leak scan, spine-sync, gate-fires, orient round-trip (full list in [`conformance.yml`](.github/workflows/conformance.yml)). That orient value gate is the flavour of the list: a check that passes when it shouldn't is worse than no check at all.

The edges of that promise are in [`THREAT-MODEL.md`](THREAT-MODEL.md): a skill runs with your agent's permissions, so installing one is a supply-chain decision. Inspectability removes the excuse not to read. It does not remove the need to. Validation proves a protocol is well-formed, not that it is benign — a well-formed protocol can still declare something you would never allow on your machine, and only a reader catches that. So the workflow is **read, validate, diff on update.** That diff is one command and needs nothing from us — see [Updating](#updating).

---

## Start here

Most skills are slash commands you invoke when you want them (`/cold-review …`); a couple — `orchestrate-mode`, `multi-agent-mode` — are persistent session modes, and several fire on their own when their trigger shows up. Each `SKILL.md` says which, so you never guess what is running behind you.

**Something to type first.** Once a skill is installed, first value looks like this:

```text
/cold-review this branch before I open the PR
/investigate how auth is wired in this repo
/orient-status where are we on this?
/agent-mailbox Mailbox: ./shared-folder/mailbox
```

Installed through the plugin marketplace? Same prompts, namespaced — `/open-skills:cold-review …`.

A few that pay off on their own, no setup:

| Skill | What it does |
|---|---|
| [`cold-review`](skills/cold-review/) | Summons fresh-context reviewer agents to audit your work — evidence-based findings, severity tiers, a score, and a verdict. |
| [`agent-mailbox`](skills/agent-mailbox/) | Lets two or more agents — any harness, any vendor — collaborate through any shared folder: share a folder, load the skill, point at it. |
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

Browse [`skills/`](skills/) for the full set of 57 — planning, insight & decision, [orientation](#the-orient--family), [writing for a reader](#the-human--family), priming, orchestration, code & architecture, Obsidian/vault, web extraction, git, diff recap, and YON authoring.

### New: [`agent-mailbox`](skills/agent-mailbox/) — agents collaborate through any folder that syncs

Agent Mailbox lets agents coordinate through a folder that already syncs. It requires no mailbox server, daemon, database, SDK, or vendor agent protocol. It is OS- and runtime-neutral wherever the participants can safely read and write the shared Markdown files. Local folders, Git, free **Lyt (Link Your Think™)** vaults, and sync-share folders such as OneDrive are first-class routes. Background notification and task wake depend on the host runtime.

Two or more agents, **any harness, any vendor**, exchange append-only Markdown messages the Handler can read. In Obsidian, causal wikilinks make the collaboration walkable as a graph. Lyt is a real, working, free product: agents can talk over a registered Lyt vault using scoped Lyt synchronization and exact inbox reconciliation. OneDrive is a working sync-share route; the protocol keeps provider materialization, file detection, message consumption, runtime wake, and re-arm as separate claims.

The mandatory CORE/FULL protocol remains complete on its own. Optional operating packages load lazily after the handshake: a bounded Collab Window for Work-or-Listen, native Scheduled Collab when the runtime can prove a bounded scheduler, and mandatory missed-message recovery when detection or cursor evidence contradicts readiness. A package failure blocks only that capability; the base collaboration stays usable.

Every valid addressed message is a call to action with a durable disposition, including an explicit `no-reply-required` outcome when wire silence is correct. The consumed-UUID cursor is a compact checkpoint, not sole proof of handling. Reported misses revoke `LISTENING`, quarantine ambiguous history, and require evidence-backed recovery before readiness returns.

The manual is still one line: **share a folder, load the skill, point at it.** The skill can recommend Collab Window when the task genuinely needs continuity, but it does not nag after an explicit mode choice and it never turns “non-stop” into an infinite loop.

Evidence ships with it, deliberately split. [`VALIDATION.md`](skills/agent-mailbox/references/VALIDATION.md) records bounded local, Git, Lyt, OneDrive, and cursor-integrity findings with capability-specific conclusions; [`CONNECTION-GUIDES.md`](skills/agent-mailbox/references/CONNECTION-GUIDES.md) explains each route and the honest fallback. One bounded OneDrive case demonstrated cross-machine materialization, but did not establish a provider latency guarantee or autonomous task wake.

---

## Use it

A worked example with [`cold-review`](skills/cold-review/). Four steps, and the first two happen before anything runs.

**1 — Read what it does.** [`SKILL.md`](skills/cold-review/SKILL.md), in plain language: *"Run outside-agent review of actual work artifacts against objectives, with classification, fresh reviewer lenses, evidence-based findings, scoring, and thresholds."*

**2 — Read what it declares.** [`protocol.yon`](skills/cold-review/protocol.yon) names every gate. Before running anything, you see that the skill declares an *abort* rather than inventing a review out of thin air — a confident review of nothing is the worst thing a reviewer agent can hand you:

```yon
@STEP rid=step:establish | n:int=1 | op=std:ai.prompt@v1 | args=[task="Identify the work assessed, objectives, constraints, available evidence."]
@CHECK rid=check:target-exists | assert="a concrete artifact exists to review" | fail=ABORT | msg="No concrete artifact. Stop and ask the user — do not review from vague memory."
@RULE rid=rule:max-three | lvl=MUST_NOT | when="sizing the reviewer pool" | then="spawn more than 3 reviewers without explicit user confirmation"
```

That's the trust model in three lines: a named gate (`check:target-exists`, `fail=ABORT`), a bounded fan-out (`rule:max-three`, `MUST_NOT`) so a review isn't meant to become a swarm of agents on your machine, and a provenance stamp — all readable, none of it arbitrary code.

**3 — Validate it yourself** against the public YON parser — no third-party install required. Command in [Validate it yourself](#validate-it-yourself) above.

**4 — Run it.** In your agent:

```text
/cold-review the auth refactor on this branch
```

An illustrative example of the shape that comes back — not a measured result, and not a benchmark:

```text
Cold review — backend-code · 2 reviewers (Correctness, Security)
  Critical  0
  Major     1   token refresh races on concurrent requests  (auth/session.ts:88)
  Minor     2
  Score 82/100 — acceptable with concerns. Fix the Major before high-stakes use.
```

Classify the work, size the reviewer pool, brief fresh agents on evidence only, hand back severity-tiered findings with file-level evidence, a score, and a verdict — that is the contract its `protocol.yon` declares, which is why step 2 pays: you know the shape of the answer before you ask.

---

## Install

**Two paths, separated by when you get to read.** These run with your access — so read the ones you'll lean on.

| Path | What you get | The trade |
|---|---|---|
| **[Clone and copy](#read-first--clone-and-copy-any-runtime)** · *the default* | a frozen copy you read before it runs | updating is manual: `git pull` → diff → re-copy |
| **[Plugin marketplace](#fastest-on-claude-code--the-plugin-marketplace)** · Claude Code | the pack working, in one line | you read the skills after they're installed, not before |

Everything else here is a variant of those two — [one command](#read-first--clone-and-copy-any-runtime) instead of `cp`, [a different fetcher](#other-ways-to-fetch), or [tracking the repo](#read-first--clone-and-copy-any-runtime) instead of freezing it.

### Read-first — clone and copy (any runtime)

**The default the pack is built around.** No build step, no dependency on anyone else: if this repo vanished tomorrow, your copy keeps working exactly as you read it. Clone, then copy the skill folders your agent reads:

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

**Pick the dir your agent reads — one, not all three.** Claude Code reads `~/.claude/skills` and only that, never `~/.agents/skills`. On Codex use `~/.agents/skills` — the current location, read by other runtimes too; the older `~/.codex/skills` still works if you're already there. Most other tools have their own — Cursor `~/.cursor/skills`, Copilot `~/.copilot/skills` — so check yours rather than assuming `~/.agents/skills` is universal.

Prefer one command? [`install.mjs`](install.mjs) does nearly the same — read the catalog, copy the folder, validate its `protocol.yon` — plus one edit `cp` doesn't make: it stamps the copy's `SKILL.md` with a `metadata:` block recording the repo, ref, and tree SHA it came from, so you can answer later, "is what I'm running still what I read?". The price is real: the installed file is not byte-identical to this repo's. `--no-stamp` turns it off, and [`THREAT-MODEL.md`](THREAT-MODEL.md#what-open-skills-does-about-it) explains the trade. A single zero-dependency Node file you can read before you run it:

```bash
node install.mjs cold-review                    # one skill
node install.mjs --runtime claude cold-review   # into one dir only
node install.mjs --all                          # the whole pack
node install.mjs --list                         # see what's installable
```

By default it copies into **every** skills dir it finds — pass `--runtime claude|codex|agents` to target just one.

It copies (never symlinks), skips an already-installed skill unless you pass `--force`, and *refuses* to overwrite a symlinked or junctioned skill rather than delete through the link into the repo. Read it first.

**Want a skill to track the repo as you pull?** That means symlinking into this clone — the one setup this pack argues against. A `git pull` then silently changes the instructions your agent runs, with no moment where you read the diff: you'd be trusting a version that did not exist when you decided to trust it. That's the drift [`THREAT-MODEL.md`](THREAT-MODEL.md) names, and why copying is the default. If you want it anyway — you maintain the pack, or you read every pull — link deliberately:

```bash
# POSIX — target first, then the link
ln -s "$PWD/skills/cold-review" ~/.claude/skills/cold-review

# Windows — link first, then the target. Run this one in cmd, not Git-Bash.
mklink /J "%USERPROFILE%\.claude\skills\cold-review" "%CD%\skills\cold-review"
```

Two things to know if you do, and both fail quietly. **On Windows use `mklink /J`** — under Git-Bash/MSYS, `ln -s` by default silently makes a *copy* instead of a link, so you'd believe you were tracking the repo while holding a frozen snapshot, with nothing to tell you otherwise. And remove a link with `rmdir` (Windows) or `unlink` (POSIX) — never `rm -rf` through it, or the delete descends into this repo and takes the clone with it. That's the hazard [`install.mjs`](install.mjs) refuses to touch, above.

### Fastest on Claude Code — the plugin marketplace

```text
/plugin marketplace add allemaar/open-skills
/plugin install open-skills@open-skills
```

This registers the repo as a Claude Code plugin marketplace and installs the pack (plugin and marketplace are both named `open-skills`, hence `open-skills@open-skills`); the skills are then namespaced (`/open-skills:cold-review`, `/open-skills:investigate`, …). Update in place with `/plugin marketplace update open-skills`.

### Other ways to fetch

You don't need these — both paths above are complete. They're here because people ask.

**[Vercel `skills` CLI](https://github.com/vercel-labs/skills)** — installs straight from GitHub, no manual clone:

```bash
npx skills add allemaar/open-skills --skill cold-review
```

Drop `--skill` for the whole pack, `--list` to see them first, `npx skills update` later. Two things this page owes you, because the alternative is you discovering them on your own machine:

**1. Pass `--copy`.** Without it you may get symlinks — junctions on Windows — which is [the tracking topology above](#read-first--clone-and-copy-any-runtime), not the frozen copy this pack prefers. Which one you get is one composite condition, not a menu: it turns on the number of unique agent dirs in play, and the flags and scope you ran it with. One agent dir copies; several prompt you, recommending symlink; `--yes`/`--all` takes symlink without asking, and so does any run it detects as agent-driven, which goes non-interactive even with no flags — agent detection feeds that dir count rather than setting the mode itself. [`DISTRIBUTION.md`](DISTRIBUTION.md) cites the vendor source.

**2. Set `DISABLE_TELEMETRY` or `DO_NOT_TRACK`** if you'd rather not report usage to `add-skill.vercel.sh/t` — its `find` command sends your search query along with the event. Those variables gate that endpoint; a separate audit lookup it performs at install time isn't gated by them.

**`git sparse-checkout`** — set to `skills/cold-review` for one skill, without the full repo.

Every fetch that copies ends the same way, and that's the point: a skill folder in your runtime's `skills/` dir that you can open and read.

### Updating

| How you got it | How you update |
|---|---|
| **Plugin marketplace** | `/plugin marketplace update open-skills` |
| **`cp -r` or `install.mjs`** | `git pull` in your clone → **diff** (below) → re-copy, or `node install.mjs --force <skill>` |
| **Vercel `skills` CLI** | `npx skills update` |
| **Symlinked (any source)** | Nothing to do — it updated when you pulled. No diff moment; [that's the trade](#read-first--clone-and-copy-any-runtime) |

If you copied, your skill is frozen until you re-copy it — and that re-copy is your one moment to read what you're accepting. Skip the read and the freeze bought you nothing. So diff first, from your clone:

```bash
# copied with cp -r — a plain diff, nothing to skip:
git diff --no-index ~/.claude/skills/cold-review skills/cold-review

# copied with install.mjs — it stamped a provenance block (repo, ref, tree SHA) into
# your copy, so skip those lines: they are expected, not drift:
git diff --no-index -I '^(metadata:|  (github-|local-path))' \
  ~/.claude/skills/cold-review skills/cold-review
```

Know what `-I` costs you: it also hides a `metadata:` block appearing *upstream*, and that block is an unsigned claim other tooling acts on ([why that matters](THREAT-MODEL.md#the-attack-surface)). No skill in this repo ships one, and `install.mjs` prints a note if it ever finds one instead of stamping — treat that note as a reason to look. Drop the `-I` to see everything.

Silence means identical; anything printed is behavior you have not read yet. Check each dir you installed into — `install.mjs` copies into every one it finds unless you passed `--runtime`, and the copy you forgot about is the one that surprises you. To sweep everything at once:

```bash
for d in ~/.claude/skills/*/; do n=$(basename "$d"); [ -d "skills/$n" ] &&
  git diff --no-index -I '^(metadata:|  (github-|local-path))' "$d" "skills/$n"; done
```

[`THREAT-MODEL.md`](THREAT-MODEL.md#audit-a-skill-before-you-install-it) has the full audit workflow, and what `gh skill` can and cannot tell you.

### For agents

This pack installs *by* agent as readily as by hand, and is as legible to the agent doing the install as to the person who'll live with the result. Enumerate every skill from [`catalog.json`](catalog.json) (name, description, triggers, gates, per-skill install + validate commands), or read [`llms.txt`](llms.txt) for a dense manifest plus a step-by-step *"For agents — how to install"* recipe (detect runtime dir → copy the folder → validate its `protocol.yon`). Copy-default, no opaque installer — the install path is itself inspectable.

---

## The orient- family

Orientation is the *"where are we?"* question — the one you ask most often and the one your notes answer worst, because notes go stale and the repo doesn't. The `orient-` skills answer it from current reality. Each spins up a bounded, read-only subagent, computes a fresh read, and hands back one ephemeral bundle — a structured YON record, a markdown read, and a small visual — then forgets it. Nothing is stored, so there's no cached answer sitting around being quietly wrong.

| Skill | Asks | Hands back |
|---|---|---|
| [`orient-status`](skills/orient-status/) | where are we? | position, what's left, and a banded ETA; `--resume` rebuilds context after a gap |
| [`orient-map`](skills/orient-map/) | show me the shape | what changed since your last look, plus done → here → next as a path (or a tree on a branch) |
| [`orient-gaps`](skills/orient-gaps/) | what's stuck? | blockers, open forks, loose ends, and inferred silent gaps; `--audit` adds claim-vs-evidence disclosure |
| [`orient-roadmap`](skills/orient-roadmap/) | show me the roadmap | the increment arc (built → current → next), the gates, the next increment's clusters, and the runway of now → gated-next → future stages plus the deferred lanes |

All four emit slices of **one shared orientation record** — schema, render contract, and family rules live in [`orient-spec/`](orient-spec/), so the four agree on shape without sharing code. On Claude Code the bundle also renders as a sparse visual widget; an information-complete ASCII twin is always emitted, so no runtime is left without the full read.

---

## The human- family

Agents write for readers who then have to decide, and the default output — long,
hedged, ordered by how the work happened, thick with shorthand — makes deciding
harder. You end up summarising what the agent should have summarised for you.

| Skill | Use it | Hands back |
|---|---|---|
| [`human-output`](skills/human-output/) | before writing | the contract: five rules you can police in fifteen seconds |
| [`human-rewrite`](skills/human-rewrite/) | "that was a wall of text" | the same claims, reordered so you can act — nothing dropped, nothing made more certain |
| [`human-draw`](skills/human-draw/) | "draw me a picture" | a figure in printable ASCII that survives copy-paste into any terminal |
| [`human-merge`](skills/human-merge/) | several reports piled up | one decidable surface, with what's superseded, what's double-counted, and what the reports say only together |

The contract is five rules: **verdict first, including anything that would
reverse it · say what it costs, not what it is · label every claim confirmed,
judgement or estimate · say what you did not check · no shorthand the reader
must decode.** Five, not twenty — a twenty-rule contract gets applied by
sampling, which is indistinguishable from not having one. Everything else is
a craft layer you consult while writing.

The shared doctrine, routing table, and checker contract live in
[`human-spec/`](human-spec/). [`tools/human-output-check.mjs`](tools/human-output-check.mjs)
grades the mechanical half in CI — acronyms expanded, one recommendation,
sentence length, ASCII inside fences, and whether a figure's bars are
proportional to their labels. It also states what it cannot check: **no script
verifies that a number in your prose traces to a number in your source.** That
needs a reader with the source in hand.

---

## Runs on YON

The `protocol.yon` files are written in [**YON**](https://github.com/YounndAI/yon) — a stream-first data format for AI-agent workflows, with a public [specification](https://github.com/YounndAI/yon-spec), conformance vectors, and an Apache-2.0 reference parser (`@younndai/yon-parser`). YON is what makes a skill's rules and gates machine-checkable instead of merely described — data, intent, provenance, and thought in one readable stream. Without it, "this skill has a gate" would be a claim you had to take on trust, the exact thing this pack tries to make unnecessary.

**Read and write it yourself.** [`yon-read`](skills/yon-read/) interprets and explains any YON content; [`yon-write`](skills/yon-write/) drafts and converts content into valid YON. Together they are the shortest path from reading a `protocol.yon` to producing your own.

**Highlight it in your editor.** An unhighlighted wall of pipes is a read people skip, and reading is the whole point. The official **YON extension** adds syntax highlighting, snippets, and language support for `.yon` files: install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=YounndAI.yon) or [Open VSX](https://open-vsx.org/extension/YounndAI/yon) (source: [yon-vscode](https://github.com/YounndAI/yon-vscode) · [yon-textmate](https://github.com/YounndAI/yon-textmate)).

---

## Contributing

A contribution here is a skill other people read before they run it — a higher bar than "it works on my machine", and the only one that makes sense for something that runs with a stranger's access. Readable, honest, and — where it ships a protocol — machine-checkable. See [`CONTRIBUTING.md`](CONTRIBUTING.md). DCO sign-off, not a CLA. Found a vulnerability? [`SECURITY.md`](SECURITY.md) — never a public issue for a live one.

## License

Apache-2.0 — see [`LICENSE`](LICENSE) and [`NOTICE`](NOTICE). Free to use, fork, and adapt.

## Who made this

**[Alexandru Mares](https://allemaar.com)** — [allemaar.com](https://allemaar.com).

Every skill here is his own design, refined through daily use and research over the span described at the top of this page. Frontier models were used heavily throughout — to research, to pressure-test, to dogfood these skills in the work they were built for — and that use is why they improved. It's stated here rather than left for you to infer, because a project whose whole argument is "read it before you trust it" does not get to be vague about how it was made. The thinking, the architecture, and the judgement about what belongs are his. A tool that helps you build something doesn't own it.

A personal, independent project. It is not a YounndAI™ product; "YON" and "YounndAI" are trademarks of MARLINK TRADING SRL.

Made by Alexandru Mares · [allemaar.com](https://allemaar.com)

---

<p align="center">
  Read the skills. Run the ones you trust.<br />
  <em>The whole design exists so that "trust" is something you earn by reading, not something you extend on faith.</em>
</p>
