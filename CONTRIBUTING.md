# Contributing to open-skills

A contribution here is a skill other people will read before they run it. The bar is the same one the repo sets for itself: readable, honest, and — where it ships a protocol — machine-checkable. This guide states how to meet it.

This is a personal, independent project by Alexandru Mares, licensed under Apache-2.0. It is not a YounndAI™ product. Contributions are welcome under the terms below.

## How contributions are licensed

This project uses the **Developer Certificate of Origin (DCO)**, not a Contributor License Agreement. The DCO is a lightweight, sign-off-based affirmation — no separate paperwork, no account, no signing bot.

By adding a `Signed-off-by` line to your commits, you certify the [DCO 1.1](https://developercertificate.org/): that you wrote the contribution or have the right to submit it, and that you agree to license it under this project's Apache-2.0 license.

Sign off by committing with `-s`:

```bash
git commit -s -m "Add the <name> skill"
```

This appends a line that must match your real name and email:

```
Signed-off-by: Your Name <you@example.com>
```

Pull requests whose commits are not signed off will be asked to amend before merge.

## What a good skill looks like

- **A folder under `skills/`** named for the skill, matching its `name` field.
- **`SKILL.md`** — what it does and when to use it, in plain language, in the [institutional voice the repo uses](README.md): state the thing before the feeling, quantify with baselines, disclose trade-offs, no hype words.
- **`protocol.yon`** (encouraged) — the same skill's steps, rules (`MUST` / `MUST_NOT`), and gates (`ABORT` / `WARN`) as a declarative protocol. This is what makes a skill auditable rather than merely described. A skill that carries one moves the whole pack's promise forward.
- **No personal data.** No vault paths, machine paths, private cross-references, real names, or credentials. Use placeholders (`<vault>`, `<skills-repo>`). This is a hard gate — see [SECURITY.md](SECURITY.md) and [THREAT-MODEL.md](THREAT-MODEL.md).

## Front-matter contract

A skill's `SKILL.md` front-matter is the auditable root that the machine-discovery surfaces (catalog, agent index) are generated from, so it follows a small contract. `tools/lint.mjs` enforces it.

| Field | Status | Notes |
|---|---|---|
| `name` | **required** | Must match the folder name. |
| `description` | **required** | One paragraph: what it does, when to use it, and the trigger phrases (in the repo's voice). |
| `visibility` | **required** | `public` for anything in this repo. |
| `triggers` | **required** (empty list ok) | A YAML list of the literal phrases that should activate the skill — the slash command plus the natural-language phrasings. Lifted out of `description` so a catalog can index them. Use `[]` only if the skill genuinely has no invocation phrase. |
| `next-skills` | **required** (empty list ok) | A YAML list of `- skill: / phrase: / why:` successors a caller might run next. `[]` if there is no natural successor. Every `skill:` must resolve to a `skills/<name>` folder. |
| `caller-options`, `runtime`, `self-improvable`, `disable-model-invocation` | optional | Include only when they apply. |

```yaml
---
name: cold-review
description: >
  Run outside-agent review of work artifacts ... Trigger on /cold-review, "cold review this", ...
visibility: public
triggers:
  - "/cold-review"
  - "cold review this"
  - "get outside review"
next-skills:
  - skill: verify
    phrase: "/verify"
    why: "Gate the work formally once review findings are addressed"
---
```

All five fields are **required** and **fail** the lint (and CI) if absent — `triggers` and `next-skills` may be an empty list (`[]`) but the key must be present. The catalog, agent manifest, and recommendation graph are generated from this contract, so a missing field would make them lie.

## Checklist before you open a PR

- [ ] Commits are signed off (`git commit -s`)
- [ ] The skill folder name matches the `name` field
- [ ] Front-matter meets the contract above (`name`/`description`/`visibility` required; `triggers` + `next-skills` present-or-empty) — `node tools/lint.mjs` shows no new warnings for your skill
- [ ] `SKILL.md` reads in the repo's voice and is honest about limits
- [ ] If a `protocol.yon` is included, it validates:
      `npx @younndai/yon-parser validate skills/<name>/protocol.yon --profile exec`
- [ ] No personal or machine-specific data anywhere in the contribution
- [ ] Conformance stays green — your change does not break [CONFORMANCE.md](CONFORMANCE.md) or the CI check
- [ ] Trademark indicators (™) on first prominent use of a YON or YounndAI mark in any new prose

## Conformance is the gate

Every `protocol.yon` is validated in CI on every push. The badge is green only when all of them validate. A contribution that adds or edits a protocol must leave the board green. Conformance is the property that lets a reader trust the pack without trusting you.

## Code of conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). By contributing, you agree to its terms. Be precise, be respectful, never defensive.

## Trademarks

"YON" and "YounndAI" are trademarks of MARLINK TRADING SRL. This project uses the public, openly licensed YON format and tooling; it does not claim those marks. Acknowledge them with ™ on first prominent use, and do not imply endorsement or affiliation. See [NOTICE](NOTICE).

## Questions

- General questions: open a [Discussion](https://github.com/allemaar/open-skills/discussions).
- Security concerns: see [SECURITY.md](SECURITY.md) — never a public issue for a live vulnerability.

---

A skill earns its place by what it does for a reader who has never met you. Write it for that reader.
