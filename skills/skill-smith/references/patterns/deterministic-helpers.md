# Deterministic helper patterns

Load when the selected recipe needs repeatable append, reconciliation or inventory mechanics. These are pseudocode patterns to adapt and verify, not a bundled runtime, a drop-in script or permission to execute.

Before adapting a pattern, name inputs, canonical ownership, exact outputs, supported primitives, deadline/retry bounds, failure behavior and observable success. Check target and auxiliary paths without following redirects. Unsupported guarantees remain unsupported; do not disguise a check-then-write race as atomicity.

## Journal-first update example

Use only when the chosen contract makes committed entries the evidence for current state. Other authority/update orders need their own equivalent failure boundaries.

```text
resolve authorized subject, entry identity, date/time zone, state revision
acquire the subject's bounded writer lock, or require a verified equivalent
re-read state and duplicate identity under that protection
if an identical committed event exists: reconcile its state effect, do not append twice
if the same identity conflicts: stop for the declared correction policy
choose yyyy-mm-dd--NN--slug; create exclusively, never overwrite an occupied name
on collision: allocate the next sequence under the bounded retry policy
durably commit the entry using supported primitives; retain its identity
derive state from the declared committed evidence set, preserving unresolved items
replace state atomically with revision protection, or an approved equivalent
if state replacement fails: retain the entry, expose partial state, stop
release only the writer protection owned by this operation
```

Filename exclusion protects entries; state revision/serialization protects overlapping updates. An optimistic equivalent must also enforce unique event identity; distinct filenames and a conditional state write alone are insufficient. If these guarantees are unavailable, use an enforceable single-writer arrangement or stop. Never retry a stale whole-state replacement over another writer.

Recovery examines committed evidence and state coverage under the same writer protection. It does not delete a committed entry to hide failure, claim an uncommitted effect, or replay external actions. A temporary file, lock or marker is a declared output with an owner and disposition.

## Inventory reconciliation

Compare expected owned files with actual no-follow entries under the exact approved root. Preserve unknown, changed or redirected paths and report omissions. A missing candidate is not proof it was deleted by this operation. Read back exact verified cleanup candidates before the applicable removal gate; retain the durable result and unresolved recovery material.

Use scripts only when a real repeated mechanism warrants them. Adapt to the actual filesystem/tool, test interruption and concurrent-state cases on isolated data, and report what was executed versus walked through. Return the adapted mechanics and unsupported guarantees to the recipe; required unsafe mechanics block dependent writes.

[load.complete] skill-smith.pattern.deterministic-helpers
