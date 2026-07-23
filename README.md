<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/allemaar/open-skills/main/assets/allemaar-icon-ondark.png" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/allemaar/open-skills/main/assets/allemaar-icon-onlight.png" />
    <img alt="allemaar" src="https://raw.githubusercontent.com/allemaar/open-skills/main/assets/allemaar-icon-onlight.png" width="120" />
  </picture>
</p>

<p align="center">
  <strong>open-skills</strong><br />
  A personal, field-used pack of reusable skills for AI coding agents.<br />
  Every skill is readable Markdown; 39 of 57 also carry a declarative <strong>YON (YounndAI Object Notation™)</strong> protocol you can validate.<br />
  <em>Read before you trust.</em>
</p>

<p align="center">
  <a href="#start-with-the-work">Start</a> · <a href="SKILLS.md">Catalog</a> · <a href="#install">Install</a> · <a href="#agent-mailbox">Agent Mailbox</a> · <a href="#updating">Update</a> · <a href="CHANGELOG.md">Changelog</a> · <a href="https://github.com/allemaar/open-skills/discussions">Discussions</a> · <a href="LICENSE">Apache 2.0</a>
</p>

<p align="center">
  <a href="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml"><img alt="YON conformance" src="https://github.com/allemaar/open-skills/actions/workflows/conformance.yml/badge.svg" /></a>
  <a href="LICENSE"><img alt="License: Apache-2.0" src="https://img.shields.io/badge/license-Apache--2.0-blue.svg" /></a>
  <a href="https://github.com/YounndAI/yon"><img alt="Uses YON" src="https://img.shields.io/badge/uses-YON-7c3aed.svg" /></a>
</p>

---

## Why this exists

A skill is instructions handed to an agent that may be able to touch your files. My rule is simple: you should be able to **read a skill before you trust it**.

These skills came from repeated work with Claude Code, Codex, and other runtimes that read the open Agent Skills format: planning, investigation, review, writing, orchestration, priming, architecture, and knowledge work. Some have been in daily use and evolution for more than 18 months; others were added when the work demanded them. That is my account, not a benchmark. What is published here is the working set, not a demo.

**Composable, not a framework.** Install one or install fifty. Each skill is its own decision, and your agent keeps room to think between them. Take what earns its place.

## Start with the work

| I need to… | Start with | What it gives you |
|---|---|---|
| turn an objective into an executable plan | [`plan-create`](skills/plan-create/) | a phased plan with explicit gates and verification |
| establish facts before deciding | [`investigate`](skills/investigate/) | read-only evidence gathering with provenance and gaps |
| challenge work with fresh eyes | [`cold-review`](skills/cold-review/) | bounded outside review against actual artifacts |
| make a report easier to decide from | [`human-output`](skills/human-output/) | a writing contract built around verdict, consequence, evidence, and omissions |
| coordinate agents through a shared folder | [`agent-mailbox`](skills/agent-mailbox/) | traceable, append-only agent communication with Handler-readable state |

Throughout these docs, a skill's written command is its **folder name**
(`/insight-explore`, `/plan-phases`) — the portable form across runtimes. Shorter
phrases declared in frontmatter `triggers:` (/explore, /phase-plan) are
recognition aliases that some runtimes also honor.

The generated [`SKILLS.md`](SKILLS.md) catalog groups all 57 skills into twelve families. It is built from live `SKILL.md` metadata plus the pack's [`taxonomy.yon`](skills/skills-help/taxonomy.yon), so the human catalog and machine catalogs share one source rather than parallel hand-maintained menus.

Inside an agent, `/skills-help` reads that same bundled taxonomy and the skills actually installed beside it. Unknown third-party skills remain visible under `Unclassified`; they are not guessed into one of this pack's families.

## What is inspectable, and what is not enforced

Each skill folder carries its core instructions and required runtime companions.
Optional sibling skills and repository-only release checks are declared separately
and do not block the core skill when absent. Thirty-nine procedural skills also carry
`protocol.yon`, a declarative companion that names steps, rules (`MUST` /
`MUST_NOT`), and gates (`ABORT` / `WARN`) as typed records.

That distinction matters:

| Surface | What it proves |
|---|---|
| `SKILL.md` | the operational instructions the agent is being asked to follow |
| `protocol.yon` | an inspectable, diffable declaration of the intended protocol |
| parser validation | that the declaration is structurally valid for its profile |
| CI checks | only the specific syntax, reference, dataflow, catalog, count, and privacy properties they inspect |

There is no interpreter standing over the model and forcing runtime obedience. A valid protocol may still describe something harmful. Validation narrows what you must inspect; it does not replace inspection, sandbox the agent, or make the behavior safe.

