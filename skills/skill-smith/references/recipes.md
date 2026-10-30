# Choose and adapt a recipe

Load only when the target skill's job needs a distinct operating or lifecycle contract. The selected create, assess, doctor, update or consolidate method remains the owner; complete its required checks after this branch. For creation, content assessment or revision, read [authoring](authoring.md) if not already loaded. Recipes are design knowledge, not commands to execute on live subjects.

## Selection

Reuse the supplied task, audience, trigger, inputs, outputs, permissions, lifecycle and success criteria. Infer only low-impact details supported by those inputs; ask about a missing choice only when it changes the result or authority.

| Job | Read only the useful recipe |
|---|---|
| Orient and navigate sources | [Primer](recipes/primer.md) |
| Own an inventory and route scoped operations | [Manager](recipes/manager.md) |
| Carry out an ordered process | [Workflow](recipes/workflow.md) |
| Assess evidence and recommend | [Reviewer](recipes/reviewer.md) |
| Operate a named tool | [Tool operator](recipes/tool-operator.md) |
| Convert input into an output | [Transformer](recipes/transformer.md) |
| Maintain current state and traceable history | [Record-keeper](recipes/record-keeper.md) |
| Transfer bounded context and pending work | [Handoff](recipes/handoff.md), optional |

Keep the generic pattern when no recipe improves the contract. Combine recipes only when they serve one coherent invocation; name the primary procedure and each branch's trigger, output and permissions. Recommend two or three specialized skills when independent triggers, incompatible permissions or separate outputs make a combined router harder to use. Collection migrations remain with [consolidate](consolidate.md); a recipe recommendation is not approval to merge or retire skills. Do not reinterpret retrieval as review.

## Shared conventions

Give each generated skill applicable setup, output shape, operating procedure, maintenance/doctor and housekeeping guidance. Use inline paragraphs when short; extract a reference or template only when a consumer can skip it. Omit inapplicable work rather than adding empty headings. Adapt [operations](../templates/operations.md) when a durable operating contract helps; split modus operandi and housekeeping into separate files only when they earn their upkeep.

Carry required guidance with the generated skill. Do not leave its runtime dependent on this recipe library. Authoring placeholders are resolved while building the skill; labelled runtime fields in its output templates are resolved when creating an output. Journals, scripts, integration metadata, automatic loops and schedules are never implicit.

Each route declares its owner, load condition, missing-resource behavior and return. Read required safeguards along the canonical parent chain before dependent work; a completed parent need not be reread on every backlink. Missing required guidance stops dependent work. Return the selected structure and checks to the calling method. Preserve existing invocation policy and write authority.

Good: one clear task loads one recipe and the patterns it needs. Bad: a type quiz, full-library preload or universal scaffold becomes the entry fee.

[load.complete] skill-smith.recipes
