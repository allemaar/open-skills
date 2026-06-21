# Threat Model

> A skill is instructions your agent acts on, with your machine's permissions. Installing one is a supply-chain decision. This document states the risk plainly and shows what inspectability does and does not buy you.

An agent skill is a small document your AI agent reads and then acts on. It can tell the agent to run commands, edit files, and reach the network — using whatever access you have given the agent. That is the point of skills, and it is also the risk. A skill you did not read is code you did not read, running where you work.

Most skills travel as opaque bundles or as prose you skim once. open-skills takes the opposite stance: every skill is plain text you can read before you trust it, and the enforceable part of each skill is a declarative protocol you can validate with a public tool. Inspection is the defense. This document explains what that defends against, and — just as important — what it does not.

## The attack surface

A skill runs inside your agent, so its reach is your agent's reach. The concrete threats:

- **Skill injection.** A skill is instructions. Malicious instructions can direct the agent to exfiltrate secrets, delete files, install packages, or call out to a server. No exploit is required — the agent is doing what the skill said.
- **Opaque control flow.** When a skill's behavior lives only in prose, you cannot tell in advance what it will make the agent do. You are trusting a paragraph to constrain a model.
- **Silent drift.** Skills are often symlinked into a runtime directory. A skill that was safe when you installed it can change underneath you on the next pull. Trust granted once is not trust earned forever.
- **Transitive trust.** A skill can reference other skills. Auditing one means auditing what it pulls in.

These are supply-chain risks. They are the same shape as installing an unread dependency, with one difference: the runtime is a model that improvises, so the blast radius is harder to bound.

## What open-skills does about it

The design answers the threats with **inspectability**, not with a sandbox.

- **Everything is readable text.** Every skill is a folder of Markdown and YON. No build step, no minified blob, no binary. You can read every line before you grant trust, and diff every line on update.
- **The enforceable part is a declarative protocol.** Of the 48 skills here, 34 ship a [`protocol.yon`](CONFORMANCE.md). In those files the control flow, the rules (`MUST` / `MUST_NOT`), and the gates (`ABORT` / `WARN`) are named, typed records — not prose you hope the model follows. Behavior you can name is behavior you can audit.
- **You can validate it yourself, with a tool that is not ours.** Each `protocol.yon` validates against the public YON™ parser:

  ```bash
  npx @younndai/yon-parser validate skills/cold-review/protocol.yon --profile exec
  # ✓ protocol.yon: Valid
  ```

  The trust does not route through the author. It routes through a public specification and an Apache-2.0 reference parser.
- **Conformance is enforced in CI.** Every `protocol.yon` is validated on every push; [`CONFORMANCE.md`](CONFORMANCE.md) tracks the result. The badge is green only when all 34 validate. A protocol that stops parsing breaks the build, in the open.
- **The install path is inspectable too.** Installing is itself a supply-chain step, so the installer is not exempt from the rule. [`install.mjs`](install.mjs) is a single zero-dependency file you read before you run it; it only copies a skill folder and validates its `protocol.yon` against the pinned public parser — there is no opaque `npx`-published step that runs code you have not seen. It copies by default (a frozen snapshot, so a later upstream change cannot drift underneath you), and it **refuses to overwrite a symlinked or junctioned skill** rather than risk a recursive delete traversing the link into the source tree.

## What this does NOT claim

Inspectability is a real defense with precise edges. Naming the edges is part of the defense.

- **YON is an audit primitive, not a sandbox.** A `protocol.yon` makes a skill's intent legible. It does not execute in a jail and does not constrain what your agent runtime can do. The protection is that you can *see* the intent before you trust it — not that an unread intent is contained.
- **Validation proves structure, not safety.** A `protocol.yon` that validates is well-formed. It is not therefore benign. A well-formed protocol can still describe a harmful step. Validation narrows what you must read; it does not replace reading.
- **14 of 48 skills are Markdown-only.** They carry no `protocol.yon`, so their behavior is prose. They are useful skills, but they get no more enforceable-control-flow guarantee than any other prose skill. Read them as such.
- **This is one author's vetted set.** The skills here were scrubbed of personal data and reviewed before release. A fork is not. Trust is yours to grant, per skill, per version.

The honest summary: open-skills removes the excuse not to read, and gives the enforceable parts a checkable shape. It does not remove the responsibility to read.

## Audit a skill before you install it

The workflow the design is built for:

1. **Read `SKILL.md`.** Know what it claims to do and when it runs.
2. **Read `protocol.yon`, if present.** The steps, rules, and gates are the enforceable contract. Confirm they match the prose.
3. **Validate it.** `npx @younndai/yon-parser validate <skill>/protocol.yon --profile exec`.
4. **Follow the references.** A skill that points at others is trusted only as far as those are.
5. **Diff on update.** A symlinked skill changes when the repo changes. Review the diff before you pull behavior you have not seen.

## Reporting

Found a vulnerability in a skill — an instruction that exfiltrates, a protocol that misleads, a leaked path? Report it privately. See [`SECURITY.md`](SECURITY.md). Do not open a public issue for a live vulnerability.

---

The format does not make a skill safe. It makes a skill legible, so that safety is a thing you can check instead of a thing you are told.