Validate a protocol yourself with the separately published Apache-2.0 reference parser created by Alexandru Mares:

```bash
npx -y @younndai/yon-parser@2 validate \
  skills/cold-review/protocol.yon --profile exec
```

The `npx` command may download and execute that package. Inspect the package or install it through a route you trust before relying on it. The exact trust boundaries, including what validation cannot establish, are in [`THREAT-MODEL.md`](THREAT-MODEL.md); current structural results are in [`CONFORMANCE.md`](CONFORMANCE.md).

## Install

The safest first path is a frozen copy: read the source, copy only the skills you want, and diff before updating.

```bash
git clone https://github.com/allemaar/open-skills
cd open-skills

# POSIX shell. Set exactly one directory your runtime actually reads.
# The subshell keeps a failed preflight from closing an interactive terminal.
(
  set -eu
  SKILLS_DIR="$HOME/.claude/skills"
  SRC="skills/cold-review"
  DEST="$SKILLS_DIR/cold-review"

  probe="$DEST"
  while [ "$probe" != "/" ]; do
    [ ! -L "$probe" ] || { echo "link in destination chain: $probe"; exit 1; }
    probe=$(dirname "$probe")
  done
  [ ! -e "$DEST" ] || { echo "already installed — diff before replacing"; exit 1; }
  cp -r "$SRC" "$DEST"
)
```

The directories are not interchangeable. Claude Code reads `~/.claude/skills`; current Codex installations can use `~/.agents/skills`; other tools may use their own directory. Establish the path your runtime reads and change `SKILLS_DIR` once. On Windows, prefer the installer below: it performs native link checks instead of relying on POSIX shell semantics.

### Optional installer

[`install.mjs`](install.mjs) is one readable Node file with zero local npm dependencies. It copies skill folders, can stamp their `SKILL.md` with an unsigned provenance note, and invokes `npx` for protocol validation unless you pass `--no-validate`.

```bash
node install.mjs cold-review
node install.mjs --runtime claude cold-review
node install.mjs --all
node install.mjs --list
```

Important boundaries:

- By default it targets every known skills directory that already exists. Use `--runtime claude|codex|agents` to narrow it.
- It refuses to overwrite an existing skill unless you pass `--force`.
- It refuses to overwrite a symlinked or junctioned skill rather than risk deleting through the link into its source.
- With `--force`, it stages and, unless `--no-validate` is supplied, validates the candidate before moving the existing copy aside, restores that copy if the swap fails, and surfaces crash leftovers for manual inspection.
- Its provenance stamp is an unsigned plain-text assertion, not a certificate, and makes the installed `SKILL.md` differ from this repository. `--no-stamp` preserves byte identity.
- The installer itself uses Node built-ins; validation may still fetch and execute `@younndai/yon-parser` through `npx`.

### Claude Code plugin

```text
/plugin marketplace add allemaar/open-skills
/plugin install open-skills@open-skills
```

This is the fastest Claude Code route, but it reverses the read-first order: installation happens before you inspect every skill. Use it only if that trade is acceptable.

Other distribution tools may also consume the repository, including `gh skill install allemaar/open-skills`. Their provenance metadata and update behavior belong to those tools. Review their prompts and resulting files rather than treating a source label as authenticated provenance.

**Telemetry:** the skills themselves contain no telemetry. The installer performs no analytics or reporting; its only optional network execution is parser validation through `npx`. Your agent runtime, plugin manager, package manager, Git host, or referenced external tool may have its own telemetry.

## Worked example: cold review

1. Read [`skills/cold-review/SKILL.md`](skills/cold-review/SKILL.md).
2. Inspect [`skills/cold-review/protocol.yon`](skills/cold-review/protocol.yon). It declares an abort when no concrete artifact exists and bounds reviewer fan-out.
3. Validate the declaration with the command above.
4. Run the skill in your agent:

```text
/cold-review the auth refactor on this branch
```

The useful property is not that YON makes the review happen. It is that you can see the intended gates and limits before you ask an agent to act, then diff those declarations when they change.

## Agent Mailbox

I use [`agent-mailbox`](skills/agent-mailbox/) in FULL mode when I want a traceable orchestration record between agents. It lets Claude Code and Codex agents exchange append-only Markdown calls to action through Handler-controlled folders, including local folders, OneDrive, free **Lyt (Link Your Think™)** vaults, and network shares.

```text
shared folder -> request -> durable disposition -> deliverable
```

