// headless-family:projection
// Discovery only: never starts a CLI, reads credentials or calls a provider.
// On Windows it runs read-only `reg.exe query` to read the persisted user/machine Path.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const COMMANDS = { codex: 'codex', claude: 'claude', agy: 'agy', grok: 'grok' };
// Provider default install directories, relative to the user profile; checked last.
const KNOWN_DIRS = { grok: [['.grok', 'bin']] };
const MAX_ENTRIES = 128;
const SUFFIXES = process.platform === 'win32' ? ['.exe', '.cmd', '.bat', '.ps1'] : [''];

function usableDir(entry) {
  const dir = entry.replace(/^"|"$/g, '');
  return path.isAbsolute(dir) && !(process.platform === 'win32' && dir.startsWith('\\\\')) ? dir : null;
}

function search(dirs, command) {
  for (const dir of dirs) {
    for (const suffix of SUFFIXES) {
      try { return inspect(path.join(dir, command + suffix)); }
      catch { /* Unreadable/non-executable entries are not usable discoveries. */ }
    }
  }
  return null;
}

// Persisted Path of one registry scope; a parent started before an install keeps a stale copy.
function registryPath(key, env) {
  try {
    const reg = path.join(env.SystemRoot ?? env.SYSTEMROOT ?? 'C:\\Windows', 'System32', 'reg.exe');
    const out = execFileSync(reg, ['query', key, '/v', 'Path'], { encoding: 'utf8', timeout: 5000, windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'] });
    const match = /^\s*Path\s+REG_(?:EXPAND_)?SZ\s+(.*)$/im.exec(out);
    if (!match) return [];
    return match[1].trim().replace(/%([^%]+)%/g, (whole, name) => env[name] ?? env[name.toUpperCase()] ?? whole).split(';').filter(Boolean);
  } catch { return []; }
}

function outsideLocations(env, processDirs) {
  const seen = new Set(processDirs.map(dir => path.resolve(dir).toLowerCase()));
  const locations = [];
  const add = (source, entries) => {
    const dirs = entries.slice(0, MAX_ENTRIES).map(usableDir).filter(dir => dir && !seen.has(path.resolve(dir).toLowerCase()));
    dirs.forEach(dir => seen.add(path.resolve(dir).toLowerCase()));
    if (dirs.length) locations.push({ source, dirs });
  };
  if (process.platform === 'win32') {
    add('user-registry-path', registryPath('HKCU\\Environment', env));
    add('machine-registry-path', registryPath('HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment', env));
  }
  return locations;
}

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
  let outside;
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
    if (entries.length > MAX_ENTRIES) return { ...base, status: 'discovery-limited', nextAction: 'Provide an explicit executable path; PATH exceeds the bounded discovery limit.' };
    const processDirs = entries.map(usableDir).filter(Boolean);
    const found = search(processDirs, COMMANDS[route.provider]);
    if (found) return { ...base, ...found };
    outside ??= outsideLocations(env, processDirs);
    const profile = env.USERPROFILE ?? env.HOME;
    const known = profile && path.isAbsolute(profile) ? (KNOWN_DIRS[route.provider] ?? []).map(parts => path.join(profile, ...parts)) : [];
    for (const { source, dirs } of [...outside, { source: 'known-install-dir', dirs: known }]) {
      const hit = search(dirs, COMMANDS[route.provider]);
      if (hit) return { ...base, ...hit, status: hit.status === 'cli-found' ? 'found-outside-process-path' : hit.status, foundVia: source,
        note: 'Not on this process PATH: the parent PATH is likely stale (CLI installed after the parent started). Use the absolute path or restart the parent; this checker never edits PATH.',
        nextAction: `Pass ${hit.executable} as the explicit executable, then verify current version/help, authentication route, requested model and parent supervision before inference.` };
    }
    return { ...base, status: 'missing-cli', nextAction: `The ${COMMANDS[route.provider]} CLI was not found on this process PATH, the persisted user/machine Path or known install directories. Check an existing installation or provide its absolute path; installation and login are separate actions.` };
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
