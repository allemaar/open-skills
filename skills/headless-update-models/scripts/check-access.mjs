// headless-family:projection
// Discovery only: never starts a CLI, reads credentials or calls a provider.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const COMMANDS = { codex: 'codex', claude: 'claude', agy: 'agy', grok: 'grok' };

function inspect(candidate) {
  if (!path.isAbsolute(candidate)) throw Error('Executable must be an absolute local path');
  if (process.platform === 'win32' && candidate.startsWith('\\\\')) throw Error('Network executable discovery is unsupported');
  const resolved = fs.realpathSync(candidate);
  if (!fs.statSync(resolved).isFile()) throw Error('Executable is not a regular file');
  if (process.platform !== 'win32') fs.accessSync(resolved, fs.constants.X_OK);
  const launcherRequired = process.platform === 'win32' && path.extname(resolved).toLowerCase() !== '.exe';
  return { executable: resolved, status: launcherRequired ? 'launcher-required' : 'cli-found',
    nextAction: launcherRequired ? 'Inspect the installed shim and resolve its native executable or verified interpreter entrypoint; never shell-interpolate a prompt.' : 'Verify current version/help, authentication route, requested model and parent supervision before inference.' };
}

export function checkAccess(spec = {}, env = process.env) {
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) throw Error('Spec must be an object');
  const routes = spec.routes ?? Object.keys(COMMANDS).map(provider => ({ provider, transport: 'cli' }));
  if (!Array.isArray(routes) || routes.length < 1 || routes.length > 16) throw Error('routes must contain 1 through 16 entries');
  const identities = new Set();
  const results = routes.map(route => {
    if (!route || typeof route !== 'object' || Array.isArray(route) || typeof route.provider !== 'string' || !Object.hasOwn(COMMANDS, route.provider)) throw Error('Unknown provider; supported adapters are codex, claude, agy and grok');
    const transport = route.transport ?? 'cli';
    if (!['cli', 'api'].includes(transport)) throw Error('transport must be cli or api');
    const identity = `${route.provider}:${transport}`;
    if (identities.has(identity)) throw Error('Duplicate route');
    identities.add(identity);
    const base = { provider: route.provider, transport, authentication: 'unknown', modelAccess: 'unknown', executable: null };
    if (transport === 'api') return { ...base, status: 'unsupported-transport', nextAction: 'No direct inference API adapter is shipped. Do not substitute CLI login or infer API access from a key or model listing.' };
    if (route.executable !== undefined) {
      try { return { ...base, ...inspect(route.executable) }; }
      catch (error) { return { ...base, status: 'invalid-executable', nextAction: 'Provide the verified local executable path.', error: error.code ?? error.message }; }
    }
    const entries = (env.PATH ?? env.Path ?? '').split(path.delimiter).filter(Boolean);
    if (entries.length > 128) return { ...base, status: 'discovery-limited', nextAction: 'Provide an explicit executable path; PATH exceeds the bounded discovery limit.' };
    const suffixes = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', '.ps1'] : [''];
    for (const entry of entries) {
      const dir = entry.replace(/^"|"$/g, '');
      if (!path.isAbsolute(dir) || (process.platform === 'win32' && dir.startsWith('\\\\'))) continue;
      for (const suffix of suffixes) {
        try { return { ...base, ...inspect(path.join(dir, COMMANDS[route.provider] + suffix)) }; }
        catch { /* Unreadable/non-executable entries are not usable discoveries. */ }
      }
    }
    return { ...base, status: 'missing-cli', nextAction: `The ${COMMANDS[route.provider]} CLI was not found in this process's local PATH. Check an existing installation or provide its absolute path; installation and login are separate actions.` };
  });
  return { schemaVersion: 1, checkedAt: new Date().toISOString(), platform: process.platform,
    nodeVersion: process.version, parentSupervision: 'not-verified', results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length > 1 || (args[0] && !path.isAbsolute(args[0]))) throw Error('Usage: node check-access.mjs [absolute-spec.json]');
    const spec = args[0] ? JSON.parse(fs.readFileSync(args[0], 'utf8')) : {};
    const report = checkAccess(spec);
    console.log(JSON.stringify(report));
    process.exitCode = report.results.every(result => result.status === 'cli-found') ? 0 : 2;
  } catch (error) {
    console.log(JSON.stringify({ schemaVersion: 1, status: 'invalid-spec', error: error.message }));
    process.exitCode = 1;
  }
}
