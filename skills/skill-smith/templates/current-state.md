# Current-state output template

Adapt this into the generated skill's own template. Choose metadata through the [consumer contract](../references/patterns/metadata.md). The fields below are candidates, not a universal schema. Double-braced values are runtime fields, filled when the corresponding state is produced; final records must not retain them.

```yaml
---
subject: "{{subject}}"
as-of: "{{observed_through}}"
covers: []
sources: []
---
```

# {{subject}} current state

{{current_facts_with_evidence}}

## Open or uncertain

{{unresolved_items_and_coverage_gaps}}

## Next action

{{next_action_and_authority}}

Define covers as exact committed entry identities or a proven equivalent coverage boundary; a highest sequence alone does not prove there are no gaps. Include the declared authority and recovery route where the consumer needs them. Do not copy the whole journal into current state.
