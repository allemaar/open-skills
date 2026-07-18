# Threat Model

> A skill is instructions your agent acts on, with your machine's permissions. Installing one is a supply-chain decision. This document states the risk plainly and shows what inspectability does and does not buy you.

An agent skill is a small document your AI agent reads and then acts on. It can tell the agent to run commands, edit files, and reach the network — using whatever access you have given the agent. That is the point of skills, and it is also the risk. A skill you did not read is code you did not read, running where you work.

Most skills travel as opaque bundles or as prose you skim once. open-skills takes the opposite stance: every skill is plain text you can read before you trust it, and the enforceable part of each skill is a declarative protocol you can validate with a public tool. Inspection is the defense. This document explains what that defends against, and — just as important — what it does not.

## The attack surface

A skill runs inside your agent, so its reach is your agent's reach. The concrete threats:

- **Skill injection.** A skill is instructions. Malicious instructions can direct the agent to exfiltrate secrets, delete files, install packages, or call out to a server. No exploit is required — the agent is doing what the skill said.
- **Opaque control flow.** When a skill's behavior lives only in prose, you cannot tell in advance what it will make the agent do. You are trusting a paragraph to constrain a model.
- **Silent drift.** A skill that was safe when you installed it can change underneath you. This is a property of *how* you installed it, not of skills as such: a symlink pointing into a live clone re-points at whatever the next `git pull` brings, with no moment where anyone reads the diff. A frozen copy cannot drift — though it also cannot be fixed without you re-copying. Either way one principle holds, and it is why copying is the default here: **an unreviewed update is an ungranted trust.** Trust granted once is not trust earned forever.
- **Transitive trust.** A skill can reference other skills. Auditing one means auditing what it pulls in.
- **Provenance you can read is not provenance you can verify.** The `metadata:` block [`install.mjs`](install.mjs) stamps into a copy — and the identical block `gh skill install` writes — is an **unsigned assertion in a plain-text file**. Nothing authenticates it. Anyone can type `github-repo: https://github.com/allemaar/open-skills` into a hostile skill and tooling will render that claim as fact. Read the block as a note the installer left itself, not as a certificate. Two consequences worth holding: a stamped folder passed on to someone else carries *your* source coordinates, so their `gh skill update` will track a repo they never chose — a frozen copy quietly turned into an updatable one; and `install.mjs` will not overwrite a `metadata:` block that already exists, so a fork's pre-baked claim survives the copy rather than being corrected (it says so when it declines).

These are supply-chain risks. They are the same shape as installing an unread dependency, with one difference: the runtime is a model that improvises, so the blast radius is harder to bound.

## What open-skills does about it

The design answers the threats with **inspectability**, not with a sandbox.

- **Everything is readable text.** Every skill is a folder of Markdown and YON. No build step, no minified blob, no binary. You can read every line before you grant trust, and diff every line on update.
- **The enforceable part is a declarative protocol.** Of the 55 skills here, 37 ship a [`protocol.yon`](CONFORMANCE.md). In those files the control flow, the rules (`MUST` / `MUST_NOT`), and the gates (`ABORT` / `WARN`) are named, typed records — not prose you hope the model follows. Behavior you can name is behavior you can audit.
- **You can validate it yourself, with a tool that is not ours.** Each `protocol.yon` validates against the public YON™ parser:

  ```bash
  npx @younndai/yon-parser validate skills/cold-review/protocol.yon --profile exec
  # ✓ skills/cold-review/protocol.yon: Valid
  ```

  The trust does not route through the author. It routes through a public specification and an Apache-2.0 reference parser.
- **Conformance is enforced in CI.** Every `protocol.yon` is validated on every push; [`CONFORMANCE.md`](CONFORMANCE.md) tracks the result. The badge is green only when all 37 validate. A protocol that stops parsing breaks the build, in the open.
- **The install path is inspectable too.** Installing is itself a supply-chain step, so the installer is not exempt from the rule. [`install.mjs`](install.mjs) is a single zero-dependency file you read before you run it; it copies a skill folder, stamps that copy with where it came from, and validates its `protocol.yon` against the pinned public parser — there is no opaque `npx`-published step that runs code you have not seen. It copies by default (a frozen snapshot, so a later upstream change cannot drift underneath you), and it **refuses to overwrite a symlinked or junctioned skill** rather than risk a recursive delete traversing the link into the source tree. Be precise about the stamp, because it means the installed file is **not** byte-identical to this repo's: it adds a `metadata:` block to the copy's `SKILL.md` recording the repo, ref, and tree SHA it came from — and nothing else. That is what lets you (and `gh skill update`) tell later whether the copy has gone stale. When this clone cannot honestly support that claim it records a plain `local-path` instead — that is, whenever the origin is not GitHub (a GitLab mirror or private fork cannot be a `github-repo`), the HEAD is detached, the skill has local edits (**including ignored files, which are still copied**, so a clean `git status` would not notice), or the commit is not yet pushed and the tree therefore exists here but not at `github-repo`. `--no-stamp` copies byte-for-byte and records nothing.

