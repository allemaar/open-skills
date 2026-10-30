# Doctor

Load for broken skill structure, discovery, loading or dependencies. Read [portability](checks/portability.md); read [routing](checks/routing.md) only when discovery or metadata is affected.

1. Identify the failing request, expected result, actual source and consumed entrypoint. Bound the inspection; do not scan all installed skills for a single-skill failure.
2. Trace relevant references, resource types, placeholders, metadata consumers, dependencies and capability fallbacks. If a type-specific contract is failing, read only its [recipe](recipes.md) and relevant maintenance guidance; this does not authorize repairs or a collection scan. Flag missing/unreachable resources, competing owners and cycles only where they cause recursion, ambiguous authority or mandatory overloading. Distinguish an absent dependency from unavailable evidence.
3. Inspect available validators before running them; default to read-only checks. Do not auto-install tools, execute target scripts, change host settings or repair managed projections. Source correctness, installed parity and observed behavior are separate findings.
4. Report the demonstrated cause or unresolved hypotheses, minimal repair and affected scope. A diagnosis is not write permission. For an authorized repair, read [authoring](authoring.md) if not already loaded, use [write](write.md), then [evaluate](evaluate.md); return to the failing case before claiming resolution.

[load.complete] skill-smith.doctor
