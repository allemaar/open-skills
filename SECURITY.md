# Security Policy

A skill runs with your agent's permissions, so a vulnerability in a skill is a vulnerability on your machine. Reports are taken seriously and handled in the open once a fix is ready.

This is a personal, independent project maintained by Alexandru Mares. It is not a YounndAI™ product. Reports route to the maintainer directly, not to any company inbox.

## Reporting a vulnerability

Do not open a public issue for a live vulnerability. Public disclosure before a fix puts every downstream user at risk.

Report it privately through **GitHub's private vulnerability reporting**:

1. Go to the repository's **Security** tab.
2. Choose **Report a vulnerability**.
3. Include what you found and why it matters:
   - The skill or file affected, and the behavior at fault — a malicious or misleading instruction, a `protocol.yon` whose steps contradict its prose, a leaked path or credential, a transitive reference to something untrusted.
   - Steps to reproduce, or a proof of concept, where safe to share.
   - Suggested severity: **Critical**, **High**, or **Moderate**.

If you cannot use GitHub's private reporting, open a minimal public issue that says only "security report, please advise on a private channel" — with no detail — and wait for a reply.

## Response

This is maintained by one person, so the commitment is best-effort and stated honestly rather than as a corporate SLA:

| Action                  | Target          |
| ----------------------- | --------------- |
| Acknowledgement         | within 72 hours |
| Initial assessment      | within 7 days   |
| Fix or published advisory | within 30 days |

Critical issues are prioritized and patched ahead of these targets where feasible. If a target will slip, you will hear that, not silence.

## What is in scope

- **Skill content** — instructions in a `SKILL.md` that direct an agent toward harmful action.
- **Protocol integrity** — a `protocol.yon` whose declared steps, rules, or gates misrepresent what the skill does.
- **Data leakage** — vault paths, machine paths, credentials, or other personal data that survived the scrub.
- **Transitive references** — a skill that points at an untrusted or unresolvable dependency.

Out of scope: vulnerabilities in your agent runtime, in the YON parser, or in any third-party tool a skill invokes. Report those to their respective maintainers. The YON specification and `@younndai/yon-parser` are separate products of MARLINK TRADING SRL, with their own disclosure process.

## Supported versions

`main` is the only supported branch. Skills are distributed from the live repository, so fixes land on `main` and reach you on your next pull. There are no long-lived release branches to backport to.

## Disclosure

The commitment to a reporter:

- Acknowledge the report within the target above.
- Work with you to verify and reproduce it.
- Coordinate a disclosure date that gives users time to update.
- Credit you in the advisory, unless you prefer to remain anonymous.

---

Read before you trust; report what you find. Both keep the supply chain honest.

© 2026 Alexandru Mares (allemaar.com). Licensed under Apache-2.0.
