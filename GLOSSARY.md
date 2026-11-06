# Glossary

**Handler:** the participant directing the work and owning its objective and relevant approval gates. The caller may be a person or another agent; an agent caller does not replace human approval where applicable rules require it.

**Skill:** a reusable capability whose entrypoint is SKILL.md. Its description helps an agent select it; its body and selected resources define the procedure.

**Protocol:** an accompanying protocol.yon declaring inspectable steps, rules and gates. Structural validation does not prove an agent follows them. Not every skill needs a protocol.

**Family:** a catalog grouping that helps readers find related skills. It does not install or invoke those skills.

**Guide:** the reader-facing explanation of when a skill helps, how to use it and what a useful result looks like. The source remains authoritative.

**Workflow recipe:** an example of using capabilities toward a job. Following a recipe does not authorize every later action it mentions.

**Owner:** the procedure or tool responsible for an operation or maintained artifact. Naming an owner does not supply missing tools or permission.

**Companion:** an additional skill resource or sibling capability needed by a selected route. Required companions must be installed together; optional companions apply only to their stated condition.

**Source checkout:** the repository files used to author or supply skills. A direct installed link reads these same files, so changing the checkout can affect several runtimes.

**Installed copy:** files placed in a runtime or project skill directory. They may have local edits and can lag their upstream source.

**Managed installation:** an installation whose existing plugin or package manager owns its files and update metadata. Its update behavior must be checked for that manager.

**Verified installation:** an observed inventory, source identity and content comparison. Runtime discovery and successful task behavior are separate observations.

**Formal handoff:** an explicitly selected transfer with its receiving procedure, required sources and agreed result. A document used only as background does not select that procedure.
