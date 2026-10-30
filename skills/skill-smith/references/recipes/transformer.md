# Transformer

Load through [recipe conventions](../recipes.md) when a skill turns supplied input into a defined output.

- **Setup and shape:** name accepted input, output form, audience and what must survive: meaning, numbers, units, negations, uncertainty and provenance as applicable. One self-contained file is often enough. Add an output template only when its shape is reused.
- **Modus operandi:** check material input requirements; transform only the requested content. Preserve ambiguities rather than inventing missing facts. Keep source and output distinguishable and expose any requested loss or normalization. External actions are outside the transformation unless explicitly authorized.
- **Maintenance/doctor:** compare representative input/output and a meaningful failure case after changing the transformation. Diagnose whether the defect is missing input, an incompatible output consumer or a lost invariant.
- **Housekeeping:** ordinary inline transformations need no history, operations folder or scheduled doctor. If files are produced, declare their locations and retain source/recovery material until disposition is resolved.

For conflicting structured-data consumers, load [metadata](../patterns/metadata.md) rather than flattening their schemas. Return the output contract and preservation checks to the calling method; stop on a missing requirement that would change the result.

Good: a small formatter stays one file. Bad: formatting silently rewrites values or acquires a journal.

[load.complete] skill-smith.recipe.transformer
