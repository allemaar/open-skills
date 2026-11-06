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

This is checked, not just asked: [`tools/dco-guard.mjs`](tools/dco-guard.mjs) runs in CI and fails the build if any non-merge commit after the enforcement floor lacks a sign-off. It grades the trailer's shape — that a `Signed-off-by:` trailer exists with a name and an email. It does not verify that the name is yours: the certification is still yours to mean. Two things worth knowing:

- **The sign-off goes in the last paragraph**, which is where `git commit -s` puts it. Git only reads trailers there, so a stray "PS:" paragraph after your sign-off will hide it and the check will say you have no sign-off.
- **If CI catches you**, `git commit --amend -s --no-edit` fixes the tip commit; `git rebase --signoff origin/main` fixes several at once. Then `git push --force-with-lease` to your branch.

The check is **forward-only**: it grades commits after the floor recorded in the guard, so the repo's own 7 unsigned commits do not fail it. They stay unsigned — rewriting published history to backfill them would cost more than it buys. On a pull request the check grades only your commits, so an unsigned commit on `main` can never be charged to you.

## What a good skill looks like

- **A folder under `skills/`** named for the skill, matching its `name` field.
- **`SKILL.md`** — explain what the skill does and when to use it, then state its procedure in plain language. A reader should not need to know the maintainer to follow it. The README is a personal account of using the collection; skill instructions remain direct and task-focused. State claims precisely, quantify only with a basis, disclose limits and avoid hype.
- **`protocol.yon`** (encouraged) — the same skill's steps, rules (`MUST` / `MUST_NOT`), and gates (`ABORT` / `WARN`) as a declarative, mechanically validatable protocol. It gives readers and tooling an inspectable contract; it does not enforce runtime obedience.
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
| `caller-options`, `runtime`, `self-improvable`, `disable-model-invocation`, `companions`, `updated` | optional | Include only when they apply. |

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

All five fields are **required** and **fail** the lint (and CI) if absent. `name`, `description`, and `visibility` must also be non-empty; repository skills must declare `visibility: public`. `triggers` and `next-skills` may be an empty list (`[]`) but the key must be present. The catalog, agent manifest, and recommendation graph are generated from this contract, so a missing or empty scalar would make them lie.

## Family taxonomy

Family membership is presentation metadata for this pack, not part of a skill's runtime-facing frontmatter. The canonical source is [`skills/skills-help/taxonomy.yon`](skills/skills-help/taxonomy.yon).

When adding a skill, add exactly one assignment to `SkillFamilies` using an existing family. Add or rename a family only as an explicit catalog-design change: update its ID, public label, aliases, and display order together. `tools/lint.mjs` and `tools/spine.mjs` fail closed on missing, duplicate, unknown, or orphan assignments. Individually installed third-party skills remain valid and appear under `Unclassified` in `/skills-help`; do not add them to this pack's taxonomy.

## Checklist before you open a PR

- [ ] Commits are signed off (`git commit -s`)
- [ ] The skill folder name matches the `name` field
- [ ] Front-matter meets the contract above (`name`/`description`/`visibility` required; `triggers` + `next-skills` present-or-empty) — `node tools/lint.mjs` shows no new warnings for your skill
- [ ] The skill has exactly one assignment in `skills/skills-help/taxonomy.yon`
- [ ] `SKILL.md` reads in the repo's voice and is honest about limits
- [ ] If a `protocol.yon` is included, it validates:
      `npx @younndai/yon-parser@2 validate skills/<name>/protocol.yon --profile exec`
- [ ] No personal or machine-specific data anywhere in the contribution
- [ ] Conformance stays green — your change does not break [CONFORMANCE.md](CONFORMANCE.md) or the CI check
- [ ] First prominent public uses follow the canonical forms `YON (YounndAI Object Notation™)`, `Lyt (Link Your Think™)`, and `YounndAI™`; see [`TRADEMARK.md`](TRADEMARK.md)

## Maintainer closeout

A skill change is ready to release when its user-facing explanation, discovery metadata, version and verification describe the same candidate. Keep changes scoped and reuse evidence that still applies.

1. **Settle the scope.** Review the working diff and earlier outgoing commits. Keep unrelated edits, private notes, audit captures, backups and credentials out of the public candidate. Preserve recoverable preimages.
2. **Update the affected sources and guides.** Keep SKILL.md and any protocol aligned. Reconcile callers, required companions and taxonomy when they change. Update the skill's entry in docs/skill-guides.json with purpose, explanatory overview, where it fits, use/non-use, an example, flow, meaningful questions and answers, observable success, outputs and actual subagent conditions. Check every cited source before refreshing its SHA-256 fingerprint; hashes use UTF-8 text with CRLF normalized to LF. The fingerprint detects changed source, not the truth of the guide.
3. **Explain the release and choose its version.** Update README.md for user-visible changes and CHANGELOG.md for additions, changes, fixes and migrations. Follow the changelog policy: removed or renamed skills and breaking interfaces require MAJOR; added skills require MINOR; compatible fixes require PATCH. Change PACK_VERSION in tools/spine.mjs and the version in .claude-plugin/plugin.json together. Keep historical versions intact.
4. **Run the owners.** Run node tools/spine.mjs for SKILLS.md, machine catalogs, the relationship graph, skills.sh.json grouping and all guides. Run node tools/conformance.mjs for CONFORMANCE.md. Do not edit their emitted files by hand. Reconcile plugin descriptions, counts and other affected public surfaces.
5. **Verify the candidate.** Run diff hygiene, lint, spine --check, pinned @younndai/yon-parser@2 validation, relevant dataflow checks, the privacy check and candidate version/count consistency. Exercise changed behavior and the actual installation artifact where relevant. Report limitations and reuse unaffected evidence; do not restart a whole-library audit for routine changes.
6. **Settle review and publication.** Use one focused review for an ordinary settled release candidate. Record the exact paths, commit message with required DCO sign-off, destination, outgoing history and release effects. Obtain the required approval before public mutation. A changed candidate invalidates affected checks and approval.
7. **Verify the remote result.** Push without force and check CI on the exact commit. For a versioned release, create the approved annotated tag and release only after the required checks; verify main, the peeled tag and the release identify the intended commit. Record remaining work and preserve evidence.

Every live skill needs one guide. Adding or retiring a skill requires an explicit guide disposition; the generator will not silently delete old pages. Source files remain authoritative. The guides describe use without adding execution permissions or promising runtime obedience.

## Conformance is the gate

Every `protocol.yon` is validated in CI on every push. Protocol validity is necessary but not sufficient for the workflow badge: the same job also checks metadata, references, dataflow, generated catalogs, counts, privacy, and release consistency. A contribution must leave that full named job green. Conformance lets readers inspect and validate declared structure without trusting an assertion; it does not establish safety or runtime behavior.

## Code of conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). By contributing, you agree to its terms. Be precise, be respectful, never defensive.

## Trademarks

**YounndAI™**, **YON (YounndAI Object Notation™)**, and **Lyt (Link Your Think™)** are trademarks of MARLINK TRADING SRL. Alexandru Mares created YON and its Apache-2.0 reference parser; those are published separately in the YounndAI ecosystem. open-skills is his personal project, not a YounndAI product. Preserve the canonical first-use forms and do not imply endorsement. See [NOTICE](NOTICE) and [TRADEMARK.md](TRADEMARK.md).

## Questions

- General questions: open a [Discussion](https://github.com/allemaar/open-skills/discussions).
- Security concerns: see [SECURITY.md](SECURITY.md) — never a public issue for a live vulnerability.

---

A skill earns its place by what it does for a reader who has never met you. Write it for that reader.
