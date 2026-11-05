---
name: skill-library-creator
description: Create a portable skill library with its own family manager, guided setup, templates and link tools. Use for "create a skill library" or "set up a skill pool"; individual skills belong to the generated manager.
visibility: public
skill-version: 1.3.9
updated: 2026-10-31
companions:
  - path: references/create-library.md
    optional: false
    why: "Guided setup and installation procedure, loaded when creating a library."
  - path: references/upgrades.md
    optional: false
    why: "Reviewed generator upgrades and customization-preserving manual merges."
  - path: templates
    optional: false
    why: "Self-contained manager, authoring resources and onboarding templates."
  - path: scripts
    optional: false
    why: "Portable library operations and native Windows path checks."
triggers:
  - "/skill-library-creator"
  - "create a skill library"
  - "set up a skill pool"
  - "create a family skills manager"
next-skills: []
---

# Skill Library Creator

Create a library under a chosen folder's `skills` directory, with a `{family}-skills-manager` that operates independently of this skill and personal directives. Explain: the library is the physical source, the family is its name prefix, and each machine links selected harness locations to its own local copy of that source.

## Walkthrough

1. Read [creation](references/create-library.md), then explain the result in two or three sentences. Establish the parent folder and family prefix, reuse the supplied purpose, then resolve global or project installation and actual target locations. Use its conditional clarification procedure for unresolved material choices; complete briefs skip the interview and deeper questioning is opt-in. Keep machine paths out of shared configuration.
2. Inspect the physical paths and preview the exact tree and selected local targets. A request to create the library authorizes that scoped creation; resolve collisions before writes.
3. Generate the manager, README, references, scripts and templates. Install direct complete-directory links only within the selected scope. Verify the source and linked bytes separately from runtime discovery.
4. Show what was built, the manager's exact path/name, installation results, and three useful starting requests: help, list skills, create/import a skill. Offer details for the selected capability rather than loading every reference.

For an existing generated manager, read [upgrades](references/upgrades.md). Never regenerate over customizations. The general authoring methodology is owned by [skill-smith](../skill-smith/SKILL.md). For generated-manager design changes, use the bundled [authoring contract](templates/manager/references/authoring-contract.md), a self-contained release copy, with the library-specific [authoring procedure](templates/manager/references/authoring.md). Update that copy only through a reviewed generator change; managers never require skill-smith at runtime.

## Boundaries

- No background work, provider synchronization, external publication, permission administration or global directive changes. Storage permissions decide who can write.
- Resolve the installed creator/manager to its physical directory once, then use physical paths. Locally accessible storage may be a network share, cloud folder, repository, ordinary folder or Lyt vault folder; transport stays with its owner. Follow the bundled [installation adapters](templates/manager/references/installation.md) and active host policy. An unavailable source is not deletion.
- The manager provides the family inventory and help by default. Generate a separate primer only for useful shared domain context or source routing, never a duplicate skill list.
- External enhancements are optional. Keep all required operating instructions, templates and scripts in the generated manager. Missing Node or native metadata tooling blocks dependent automation; read-only manual help remains available.

**Good:** a teammate can start from the shared README, choose their own installation scope, and use the manager without the creator installed. **Bad:** author-specific paths, blind source replacement, copied harness installations that drift, or a clean-link report presented as proof of runtime pickup.

The [protocol](protocol.yon) records setup and upgrade gates. This entrypoint and its selected references remain execution-sufficient without implicit protocol loading.
