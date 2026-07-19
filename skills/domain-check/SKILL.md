---
name: domain-check
description: >
  Reconcile domain-name availability across sources that disagree. Registrar availability endpoints report registered, broker-parked domains as available; this skill fixes the precedence — RDAP (Registration Data Access Protocol) is authoritative, DNS (Domain Name System) corroborates, broker nameservers override any "available", and the registrar is consulted for price only. Works on one domain or a bulk candidate sweep. Trigger via /domain-check, "is this domain available", "check these domain names", "did the availability tool lie". Not /investigate (read-only fact-gathering over a codebase) or /double-check (re-verifies one already-stated claim) — domain-check owns the availability verdict itself.
visibility: public
self-improvable: true
triggers:
  - "/domain-check"
  - "is this domain available"
  - "check these domain names"
  - "did the availability tool lie"
next-skills:
  - skill: insight-assess
    phrase: "/assess"
    why: "Weigh the surviving candidates against each other once availability is settled."
  - skill: double-check
    phrase: "/double-check"
    why: "Re-verify a single contested verdict where the sources disagreed."
  - skill: ask-gate
    phrase: "/ask-gate"
    why: "A registration is a spend and irreversible — quality-gate the question before asking the handler to commit."
---

# /domain-check

Availability tools disagree, and the one most people reach for is the one most
likely to be wrong. This skill is a **reconciliation policy**, not another
lookup client. It says which source wins when two sources conflict, what a
negative result does and does not prove, and what the handler still does not
know when the verdict lands.

The house rule is **wrap, don't build**. Keyless servers already implement
lookup with sensible fallbacks — `saidutt46/domain-check` and
`stucchi/domain-check-mcp` both do RDAP with a WHOIS fallback, and Brave Labs'
`domain-checker-mcp` ships a DNS-then-RDAP hybrid. Use one of those, or plain
`curl` and `nslookup`. What none of them handle is **aftermarket detection**
and a **documented precedence order**. That gap is this skill.

> **Structured execution spec:** [`protocol.yon`](protocol.yon). Read it for the canonical rules and step sequence; this file is explanation. The two must stay in sync — if you edit one, update the other and refresh the `@STAMP` date.

## Why this exists

A GoDaddy-backed availability tool reported `available: true` for seven
domains: `hexis.com`, `shim.com`, `mortise.com`, `limen.com`, `vinculum.com`,
`honeyourcraft.com` and `poweryouragent.com`. Every one was registered and
parked on a broker nameserver — `afternic.com`, `namefind.com`, or
`domainmarket.com`.

The failure was confirmed independently. A request to
`https://rdap.verisign.com/com/v1/domain/hexis.com` returns HTTP 200, meaning
registered. A genuinely unregistered domain and a random control both return
404. So RDAP was right, DNS was right, and the registrar layer was the
unreliable one.

**A hypothesis, not a diagnosis.** GoDaddy's availability endpoint takes a
`checkType` parameter of `FAST` (the default) or `FULL`, documented as
"Optimize for time (FAST) or accuracy (FULL)". It also returns a `definitive`
boolean meaning the answer was verified against the registry. A tool sitting on
the default fast path would plausibly produce exactly these false positives.
That fits the evidence. It has not been confirmed against a live trace, and
this skill does not assert it as the cause.

## The precedence order

Strongest source first. When two sources conflict, the higher one wins.

**1. RDAP — authoritative.** Resolve the registry endpoint through the IANA
(Internet Assigned Numbers Authority) bootstrap file at
`https://data.iana.org/rdap/dns.json`. Its shape is
`services: [[tlds], [urls]]`; `.com` resolves to
`https://rdap.verisign.com/com/v1/`. HTTP 404 means the name is not in the
registry. HTTP 200 means it is registered.

**Never hardcode a per-registry base URL.** A misrouted query returns 404 for
the wrong reason, and a 404 for the wrong reason is indistinguishable from
availability. Bootstrap first, then query.

**2. DNS — fast pre-filter and corroboration.** Query `NS` (nameserver) and
`SOA` (start of authority) records with `nslookup -type=NS` or `dig`, against
**two resolvers, one of which is `8.8.8.8`**. A delegated nameserver is strong
evidence of registration. Absence of one is weak evidence of anything.

