# Lean literal text runs

Use this route for simple literal text work that needs no tools, repository instructions, discovered skills or delegation. It is a tested profile for that task, not a universal profile for arbitrary work. Revalidate the target platform, CLI version, flag spelling, profile fields and event schema before each run. See [validation](validation.md) for the dated trial and its limits.

The bundled [lean-text profile](../profiles/lean-text.md) preserves the tested `lean-smoke.md` bytes, including its internal name. `promptMode: full` replaces the normal prompt; `agentsMd: false`, `discoverSkills: false`, and `injectDefaultTools: false` reduce injected context. The tested profile supplies `read_file` and then denies it, together with the discovery meta-tools. Do not simplify that combination or replace it with `--tools ""`: the earlier trial still advertised tools and discovered skills with an empty tools argument.

Pass this exact tested argument shape as separate arguments with shell execution disabled, substituting only the approved prompt, absolute bundled profile path, and currently listed authorized model/effort:

```text
grok -p "Return exactly GROK_LEAN_OK 42." --agent <absolute-skill-directory>/profiles/lean-text.md --model grok-4.7 --reasoning-effort low --max-turns 1 --output-format streaming-json --permission-mode dontAsk --no-subagents --disable-web-search --verbatim --disallowed-tools read_file,search_tool,use_tool
```

For the tested run, the supervisor applied these overrides only to the child environment, without persistent environment or global configuration edits:

```text
GROK_DISABLE_AUTOUPDATER=1
GROK_MEMORY=0
GROK_SUBAGENTS=0
GROK_GOAL=0
GROK_WRITE_FILE=0
GROK_WEB_FETCH=0
GROK_WORKFLOWS=0
GROK_CURSOR_SKILLS_ENABLED=0
GROK_CURSOR_RULES_ENABLED=0
GROK_CURSOR_AGENTS_ENABLED=0
GROK_CURSOR_MCPS_ENABLED=0
GROK_CURSOR_HOOKS_ENABLED=0
GROK_CLAUDE_SKILLS_ENABLED=0
GROK_CLAUDE_RULES_ENABLED=0
GROK_CLAUDE_AGENTS_ENABLED=0
GROK_CLAUDE_MCPS_ENABLED=0
GROK_CLAUDE_HOOKS_ENABLED=0
```

The tested CLI did not locally support the legacy `--no-memory` and `--no-auto-update` flags. Verify environment support on the target version; do not guess replacements. Do not clear route variables automatically. The trial checked the route-variable names listed in [setup and login](setup-and-login.md) as absent.

The trial's reviewed workspace `.grok/config.toml` contained exactly:

```toml
[plugins]
disabled = ["stripe", "neon"]
```

These are named workspace plugin disables for that host. They neither disable all plugins nor authorize changing another workspace or global settings. Review relevant plugins and customization sources on the actual host. Startup still scanned plugin and permission configuration and emitted warnings, including a Stripe unsupported-event warning despite that workspace disable. Do not promise scan-free startup.

Use the normal owned supervisor with concurrent retained stdout/stderr, a checkpoint within 60 seconds, external deadline and scoped cancellation. The tested timeout was 120 seconds, shutdown grace 5 seconds and maximum turns 1. Require every `available_commands` event to advertise `tools: []`, no tool actions, the exact expected text and a complete terminal `end` event with accepted model/auth evidence. Inspect all warnings and errors. Zero advertised tools is an output acceptance check, not proof of OS containment or inability to access files/network. Stop work that requires an unverified isolation boundary.
