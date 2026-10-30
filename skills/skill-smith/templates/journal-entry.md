# Journal-entry output template

Adapt this into the generated record-keeper's own template. Select fields and types through the [consumer contract](../references/patterns/metadata.md). Double-braced values are runtime fields for each new entry, not facts to invent during skill creation.

```yaml
---
id: "{{entry_identity}}"
subject: "{{subject}}"
occurred: "{{event_time}}"
recorded: "{{recording_time}}"
kind: "{{event_or_correction}}"
sources: []
corrects: []
---
```

# {{entry_title}}

{{observation_or_change_and_its_evidence}}

Effect on current state: {{committed_effect_or_partial_status}}
Unresolved: {{material_uncertainty_or_explicit_none}}

Use the declared yyyy-mm-dd--NN--slug filename grammar with exclusive allocation. A correction points to the earlier entry without erasing it. Resolve runtime fields in the final entry; omit inapplicable optional fields rather than generating empty ceremony.