**3. Broker override.** If the nameservers match a known aftermarket operator,
the verdict is **registered and brokered**, and it overrides any registrar
claim of availability. Match on these substrings:

```
afternic   sedo        dan.com     domainmarket
bodis      namefind    sedoparking
```

Also treat a `domain-is-4-sale`-style hostname as a broker marker. These
domains are buyable, but through a broker at an aftermarket price — not at
registration cost.

**4. Registrar API — price context only.** Consult a registrar for pricing,
premium tiers, and aftermarket asking prices. **Never take its binary
answer.** Treat any `available: true` from a registrar as provisional until
RDAP corroborates it.

## What a negative result does not prove

An RDAP 404 means "probably registrable". It does not mean purchasable. All of
these still block a registration that RDAP says is free:

- **Reserved strings.** Registries withhold names by policy.
- **Sunrise and landrush restrictions.** A new TLD (top-level domain) may
  accept only trademark holders during its early phases.
- **Registry-premium pricing.** The name is available at a price that is not
  the standard registration fee.

The opposite direction also fails. A domain in **redemption or pending-delete**
returns RDAP 200 and looks taken — it is taken, but it is also not yet
registrable by you, and it may become free later. And a **registered domain
with no delegated nameservers** looks empty to DNS. That is the false-negative
case, and it is the reason DNS never outranks RDAP.

## Coverage and rate limits

**Roughly 189 country-code top-level domains have no RDAP service at all.**
For those, WHOIS is the only fallback. WHOIS is free-text, per-registry, and
parse-fragile. Label any WHOIS-derived verdict as lower-confidence and say so
in the output.

Rate limits are the operational constraint on any bulk sweep:

- `rdap.org` caps at **10 requests per 10 seconds**.
- **WHOIS is punitive.** It will IP-ban (internet protocol address ban), and on
  a shared address the ban can be inherited from someone else's abuse. Roughly
  **one query per second per address** is the safe default.

For a bulk candidate sweep, query the **registry-direct** RDAP endpoint from
the bootstrap rather than an aggregator, add backoff, and never fan out in
parallel.

## The flow

**Single domain.** Bootstrap the RDAP endpoint for the TLD. Query it. Query
DNS from two resolvers. If nameservers are present, test them against the
broker list. Optionally consult a registrar for price. Reconcile by
precedence, then report.

**Bulk sweep.** Same sequence per candidate, run serially with backoff. DNS
first is legitimate here as a cheap pre-filter — a candidate with live broker
nameservers is settled without an RDAP call. Every candidate that survives DNS
still needs RDAP before it is called available.

## Reporting

Every verdict carries three parts. Do not drop the third.

1. **The verdict.** Available, registered, registered-and-brokered, or
   unknown. Fail to unknown when sources conflict and nothing breaks the tie.
2. **The sources that agreed.** Name them. "RDAP 404 and no nameservers on two
   resolvers" is a verdict a reader can audit; "available" is not.
3. **The residual uncertainty.** Price and premium status are unknown unless a
   registrar was consulted. Registry policy restrictions are unknown either
   way. Say this even when the verdict is confident.

A worked example of the reporting shape:

```
vinculum.com   REGISTERED-AND-BROKERED
  RDAP 200 (rdap.verisign.com) + NS on afternic.com
  Aftermarket price unknown; no registrar consulted.
```

## Boundary

- Not `/investigate` — that gathers facts over a codebase; this reconciles
  conflicting external lookups into one verdict.
- Not `/double-check` — that re-verifies a claim already on the table; this
  produces the claim.
- Not a lookup client. It does not reimplement RDAP or WHOIS. It decides which
  answer wins.
- It does not register anything. Buying a domain is a spend and a handler's
  call — surface it, never execute it.

> **Human output.** This skill's handler-facing output obeys the human-output
> contract (`human-output/SKILL.md`).

> **Next skills.** On completion, run the Next Skills protocol (`next-skills/SKILL.md`): surface the `next-skills` recommendations from front-matter for the caller to pick. Offer only — never auto-invoke.

> **Self-improvement.** On completion, run the Self-Improvement Protocol (`self-improve/SKILL.md`): if this run surfaced a concrete, blocking-or-recurring weakness in this skill, propose a specific fix for the handler to approve. Conservative — silent otherwise. Never auto-apply.
