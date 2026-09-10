# Scope

## Goal

Resolve the organization contract before evaluating or changing a scope.

## Elasticity pre-flight

Choose one Handler-confirmed verdict. Detection alone never settles it.

- `ADOPT`: a compatible house style exists. Preserve its selected dialect.
- `OFFER`: an incompatible structure exists. Offer its owner two choices: switch this scope to MYK or leave it unchanged. Nested scopes may differ.
- `SETTLE`: no protocol exists and the evidence is complete. Apply MYK defaults.
- `ASK`: evidence is ambiguous, implicit, incomplete, or sampled. This is the fail-closed default. A sampled inventory can return only `ASK`.

A live `.myk/README.md` short-circuits detection. Before organization work, read its contract and the declared root map.

Persist only Handler-selected resolutions: verdict, date, dialect mappings used by automation, selected fast-access nodes, and confirmed rulings. `ASK` is transient. `DECLINE` creates no MYK file by default; record it in the house's existing convention, honor it, and do not re-offer. Raw house prose is evidence until the Handler confirms it as a ruling.

In an `ADOPT` scope, reuse selected house equivalents for MYK's default `myk` and `map` tags. After work, the scope must remain recognizably itself. Dilution is a defect.

## Organized-scope evidence

A scope is organized only when one marker exists:

1. `.myk/README.md` at the scope root. `m1.root-map` declares the root map; `m3` owns exclusions and managed-artifact declarations.
2. The current file declares `meta.map`.
3. A scope-local instruction names the exact root-map filename.
4. The Handler names the scope and root or owner map in the current request.

An arbitrary `*-map.md` filename is insufficient. If no marker resolves the scope, do not invent one. `map-this` may propose the first root map and scope contract.

Once a root map is resolved, read it before assessing, planning, or changing the scope.

## Scope contract

`.myk/README.md` is machine policy, never navigation. It opens with plain words stating what it is, why it matters, and what deletion breaks. It travels with the repository or vault and is never gitignored. Generated caches may be ignored but never become semantic truth.

Every organized scope has exactly one declared root map. Its locator is declared data. `<scope>-map.md` is the vault default; `README.md` is valid when explicitly declared by repository convention or the Handler. A gateway README linked to another declared root is an ordinary member, not a second root.

Every agent-created map includes one plain body line identifying it as that scope's navigation front door and part of MYK.

House Rules are Handler-voice, scope-local guidance. Keep a concise section in the root map; move it to an earned `<scope>-rules.md` member only when it outgrows the map. Do not duplicate facts between them.

## Boundaries

- Lyt owns registered-vault identity, capture, search, indexing, visibility, sync, and publication.
- `map-*` owns Markdown organization and proposal/apply behavior.
- Front Matter Title renders display titles; filenames remain addresses.
- Bases and generated queries are views; maps remain curated navigation.

Good: one evidenced verdict, one declared root, local dialect preserved.

Bad: inferred organization, two roots, or defaults overwriting established style.

[load.complete] map-rules.scope
