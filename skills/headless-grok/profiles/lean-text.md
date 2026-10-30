---
name: lean-smoke
description: Literal response test without tools or discovered skills.
promptMode: full
agentsMd: false
discoverSkills: false
injectDefaultTools: false
tools: [read_file]
disallowedTools: [read_file, search_tool, use_tool]
permissionMode: dontAsk
maxTurns: 1
---
Return only the literal response requested. No tool use.