# Experimental Agent Mailbox resource bank

> These resources never change Handler authority, message validity, causality, dispositions, whole-inbox reconciliation, or cursor semantics. They are experimental, non-routed, unvalidated for ordinary use, and unavailable for automatic recommendation.

This directory is a maintainer source of truth. Ordinary agents do not load it from the normal resource spine. Use it only when the Handler explicitly asks to assess, test, promote, or compare experimental resources.

Every banked entry records:

- hypothesis and distinct work shape;
- established analogue and evidence;
- reason it is not active;
- intended bounded experiment;
- promotion evidence;
- failure or demotion condition.

Promotion or demotion is a deliberate Handler-directed source change. Preserve failed experiments and counter-evidence rather than rewriting the history into a clean success story.

See [`PATTERN-BANK.md`](PATTERN-BANK.md) for the current candidates.
