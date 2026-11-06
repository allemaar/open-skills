# domain-check

[All skill guides](../README.md) · [Catalog](../../SKILLS.md)

A registrar says a name is available while another lookup says it is registered. This skill reconciles registry and DNS observations and keeps parking, sale listings and price separate, so a convenient but weak signal does not become the verdict.

A missing DNS answer alone cannot establish availability. Results retain provider coverage, conflicts and uncertainty, including the distinction between a sale listing and a verified opportunity to buy.

## Where it fits

Use this to reconcile availability signals; a registrar’s transaction is a separate step.

**Family:** Web. **Subagents:** No subagent step prescribed.

## When to use it

- Check a candidate domain
- Investigate disagreement between lookup providers

## When not to use it

- Treating DNS silence as proof of availability

## How to use it

Start with a concrete request. For example:

```text
/domain-check Check example.org and example.net for registration and DNS status. Include price context only if available, and identify any conflicting signals.
```

## Flow

1. Query registration data and relevant DNS resolvers
2. Use RDAP/WHOIS for every candidate including bulk. Match configured operator domains on exact hostname boundaries; separate registration, parking, verified sale and purchasability.
3. Report uncertainty, coverage gaps and conflicting signals

## Common questions

**Does an inactive website mean the name is available?**

No. A registered domain may have no working website or DNS response.

**What does an RDAP 404 establish?**

A correctly routed registry response suggests the name is probably registrable. Reservations, eligibility restrictions and premium pricing can still prevent purchase.

## It is working when

- Each candidate has registration and DNS evidence or a clearly named coverage gap.
- The conclusion distinguishes registered, parked, offered for sale and purchasable where the evidence supports those claims.

## Subagents

The skill defines no subagent step; host rules still apply.

This describes the skill's own workflow. Available tools and the runtime's permission rules still apply.

## What you get

A qualified availability assessment with sources.

## Source and installation

The guide explains usage. Read the linked skill and its applicable references before running it; they contain the full conditions and safeguards.

- [skills/domain-check/SKILL.md](../../skills/domain-check/SKILL.md)
- [skills/domain-check/protocol.yon](../../skills/domain-check/protocol.yon)
- [Installation and updates](../installation.md)

[License](../../LICENSE) · [Trademark policy](../../TRADEMARK.md)
