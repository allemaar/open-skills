# Implementation

Use for references, dependencies, portability, validators, installation, consumed behavior, and requested Git drift.

## Inventory and reachability

- Build a closed inventory of in-scope entrypoints, routes, local references, named dependencies, metadata consumers, validators, and generated or installed surfaces.
- Traverse every declared in-scope edge once. Resolve each target; identify its semantic owner; verify it is reachable from a real entrypoint.
- Mark excluded, unresolved, unreachable, duplicate-owner, and cyclic items. Claim complete coverage only when none is silently omitted.
- Flag a cycle only when it causes recursion, authority ambiguity, or mandatory overloading.
- Distinguish historical mentions from operational references.

## Portability

Flag unscoped assumptions about personal paths, named repositories, private registries, installed tools, shells, runtimes, link farms, or managed files. Keep environment mechanics in detected repository instructions or adapters. Portable policy states outcomes, prohibited failures, evidence, and fallback.

## Validators

Discover local checks before inventing one. Inspect help or source until command effects are known. During `audit`, run only read-only checks. Mark unavailable or mutating checks unchecked unless their effects are separately authorized.

## Consumed form

- Claim source-to-consumed parity only when a target-exclusive comparison covers every declared surface by resolved target, bytes or hashes, package contents, or runtime-visible metadata.
- Claim consumed behavior only from a bounded execution of the consumed entrypoint with discriminating positive and negative controls.
- Parity does not prove behavior. Behavior does not prove parity. Without exclusive evidence, name the gap.

## History

Default to current source. Compare history only when the caller names a base or requests drift.

Targeted exception: inspect only the last change for one disputed line or path when current evidence cannot determine whether it is stale and that answer changes classification. Record the commit or range. Do not widen the history scan or let history override current authority.

When history is in scope, report behavioral drift, quality regression, and unexplained load growth. Do not persist scores, hashes, baselines, or registries solely for future audits.

[load.complete] skills-audit.implementation
