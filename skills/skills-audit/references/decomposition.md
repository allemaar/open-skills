# Decomposition

Use when one skill mixes distinct domains, paths, runtimes, use cases, or operating states.

## Split test

Split content only when consumers can avoid loading a part without losing the contract needed for their task. Candidate boundaries include:

- different user intents;
- mutually exclusive runtimes or environments;
- path-specific rules;
- read-only versus mutating operations;
- common core versus uncommon failure recovery;
- independent domains with distinct vocabulary or evidence.

Keep one atomic invariant together. Keep shared authority, routing, and safe fallback in `SKILL.md`. Put conditional procedure or domain detail in focused references.

Do not split merely to shorten files. Moving content to a reference that every invocation must load does not reduce context. Do not create a routing term the consumer must learn when a universal name works.

## Route quality

For each reference, require:

- one recognizable selection condition;
- one unique semantic owner;
- a direct link from the router or owning reference;
- no duplicated contract in the router;
- safe behavior when the reference cannot be loaded;
- a unique terminal load marker when complete loading matters.

Assess typical hot-path load separately from full-library or rare recovery load. Report source size only when it affects maintenance; optimize what the consuming agent actually reads.

Recommend `MOVE` when one conditional concern has a clear owner. Recommend `SPLIT` when independent concerns need different triggers, permissions, or evidence. Leave short cohesive skills intact.

[load.complete] skills-audit.decomposition