That is a description of my current dogfooding, not a promise that every host can wake a stopped task or that every synchronization provider has the same latency. Work-or-Listen is participant-local and non-negotiated. The skill separates publication, local materialization, detection, full reconciliation, task wake, disposition, and re-arm because success in one layer does not prove the next.

The complete operating and security contract remains in the skill. Start with [`SKILL.md`](skills/agent-mailbox/SKILL.md), then use [`CONNECTION-GUIDES.md`](skills/agent-mailbox/references/CONNECTION-GUIDES.md) for transport/runtime adapters and [`VALIDATION.md`](skills/agent-mailbox/references/VALIDATION.md) for measured, observed, design-validated, and still-pending evidence. No watcher, daemon, SDK, or runtime dependency is shipped.

## Two headliner families

### Orientation

The `orient-` family answers “where are we?” from current repository evidence rather than cached notes:

- [`orient-status`](skills/orient-status/) — current position and banded estimate
- [`orient-map`](skills/orient-map/) — the shape and what changed
- [`orient-gaps`](skills/orient-gaps/) — blockers and missing evidence
- [`orient-roadmap`](skills/orient-roadmap/) — increment, gates, and runway

### Human output

The `human-` family treats presentation as part of correctness:

- [`human-output`](skills/human-output/) — write a decision-bearing result
- [`human-rewrite`](skills/human-rewrite/) — repair text without changing substance
- [`human-draw`](skills/human-draw/) — use a figure only when relationships need one
- [`human-merge`](skills/human-merge/) — combine several reports into one decision surface

The full breadth remains in [`SKILLS.md`](SKILLS.md).

## Updating

A copied skill is intentionally frozen. To update it, pull the repository, diff the installed folder against the candidate, read the change, then re-copy only after accepting it.

```bash
git pull
git diff --no-index ~/.claude/skills/cold-review skills/cold-review
```

Silence means byte-identical. Do not filter the diff unless you deliberately installed with the provenance stamp and understand exactly which lines you are excluding. A symlink is different: it makes every pull a live update, often without a separate review moment. That is useful while authoring your own skills and a poor default for running somebody else's.

Before updating, read [`CHANGELOG.md`](CHANGELOG.md). Skill folders can be renamed, references can change, and a new release can alter the trust surface even when the syntax remains valid.

## For agents and tooling

- [`catalog.yon`](catalog.yon) — YON-primary machine catalog
- [`catalog.json`](catalog.json) — JSON courtesy view
- [`llms.txt`](llms.txt) — dense install and discovery manifest
- [`skills.graph.yon`](skills.graph.yon) — next-skill recommendation graph
- [`SKILLS.md`](SKILLS.md) — generated human catalog

These are generated by [`tools/spine.mjs`](tools/spine.mjs) from live skill metadata, protocol facts, and the pack taxonomy. They are discovery surfaces, not runtime enforcement.

## YON and its parser

Alexandru Mares created YON and its Apache-2.0 reference parser. They are published separately in the YounndAI ecosystem, alongside the public [specification](https://github.com/YounndAI/yon-spec), [parser](https://www.npmjs.com/package/@younndai/yon-parser), and editor support ([VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=YounndAI.yon) · [Open VSX](https://open-vsx.org/extension/YounndAI/yon)).

[`yon-read`](skills/yon-read/) interprets existing YON. [`yon-write`](skills/yon-write/) authors it. Their presence in this personal pack does not transfer ownership of YON to open-skills or make open-skills a YounndAI product.

## Contributing and support

Read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a pull request. Commits require Developer Certificate of Origin sign-off, current skill metadata must remain complete, and public content must contain no personal paths, credentials, mailbox identifiers, or private operational evidence.

- General questions and examples: [GitHub Discussions](https://github.com/allemaar/open-skills/discussions)
- Bugs and feature requests: [GitHub Issues](https://github.com/allemaar/open-skills/issues)
- Vulnerabilities: [`SECURITY.md`](SECURITY.md), never a public issue for a live report

## License and project identity

Copyright 2026 Alexandru Mares (allemaar.com).

open-skills is licensed under the [Apache License, Version 2.0](LICENSE). See [`NOTICE`](NOTICE) for attribution and [`TRADEMARK.md`](TRADEMARK.md) for the separate trademark rules.

This is my personal project, separate from the YounndAI product portfolio. **YounndAI™**, **YounndAI Object Notation™**, and **Link Your Think™** are trademarks of MARLINK TRADING SRL. Their truthful mention here does not imply that open-skills is a YounndAI product.

---

Made by [Alexandru Mares](https://allemaar.com). Model-assisted, then reviewed, tested, and dogfooded in the work it describes.
