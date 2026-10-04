import fs from 'node:fs/promises';
import path from 'node:path';
import { readDirect } from './direct.mjs';

const PROVIDERS = new Set(['codex', 'agy', 'claude']);
const DEFAULT_PROVIDERS = ['codex', 'agy', 'claude'];
const DEFAULT_TIMEOUT_MS = 30_000;
const WATCHDOG_MS = 50_000;

function message(error) {
  return error instanceof Error ? error.message : String(error);
}

function normalizedPath(value) {
  return path.resolve(value).toLowerCase();
}

async function noFollowExisting(target, label) {
  if (typeof target !== 'string' || !path.isAbsolute(target)) {
    throw new Error(`${label} must be an absolute path`);
  }
  const resolved = path.resolve(target);
  let targetStat;
  for (let current = resolved, first = true;; current = path.dirname(current), first = false) {
    const stat = await fs.lstat(current);
    if (first) targetStat = stat;
    if (stat.isSymbolicLink()) throw new Error(`${label} must not traverse a link or redirect`);
    const real = await fs.realpath(current);
    if (normalizedPath(real) !== normalizedPath(current)) {
      throw new Error(`${label} must not traverse a link or redirect`);
    }
    const parent = path.dirname(current);
    if (parent === current) return { resolved, stat: targetStat };
  }
}

async function newOutputDirectory(target) {
  if (typeof target !== 'string' || !path.isAbsolute(target)) {
    throw new Error('outputDirectory must be an absolute path');
  }
  const resolved = path.resolve(target);
  try {
    await fs.lstat(resolved);
    throw new Error('outputDirectory must not already exist');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  const parent = path.dirname(resolved);
  const parentInfo = await noFollowExisting(parent, 'outputDirectory parent');
  if (!parentInfo.stat.isDirectory()) throw new Error('outputDirectory parent must be a directory');
  await fs.mkdir(resolved, { mode: 0o700 });
  return (await noFollowExisting(resolved, 'outputDirectory')).resolved;
}

async function executable(value, provider) {
  const info = await noFollowExisting(value, `${provider} executable`);
  if (!info.stat.isFile()) throw new Error(`${provider} executable must be a regular file`);
  return info.resolved;
}

async function parseSpec(specPath) {
  const info = await noFollowExisting(specPath, 'spec');
  if (!info.stat.isFile()) throw new Error('spec must be a regular file');
  let spec;
  try {
    spec = JSON.parse(await fs.readFile(info.resolved, 'utf8'));
  } catch (error) {
    throw new Error(`invalid spec JSON: ${message(error)}`);
  }
  if (!spec || typeof spec !== 'object' || Array.isArray(spec)) throw new Error('spec must be a JSON object');
  const allowedFields = new Set(['outputDirectory', 'providers', 'executables', 'timeoutMs', 'history', 'transport']);
  if (Object.keys(spec).some(key => !allowedFields.has(key))) throw new Error('Unknown spec field; unsupported options must not be silently ignored');
  if (spec.transport !== undefined && spec.transport !== 'cli') throw new Error('unsupported-transport: this reader supports CLI usage only; no direct API fallback is implemented');
  const providers = spec.providers === undefined ? DEFAULT_PROVIDERS : spec.providers;
  if (!Array.isArray(providers) || !providers.length || providers.some((item) => typeof item !== 'string' || !PROVIDERS.has(item)) || new Set(providers).size !== providers.length) {
    throw new Error('providers must be a non-empty unique array of codex, agy, and claude');
  }
  const timeoutMs = spec.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > DEFAULT_TIMEOUT_MS) {
    throw new Error('timeoutMs must be an integer between 1 and 30000');
  }
  if (spec.history !== undefined && typeof spec.history !== 'boolean') throw new Error('history must be boolean');
  if (spec.executables !== undefined && (!spec.executables || typeof spec.executables !== 'object' || Array.isArray(spec.executables))) {
    throw new Error('executables must be an object');
  }
  if (Object.keys(spec.executables ?? {}).some(key => !['codex', 'agy'].includes(key))) throw new Error('Unknown executable route; the Claude quota route is interactive');
  const executables = {};
  for (const provider of ['codex', 'agy']) {
    const value = spec.executables?.[provider];
    if (value !== undefined) executables[provider] = value;
  }
  return {
    outputDirectory: await newOutputDirectory(spec.outputDirectory),
    providers,
    executables,
    timeoutMs,
    history: spec.history ?? false,
  };
}

function unavailable(provider, observedAt, detail) {
  return {
    provider,
    transport: 'cli',
    source: provider === 'claude' ? 'interactive-/usage' : 'direct',
    status: 'unavailable',
    runtimeVersion: null,
    observedAt: null,
    windows: [],
    credits: null,
    activity: null,
    errors: [detail],
    processes: [],
  };
}

async function writeReport(outputDirectory, report) {
  await fs.writeFile(path.join(outputDirectory, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
}

async function providerDirectories(outputDirectory, providers) {
  const directories = {};
  for (const provider of providers) {
    const target = path.join(outputDirectory, provider);
    await fs.mkdir(target, { mode: 0o700 });
    directories[provider] = (await noFollowExisting(target, `${provider} outputDirectory`)).resolved;
  }
  return directories;
}

async function main() {
  const checkedAt = new Date().toISOString();
  if (process.argv.length !== 3) throw new Error('Usage: node usage.mjs <absolute-spec.json>');
  const spec = await parseSpec(process.argv[2]);
  const outputDirectories = await providerDirectories(spec.outputDirectory, spec.providers);
  const results = await Promise.all(spec.providers.map(async (provider) => {
    const observedAt = new Date().toISOString();
    if (provider === 'claude') {
      return unavailable('claude', observedAt, 'Claude subscription quota is available through live TTY /usage; no pure headless quota route is supported.');
    }
    const binary = spec.executables[provider];
    if (!binary) return unavailable(provider, observedAt, `${provider} executable was not supplied`);
    try {
      const resolvedBinary = await executable(binary, provider);
      return await readDirect(provider, resolvedBinary, outputDirectories[provider], {
        timeoutMs: spec.timeoutMs,
        history: spec.history,
      });
    } catch (error) {
      return {
        ...unavailable(provider, observedAt, message(error)),
        status: 'error',
      };
    }
  }));
  const report = {
    schemaVersion: 1,
    checkedAt,
    completedAt: new Date().toISOString(),
    results,
  };
  let persistenceFailed = false;
  try { await writeReport(spec.outputDirectory, report); }
  catch (error) {
    persistenceFailed = true;
    report.errors = [{ source: 'report-file', message: message(error) }];
  }
  process.stdout.write(`${JSON.stringify(report)}\n`);
  const live = results.filter((result) => result.status === 'live').length;
  process.exitCode = persistenceFailed ? 1 : live === results.length ? 0 : live ? 2 : 1;
}

let watchdog = setTimeout(() => {
  process.stderr.write('headless usage watchdog expired\n');
  process.exit(1);
}, WATCHDOG_MS);

main().catch((error) => {
  const report = {
    schemaVersion: 1,
    checkedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    results: [{
      provider: 'spec', source: 'local', status: 'error', observedAt: null,
      windows: [], credits: null, activity: null, errors: [message(error)], processes: [],
    }],
  };
  process.stdout.write(`${JSON.stringify(report)}\n`);
  process.exitCode = 1;
}).finally(() => clearTimeout(watchdog));
