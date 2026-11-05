# Create a small skill

Use this for a repeated task with a useful, stable contract. For a one-off request, use the agent directly. A managed family uses its manager's authoring route.

## Prepare

You need a runtime that loads Agent Skills, a complete open-skills checkout or release export (including catalog.json), and Node.js for the installer. Release installation was exercised with Node 22.19.0; the lowest supported version was not established by this recipe.

From the repository root, choose exactly one command for the standard directory your runtime actually reads:

| Confirmed discovery directory | Command |
|---|---|
| ~/.claude/skills | `node install.mjs --runtime claude --no-stamp skill-smith` |
| ~/.codex/skills | `node install.mjs --runtime codex --no-stamp skill-smith` |
| ~/.agents/skills | `node install.mjs --runtime agents --no-stamp skill-smith` |

The installer does not follow a custom runtime root. For a custom location, use the [complete-folder manual route](../../README.md#install). Existing copies are skipped and links refused; preserve customizations before selecting any replacement procedure.

Confirm that the runtime's skill picker/catalog exposes skill-smith, if that surface exists. Invoke /skill-smith and require the agent to resolve and read the installed entrypoint before proceeding. An unresolved name is not a successful load. A supported session reload may be necessary. Reading a supplied path proves only that explicit file-based invocation, not automatic discovery.

## Try it

Use this fictional log; it contains no credentials or production data:

```text
2026-10-30T10:00:00Z INFO inventory-sync started
2026-10-30T10:00:05Z ERROR GET /inventory timed out after 5000ms
2026-10-30T10:00:05Z WARN retry scheduled; attempt=2
```

Replace the path placeholder, attach the log, and ask:

> /skill-smith Create a skill for our repeated error-log triage. It should distinguish observed errors, hypotheses and missing evidence, then suggest one next diagnostic step. Use the supplied fictional log as the useful-input case and an empty log as the missing-input case. Draft in <authorized draft directory> outside active skill discovery. Do not install, commit or publish. Check the existing library first; if an existing skill already fits, explain the overlap and the reuse route.

Expected result: a scoped draft with a clear trigger, output contract and missing-input route, or a source-grounded reuse recommendation if no new owner is needed. For the sample, a timeout is observed; a network outage or service failure is only a hypothesis. For the empty input, request missing evidence instead of inventing a cause. Reading the log does not reproduce the failure.

## Flow and limits

Preflight and existing-owner check -> resolve material missing choices -> smallest sufficient structure -> draft -> representative useful-input and missing-input evaluation -> result and limits.

One SKILL.md can be enough. The Markdown creation route needs no required sibling skill, provider CLI or subagents. Installation of the newly authored skill and public actions remain separate.

The installer copies the complete references and templates. --no-stamp avoids adding provenance metadata; retain the source release identity separately. Conditional representation choices may add requirements: a skill with protocol.yon can require parser validation and YON (YounndAI Object Notation™) guidance. Consult those owners if that branch is selected.

Stop dependent work for an unresolved canonical target, unsafe writable path or missing required resource. Preserve existing files. A complete brief does not need another interview. Reuse supplied facts and ask only material choices. A deeper interview is optional when requested or accepted; silence leaves optional features off. A preference does not authorize installation, publication or other separate actions. Record which evaluation behavior was observed and which was only a walkthrough.

See the [Skill Smith guide](../skills/skill-smith.md) and [source](../../skills/skill-smith/SKILL.md) for the complete procedure and safeguards.

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
