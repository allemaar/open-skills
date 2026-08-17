---
name: freshness-contract
description: Categorical decision table for reusing cached evidence — when an artifact you already read, a banked test result, a primer, a worker report, or a probe verdict is still trustworthy, and when it must be spot-checked or re-verified. Inputs are observable (artifact class, age anchors, intervening writes, named invalidators); output is reuse / spot-check / re-verify / accept-labeled-risk. Conservative by construction — unclassified artifacts and conflicting signals always take the more restrictive path; no invented TTLs. Trigger when the user runs /freshness-contract, asks "is this still current", "can I trust what I read earlier", "do I need to re-check this", or before reusing prior evidence for a decision after time, writes, or environment changes. Not /double-check (re-verifies one claim's content) or /verify (formal phase gate) — freshness-contract decides whether OLD evidence still counts before those tools decide what NEW evidence shows.
visibility: public
self-improvable: true
triggers:
  - "/freshness-contract"
  - "is this still current"
  - "can I trust what I read earlier"
  - "do I need to re-check this"
  - "is this stale"
next-skills:
  - skill: double-check
    phrase: "/double-check"
    why: "When the table says re-verify, double-check is the targeted re-read that satisfies it"
---

# /freshness-contract

> **EXPERIMENTAL.** A lookup, not a judgment ritual: it should cost LESS than the vibes it replaces. Fires only when prior evidence is about to be **reused for a decision** — never on every read, never as per-phase bookkeeping. It decides whether old proof still counts; what fresh proof must show belongs to your verification tools.

The design is deliberately isomorphic to HTTP caching (RFC 9111): explicit invalidation beats heuristics, conflicting signals resolve restrictively, and nothing is served stale silently. No TTL numbers ship in v1 — every "how old is too old" constant would be invented; the table routes by *class and events*, which are observable.

## Step 1 — classify the artifact (volatility class)

| Class | Meaning | Examples |
|---|---|---|
| **stable** | **exact version-pinned evidence, used for a question about that exact version** — byte stability is not applicability: a superseded spec's old bytes still match while the governing version moved | a released spec consulted AS that release, a frozen/hash-pinned artifact, an archived record. **Supersession or a dependency-version change is a named invalidator whenever the decision asks what is CURRENT** |
| **write-coupled** | valid until someone writes to the source | a file you read this session, an index entry, a config, a map/roster document |
| **env-coupled** | valid until the environment shifts | a passing test that touches network/services/installed tools, a capability probe, a build result |
| **clock-coupled** | decays with time regardless of writes | anything embedding "current" state: prices, live statuses, date-dependent results |
| **report** | someone's account of state, not state itself | worker/subagent reports, peer summaries, self-reports of any kind |

Class is assigned per artifact **kind** at first encounter, not re-judged per use by whoever wants to skip a re-read.

## Step 2 — check the observable signals

- **Intervening writes** — has the source (or its declared dependencies) changed since `as_of`? (fingerprint, mtime, generation stamp, commit)
- **Named invalidators** — did a declared invalidating event occur? (roster change, deploy, sync, schema bump, "re-prime after write")
- **Decision leverage** — is the reuse load-bearing for a decision, release, or Handler-facing claim, or merely orientation? **Leverage is non-downgradable when the result supports a release, an irreversible or external action, a formal gate, or a Handler-facing recommendation — those are high, not judgment calls.**
- **Discriminator availability** — does a cheap signal exist that is exclusive to the fresh state (a hash to recompute, a header to stat, a count to re-derive)?

## Step 3 — the table (first match wins)

| Situation | Policy |
|---|---|
| Any named invalidator fired, or intervening write on a write-coupled source | **re-verify** |
| Conflicting or ambiguous signals, whatever the class | **re-verify** (restrictive conflict rule) |
| stable + fingerprint still matches | **reuse** |
| write-coupled + no intervening write + low/medium leverage | **reuse** |
| write-coupled + no intervening write + high leverage | **spot-check** the discriminator |
| env-coupled or clock-coupled + low/medium leverage | **spot-check** the discriminator |
| env-coupled or clock-coupled + high leverage | **re-verify** |
| report, any age, load-bearing | **re-verify** (a report is never promoted to state by aging) |
| report, orientation only | **reuse, labeled as report** |
| no cheap discriminator exists for a spot-check row | **re-verify or accept-labeled-risk** — say which, in the output |
| **unclassified artifact kind (DEFAULT ROW)** | **spot-check**; classify the kind before next reuse |

`accept-labeled-risk` is **agent-electable ONLY on the no-cheap-discriminator row** — it is never a bypass for a `re-verify` result elsewhere in the table. On any other row, proceeding despite a `re-verify` verdict requires explicit Handler authority (that is a Handler override, not a table output). Where it applies, it is never silent: the staleness risk is named next to the conclusion it feeds.

## Output record (one line to a few lines, inline where the evidence is used)

```text
freshness = { artifact, class, as_of, signals: {writes|invalidators|leverage},
              decision: reuse|spot-check|re-verify|accept-labeled-risk,
              discriminator_used?: <what was checked> }
```

No dedicated log stream, no cards, no sink — the record rides inside whatever report or decision consumed the evidence.

## Safety boundary

- Signals are observable properties of sources and events — never the agent's feeling of confidence about its memory.
- The table may be narrowed by a Handler's local policy (stricter rows); agents never loosen a row.
- TTLs, if ever added, must come from logged staleness observations, not authorship-day guesses; until then age alone never justifies reuse or refusal.
- Foreign freshness metadata (another party's "this is current" claim) is a report, not a signal — classify accordingly.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