## What this does NOT claim

Inspectability is a real defense with precise edges. Naming the edges is part of the defense.

- **YON is an audit primitive, not a sandbox.** A `protocol.yon` makes a skill's intent legible. It does not execute in a jail and does not constrain what your agent runtime can do. The protection is that you can *see* the intent before you trust it — not that an unread intent is contained.
- **Validation proves structure, not safety.** A `protocol.yon` that validates is well-formed. It is not therefore benign. A well-formed protocol can still describe a harmful step. Validation narrows what you must read; it does not replace reading.
- **18 of 55 skills are Markdown-only.** They carry no `protocol.yon`, so their behavior is prose. They are useful skills, but they get no more enforceable-control-flow guarantee than any other prose skill. Read them as such.
- **This is one author's vetted set.** The skills here were scrubbed of personal data and reviewed before release. A fork is not. Trust is yours to grant, per skill, per version.

The honest summary: open-skills removes the excuse not to read, and gives the enforceable parts a checkable shape. It does not remove the responsibility to read.

## Audit a skill before you install it

The workflow the design is built for:

1. **Read `SKILL.md`.** Know what it claims to do and when it runs.
2. **Read `protocol.yon`, if present.** The steps, rules, and gates are the enforceable contract. Confirm they match the prose.
3. **Validate it.** `npx @younndai/yon-parser validate <skill>/protocol.yon --profile exec`.
4. **Follow the references.** A skill that points at others is trusted only as far as those are.
5. **Diff on update.** Your copy is frozen — it will not change until you re-copy it. That makes the re-copy the moment to look, and it is the only moment there is. `git pull` in your clone, then diff what you have installed against what you are about to accept:

   ```bash
   git diff --no-index -I '^(metadata:|  (github-|local-path))' \
     ~/.claude/skills/cold-review skills/cold-review
   ```

   Exit 0 means identical and prints nothing; anything printed is behavior you have not read yet. The `-I` skips the `metadata:` block `install.mjs` stamped into your copy — that block is expected and is not drift. Note this compares your copy against *your clone*, so it also catches a copy edited locally after install, which no upstream check can see.

   To check everything you have installed, loop over the intersection — don't point the command at the two parent dirs, or it will also print a full diff for every skill in the repo you *didn't* install and bury the real answer:

   ```bash
   for d in ~/.claude/skills/*/; do n=$(basename "$d"); [ -d "skills/$n" ] &&
     git diff --no-index -I '^(metadata:|  (github-|local-path))' "$d" "skills/$n"; done
   ```

   Silence means every installed skill matches your clone.

   If you symlinked instead, there is no diff to review and no moment to review it in: the repo changes the skill your agent runs, and you find out afterwards. That is the trade, stated plainly — and it is why copying is the default.

   *The stamp also makes your copies legible to other tools.* `gh skill list` and
   `gh skill update --dry-run` read the same `metadata:` block, so copies `install.mjs`
   made are **attributed** in the first and **checkable** by the second, without either
   tool knowing about the other — that interoperability is why the stamp uses GitHub's
   key names instead of inventing our own. (These arrived in gh v2.90.0 (`update`) and
   v2.94.0 (`list`), are still labelled preview and subject to change, and the behaviour
   described here was checked against v2.96.0.)
   It is not a substitute for the diff above, and four differences are worth stating plainly.
   It resolves an unpinned entry to the repository's **latest release tag**, not to the
   branch you cloned — so if you are on `main` and the skill has changed since the last
   release, it can offer an "update" that moves you *backwards* to that tag. It reports
   *that* a tree changed, never *what* changed. It compares against the recorded stamp
   rather than your bytes — in fact it reads only `SKILL.md`'s frontmatter and no file's
   contents — so a copy edited after install still reads as up to date. And its commands
   report telemetry at full sample rate unless you set `GH_TELEMETRY=0` or `DO_NOT_TRACK=1`.
   And keep the `--dry-run`: bare `gh skill update` **applies** the update in place, and since
   it never shows you what changed, that is a one-command way to accept behavior you have not
   read — the exact ungranted trust this document is about. The git command above compares your
   real bytes against your own clone, needs no network, no account, and no version of anything —
   and reports nothing to anyone.

## Reporting

Found a vulnerability in a skill — an instruction that exfiltrates, a protocol that misleads, a leaked path? Report it privately. See [`SECURITY.md`](SECURITY.md). Do not open a public issue for a live vulnerability.

---

The format does not make a skill safe. It makes a skill legible, so that safety is a thing you can check instead of a thing you are told.
