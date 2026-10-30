#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { guard, leaf, tree, hash, inside, equalPath, makeDirectory, writeNew, replace, copyTree, linkTarget, createLink, preflightLink, removeLink, stateRoot } from './safety.mjs';

export const VERSION = '1.3.8';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(HERE);
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const date = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};
const token = () => crypto.randomBytes(12).toString('hex');
const bytesAt = p => fs.readFileSync(p);
function skillText(bytes) {
  const text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  if (text.startsWith('\uFEFF')) throw new Error('Normalize the UTF-8 BOM in a reviewed source/draft before using this helper.');
  return text;
}
function snapshotBytes(root, rows, rel, cloud) {
  const expected = rows.find(row => row.path === rel && row.type === 'file');
  const bytes = bytesAt(guard(path.join(root, rel), cloud));
  if (!expected || hash(bytes) !== expected.sha256) throw new Error(`File differs from captured snapshot: ${root}/${rel}`);
  return bytes;
}
function oneDriveRoot(p) {
  return ['OneDriveCommercial', 'OneDriveConsumer', 'OneDrive'].map(key => process.env[key]).filter(value => value && path.isAbsolute(value)).map(value => path.resolve(value)).find(root => inside(root, p)) || null;
}
function policy(options, root, readOnly = false) {
  const selected = options['cloud-roots'] ? JSON.parse(options['cloud-roots']) : [];
  if (!Array.isArray(selected) || selected.some(p => typeof p !== 'string' || !path.isAbsolute(p))) throw new Error('--cloud-roots requires a JSON array of confirmed absolute provider roots.');
  const extraMount = options['mount-root'] ? path.resolve(options['mount-root']) : null;
  return { cloudRoot: options['cloud-root'] ? path.resolve(options['cloud-root']) : oneDriveRoot(root), cloudRoots: [...selected, ...['OneDriveCommercial', 'OneDriveConsumer', 'OneDrive'].map(key => process.env[key]).filter(p => p && path.isAbsolute(p))], mountRoot: extraMount && inside(extraMount, root) ? extraMount : root, mountRoots: [extraMount, options.from, options.recovery, options.project].filter(Boolean).map(p => path.resolve(p)), readOnly };
}
const uniquePaths = values => values.filter((p, i) => values.findIndex(other => equalPath(other, p)) === i);
function storage(root, cloud) {
  const marker = [root, path.dirname(root), path.dirname(path.dirname(root))].map(p => path.join(p, '.git')).find(p => leaf(p));
  return { kind: cloud?.cloudRoot ? 'confirmed-cloud-root' : root.startsWith('\\\\') ? 'network-path' : marker ? 'repository-marker' : 'directory', basis: cloud?.cloudRoot ? 'confirmed provider root plus native CLOUD-tag checks' : marker ? 'nearby .git marker; repository ownership and sync unverified' : 'filesystem capabilities; provider identity unnecessary', syncState: 'not-observed', mountRoot: cloud?.mountRoot || null };
}

function validName(value) {
  if (!value || !NAME.test(value) || value.length > 64 || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(value)) throw new Error(`Invalid name: ${value}`);
  return value;
}
function render(text, vars) {
  return text.replace(/\{\{([A-Z_]+)\}\}/g, (whole, key) => {
    if (!Object.hasOwn(vars, key)) throw new Error(`Unknown template token: ${key}`);
    return vars[key];
  });
}
function readJson(p, cloud) { guard(p, cloud); return JSON.parse(fs.readFileSync(p, 'utf8')); }
function parseVersion(value) {
  if (typeof value !== 'string') return null;
  const m = value.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/);
  if (!m) return null;
  const pre = m[4]?.split('.') || [];
  if (pre.some(p => /^0\d+$/.test(p))) return null;
  return { core: m.slice(1, 4).map(BigInt), pre };
}
export function compareVersions(a, b) {
  const left = parseVersion(a), right = parseVersion(b);
  if (!left || !right) throw new Error('Invalid semantic version.');
  for (let i = 0; i < 3; i++) if (left.core[i] !== right.core[i]) return left.core[i] > right.core[i] ? 1 : -1;
  if (!left.pre.length || !right.pre.length) return left.pre.length ? -1 : right.pre.length ? 1 : 0;
  for (let i = 0; i < Math.max(left.pre.length, right.pre.length); i++) {
    const x = left.pre[i], y = right.pre[i];
    if (x === y) continue;
    if (x === undefined || y === undefined) return x === undefined ? -1 : 1;
    const xn = /^\d+$/.test(x), yn = /^\d+$/.test(y);
    if (xn && yn) return BigInt(x) > BigInt(y) ? 1 : -1;
    if (xn !== yn) return xn ? -1 : 1;
    return x > y ? 1 : -1;
  }
  return 0;
}
function validPoolMetadata(fields) {
  const stamp = fields.updated;
  return !!fields.description && !!parseVersion(fields['skill-version']) && /^\d{4}-\d{2}-\d{2}$/.test(stamp) && Number.isFinite(Date.parse(`${stamp}T00:00:00Z`)) && new Date(`${stamp}T00:00:00Z`).toISOString().slice(0, 10) === stamp;
}
export function contentDigest(rows) {
  const portable = rows.filter(row => row.path !== '.').map(({ path, type, sha256 }) => ({ path, type, ...(type === 'file' ? { sha256 } : {}) })).sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
  return hash(json(portable));
}
function verifyOriginal(provenance, rows) {
  if (!Array.isArray(provenance.originalFiles) || hash(json(provenance.originalFiles)) !== provenance.originalDigest) throw new Error('Recorded original snapshot is missing or inconsistent; review ancestry before migration.');
  const expected = contentDigest(provenance.originalFiles);
  if (provenance.originalContentDigest && provenance.originalContentDigest !== expected) throw new Error('Recorded portable ancestry is inconsistent.');
  if (contentDigest(rows) !== expected) throw new Error('Retained upstream baseline differs from provenance or original content changed; resolve before comparing or adopting.');
  const recorded = new Map(provenance.originalFiles.map(row => [row.path, row]));
  return { basis: 'path-type-sha256-v1', digest: expected, provenanceBasis: provenance.originalContentDigest ? 'recorded-portable' : 'derived-from-verified-legacy-snapshot', recordedPlatform: provenance.originalPlatform || 'unknown', observedPlatform: process.platform, permissionChanges: rows.filter(row => recorded.has(row.path) && recorded.get(row.path).mode !== row.mode).map(row => ({ path: row.path, recorded: recorded.get(row.path).mode, observed: row.mode })), note: 'Native modes are observations, not portable ancestry. Review executable permissions before running scripts; local write guards still compare complete native snapshots.' };
}
function pendingLocks(ctx, sharedOnly = false) {
  const locations = [{ scope: 'shared', path: path.join(ctx.root, '.library/mutation.lock'), policy: ctx.cloud }];
  if (!sharedOnly) locations.push({ scope: 'private', path: path.join(ctx.state, 'mutation.lock'), policy: ctx.privatePolicy });
  return locations.filter(row => leaf(row.path)).map(row => {
    try { return { scope: row.scope, path: row.path, record: readJson(row.path, row.policy) }; }
    catch (error) { return { scope: row.scope, path: row.path, error: error.message }; }
  }).filter(row => !activeMutation || row.record?.id !== activeMutation.id);
}
function setField(text, key, value) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!fm) throw new Error('SKILL.md requires YAML frontmatter.');
  const lines = fm[1].split(/\r?\n/);
  const matches = lines.map((line, i) => line.startsWith(`${key}:`) ? i : -1).filter(i => i >= 0);
  if (matches.length > 1) throw new Error(`Duplicate frontmatter key: ${key}`);
  if (matches.length) {
    const i = matches[0];
    if (/^[>|]/.test(lines[i].split(':').slice(1).join(':').trim())) throw new Error(`Normalize folded ${key} before import.`);
    lines[i] = `${key}: ${value}`;
  } else lines.push(`${key}: ${value}`);
  return `---\n${lines.join('\n')}\n---\n${text.slice(fm[0].length)}`;
}
export function metadata(text) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!fm) throw new Error('Missing frontmatter');
  const result = {};
  for (const key of ['name', 'description', 'family', 'skill-version', 'updated', 'self-improvable']) {
    const matches = [...fm.matchAll(new RegExp(`^(?:${key}|"${key}"|'${key}')[ \\t]*:[ \\t]*([^\\r\\n]*)$`, 'gm'))];
    if (matches.length > 1) throw new Error(`Duplicate frontmatter key: ${key}`);
    const raw = matches[0]?.[1]?.trim() || '';
    if (matches[0] && !matches[0][0].startsWith(`${key}:`)) throw new Error(`Normalize quoted frontmatter key: ${key}`);
    const quoted = /^["']/.test(raw);
    if (!quoted && /^[!&*[{?]/.test(raw)) throw new Error(`Normalize unsupported frontmatter value: ${key}`);
    let scalar;
    if (quoted) {
      const token = raw.match(/^("(?:[^"\\]|\\.)*"|'(?:[^']|'')*')(?:[ \t]+#.*)?$/)?.[1];
      if (!token) throw new Error(`Normalize quoted frontmatter value: ${key}`);
      try { scalar = token.startsWith('"') ? JSON.parse(token) : token.slice(1, -1).replaceAll("''", "'"); }
      catch { throw new Error(`Normalize unsupported quoted frontmatter value: ${key}`); }
    } else {
      scalar = raw.replace(/[ \t]+#.*$/, '').trim();
      if (/:(?:\s|$)/.test(scalar)) throw new Error(`Quote frontmatter value containing a mapping separator: ${key}`);
    }
    result[key] = !quoted && (/^(?:null|~)$/i.test(scalar) || scalar.startsWith('#') || key === 'description' && /^(?:true|false|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|[-+]?\.inf|\.nan)$/i.test(scalar)) ? '' : scalar.trim();
  }
  // Folded descriptions are supported for inventory; mutations preserve them.
  if (/^[>|]/.test(result.description)) {
    result.description = fm.match(/^description:[ \t]*[>|][+-]?\r?\n((?:[ \t]+[^\r\n]*\r?\n?)+)/m)?.[1]?.trim().replace(/\s+/g, ' ') || '';
  }
  return result;
}
function context(options, sourceOnly = false) {
  if (!options.library) throw new Error('--library must name the physical skills directory.');
  const root = path.resolve(options.library);
  const cloud = policy(options, root, sourceOnly);
  guard(root, cloud);
  const configPath = path.join(root, 'library.json');
  const configBytes = bytesAt(guard(configPath, cloud));
  const config = JSON.parse(configBytes);
  if (config.schema !== 1 || !/^[a-f0-9]{24}$/.test(config.id) || !Array.isArray(config.retired) || !config.managed || typeof config.managed !== 'object') throw new Error('Unsupported library configuration.');
  validName(config.family);
  for (const name of config.retired) if (!validName(name).startsWith(`${config.family}-`)) throw new Error('Invalid retirement name.');
  for (const [rel, digest] of Object.entries(config.managed)) {
    if (path.isAbsolute(rel) || rel.split(/[\\/]/).some(p => !p || p === '.' || p === '..') || !/^[a-f0-9]{64}$/.test(digest)) throw new Error('Invalid managed-file coordinate.');
  }
  if (sourceOnly) return { root, cloud, configPath, config, configHash: hash(configBytes) };
  const state = path.join(path.resolve(options.state || stateRoot()), config.id);
  if (inside(root, state) || inside(state, root)) throw new Error('Machine-local state must be outside library sources.');
  const privatePolicy = policy(options, state);
  guard(state, privatePolicy);
  const stateFile = path.join(state, 'installation.json');
  const localHash = leaf(stateFile) ? hash(bytesAt(guard(stateFile, privatePolicy))) : null;
  const local = localHash ? readJson(stateFile, privatePolicy) : { schema: 1, libraryId: config.id, targets: [], links: {} };
  if (local.schema !== 1 || local.libraryId !== config.id || !Array.isArray(local.targets) || !local.links || typeof local.links !== 'object') throw new Error('Invalid local installation state.');
  for (const target of local.targets) {
    if (typeof target !== 'string' || !path.isAbsolute(target) || inside(root, target) || inside(target, root) || inside(state, target) || inside(target, state)) throw new Error('Invalid or overlapping local target.');
  }
  for (const [dest, row] of Object.entries(local.links)) {
    if (!path.isAbsolute(dest) || !local.targets.some(p => equalPath(p, path.dirname(dest))) || !validName(path.basename(dest)).startsWith(`${config.family}-`) || typeof row.target !== 'string' || !path.isAbsolute(row.target)) throw new Error('Invalid local link receipt.');
  }
  for (const [caller, row] of Object.entries(local.adoptions || {})) {
    if (!path.isAbsolute(caller) || !row || !/^[a-f0-9]{24}$/.test(row.id) || !validName(row.name).startsWith(`${config.family}-`) || !path.isAbsolute(row.target) || !path.isAbsolute(row.recovery)) throw new Error('Invalid adoption receipt.');
  }
  cloud.mountRoots.push(...local.targets, ...Object.keys(local.adoptions || {}));
  return { root, cloud, privatePolicy, configPath, config, configHash: hash(configBytes), state, stateFile, local, localHash };
}
function saveLocal(ctx) {
  makeDirectory(ctx.state, ctx.privatePolicy, 0o700);
  const payload = json(ctx.local);
  if (ctx.localHash) replace(ctx.stateFile, payload, ctx.localHash, ctx.privatePolicy); else writeNew(ctx.stateFile, payload, ctx.privatePolicy, 0o600);
  ctx.localHash = hash(bytesAt(ctx.stateFile));
}
function saveRecovery(ctx, value) {
  makeDirectory(ctx.state, ctx.privatePolicy, 0o700);
  const p = path.join(ctx.state, 'recovery', `${token()}.json`);
  writeNew(p, json({ ...value, receipt: { schema: 1, libraryId: ctx.config.id, mutationId: activeMutation?.id || null, operation: activeMutation?.operation || value.operation || null, created: new Date().toISOString() } }), ctx.privatePolicy, 0o600);
  if (activeMutation) activeMutation.recovery = p;
  return p;
}
export function recordRecovery(options, plan) {
  const ctx = context(options);
  if (!activeMutation || activeMutation.libraryId !== ctx.config.id) throw new Error('Recovery recording requires this library\'s active guarded mutation.');
  return saveRecovery(ctx, plan);
}
function saveConfig(ctx) {
  replace(ctx.configPath, json(ctx.config), ctx.configHash, ctx.cloud);
  ctx.configHash = hash(bytesAt(ctx.configPath));
}
export function discover(ctx, { metadataOnly = false, tolerant = false } = {}) {
  const entries = [];
  const invalid = [];
  for (const name of fs.readdirSync(ctx.root).sort()) {
    if (!name.startsWith(`${ctx.config.family}-`)) continue;
    try {
    validName(name);
    const source = path.join(ctx.root, name);
    guard(source, ctx.cloud);
    if (!leaf(source)?.isDirectory()) throw new Error(`Family name collides with a non-directory: ${source}`);
    const md = path.join(source, 'SKILL.md');
    const mdBytes = bytesAt(guard(md, ctx.cloud));
    const fields = metadata(skillText(mdBytes));
    if (fields.name !== name || fields.family !== ctx.config.family) throw new Error(`Name/family mismatch: ${md}`);
    if (!validPoolMetadata(fields)) throw new Error(`Missing description or invalid version/date: ${md}`);
    if (ctx.config.retired.includes(name)) throw new Error(`Retired name is active: ${name}`);
    const files = metadataOnly ? null : tree(source, ctx.cloud);
    if (files && files.find(row => row.path === 'SKILL.md')?.sha256 !== hash(mdBytes)) throw new Error(`Metadata changed during discovery: ${md}`);
    entries.push({ name, description: fields.description, version: fields['skill-version'], updated: fields.updated, selfImprovement: fields['self-improvable'] === 'true' ? 'declared-opt-in' : 'not-declared', source, ...(files ? { digest: hash(json(files)), files } : {}) });
    } catch (error) { if (!tolerant) throw error; invalid.push({ name, error: error.message }); }
  }
  if (!entries.some(row => row.name === `${ctx.config.family}-skills-manager`)) { if (!tolerant) throw new Error('Library manager missing; source may be unavailable.'); invalid.push({ name: `${ctx.config.family}-skills-manager`, error: 'Library manager missing or invalid.' }); }
  entries.invalid = invalid;
  return entries;
}
function managerFiles(family, generatedDate = date(), options = {}) {
  const vars = { FAMILY: family, MANAGER: `${family}-skills-manager`, VERSION, DATE: generatedDate, HELPER: 'scripts/library.mjs' };
  const templates = path.join(SKILL_ROOT, 'templates/manager');
  const resourcePolicy = policy(options, SKILL_ROOT, true);
  if (!leaf(templates)) throw new Error('This command requires the inspected skill-library-creator helper, not the generated manager copy.');
  const result = new Map();
  for (const row of tree(templates, resourcePolicy)) {
    if (row.type === 'directory') continue;
    const bytes = bytesAt(path.join(templates, row.path));
    result.set(row.path, /\.(md|json|txt)$/.test(row.path) ? Buffer.from(render(bytes.toString('utf8'), vars)) : bytes);
  }
  for (const name of ['library.mjs', 'safety.mjs', 'windows-metadata.mjs']) result.set(`scripts/${name}`, bytesAt(guard(path.join(HERE, name), resourcePolicy)));
  return result;
}
function initializeImpl(options) {
  if (!options.folder) throw new Error('--folder must name the chosen parent folder.');
  const family = validName(options.family);
  validName(`${family}-skills-manager`);
  const parent = path.resolve(options.folder);
  const cloud = policy(options, parent);
  guard(parent, cloud);
  if (!leaf(parent)?.isDirectory()) throw new Error('Choose an existing physical parent folder.');
  const root = path.join(parent, 'skills');
  if (leaf(root)) throw new Error('skills already exists; select an empty parent or an existing library with library.json.');
  const generatedDate = date();
  const files = managerFiles(family, generatedDate, options);
  const plan = { operation: 'create', root, family, manager: `${family}-skills-manager`, files: [...files.keys()].flatMap(rel => [`${family}-skills-manager/${rel}`, `.library/generator-base/${rel}`]).concat(['README.md', 'library.json']), machineSettings: 'selected separately on each machine' };
  if (!options.apply) return plan;
  const manager = path.join(root, plan.manager);
  const config = { schema: 1, id: token(), family, purpose: options.purpose || `${family} skills and their supporting resources.`, generator: { name: 'skill-library-creator', version: VERSION, date: generatedDate }, retired: [], managed: {} };
  if (activeMutation) activeMutation.recovery = `Inspect partially created library: ${root}`;
  makeDirectory(root, cloud);
  for (const [rel, bytes] of files) {
    writeNew(path.join(manager, rel), bytes, cloud);
    writeNew(path.join(root, '.library/generator-base', rel), bytes, cloud);
    config.managed[rel] = hash(bytes);
  }
  const readme = render(fs.readFileSync(guard(path.join(SKILL_ROOT, 'templates/library-README.md'), policy(options, SKILL_ROOT, true)), 'utf8'), { FAMILY: family, MANAGER: plan.manager, VERSION, PURPOSE: config.purpose });
  writeNew(path.join(root, 'README.md'), readme, cloud);
  writeNew(path.join(root, 'library.json'), json(config), cloud);
  return { ...plan, applied: true, id: config.id };
}
function configureImpl(options) {
  const ctx = context(options);
  let targets;
  if (options.targets) {
    targets = JSON.parse(options.targets);
    if (!Array.isArray(targets) || targets.length === 0 || targets.some(p => typeof p !== 'string' || !path.isAbsolute(p))) throw new Error('--targets requires a JSON array of absolute skills directories.');
  } else if (options.scope === 'global') {
    targets = [path.join(os.homedir(), '.claude/skills'), path.join(os.homedir(), '.agents/skills'), path.join(process.env.CODEX_HOME || path.join(os.homedir(), '.codex'), 'skills')];
  } else if (options.scope === 'project' && options.project) {
    const project = path.resolve(options.project);
    if (!leaf(guard(project, policy(options, project)))?.isDirectory()) throw new Error('Project must exist and have a physical path.');
    targets = [path.join(project, '.claude/skills'), path.join(project, '.agents/skills')];
  } else throw new Error('Choose --scope global, --scope project --project PATH, or explicit --targets JSON.');
  targets = uniquePaths(targets.map(p => path.resolve(p)));
  for (const target of targets) {
    guard(target, policy(options, target));
    if (inside(ctx.root, target) || inside(target, ctx.root)) throw new Error('Harness targets cannot overlap shared sources.');
    if (inside(ctx.state, target) || inside(target, ctx.state)) throw new Error('Harness targets cannot overlap private state.');
  }
  const combined = uniquePaths([...ctx.local.targets, ...targets]);
  if (!options.unregister && combined.some((p, i) => combined.some((other, j) => i !== j && inside(p, other)))) throw new Error('Harness target roots cannot overlap each other.');
  const plan = { operation: options.unregister ? 'unregister' : 'configure', library: ctx.root, targets, targetDetails: targets.map(p => ({ path: p, exists: !!leaf(p), newlyCreatedByReconcile: !leaf(p) })), previous: ctx.local.targets, state: ctx.stateFile, preservesExistingLinks: true };
  if (options.apply) {
    if (options.unregister && (targets.length !== 1 || options.confirm !== targets[0])) throw new Error('Unregister requires one exact --confirm TARGET; existing links are preserved.');
    if (options.unregister) plan.recoveryReceipt = saveRecovery(ctx, { ...plan, installation: ctx.local });
    // Additive: a second authorized project does not silently uninstall the first.
    ctx.local.targets = options.unregister ? ctx.local.targets.filter(p => !targets.some(t => equalPath(t, p))) : combined;
    if (options.unregister) for (const dest of Object.keys(ctx.local.links)) if (targets.some(t => equalPath(t, path.dirname(dest)))) delete ctx.local.links[dest];
    saveLocal(ctx);
  }
  return { ...plan, applied: !!options.apply };
}
function planLinks(ctx, entries, targets = ctx.local.targets) {
  const plan = [];
  const active = new Set(entries.map(e => e.name));
  for (const target of targets) {
    guard(target, ctx.cloud);
    for (const entry of entries) {
      const aliases = Object.entries(ctx.local.adoptions || {}).filter(([caller, row]) => equalPath(path.dirname(caller), target) && row.name === entry.name && equalPath(linkTarget(caller) || '', entry.source));
      if (aliases.length && !aliases.some(([caller]) => equalPath(caller, path.join(target, entry.name)))) {
        const canonicalDestination = path.join(target, entry.name);
        const collision = !!leaf(canonicalDestination) || aliases.length > 1;
        plan.push({ state: collision ? 'adopted-alias-collision' : 'adopted-alias', source: entry.source, destination: aliases[0][0], canonicalDestination, aliases: aliases.map(([caller]) => caller), warning: collision ? 'Multiple discovery entries may load this skill; inspect exact aliases and canonical entry before a separately reviewed repair.' : 'Compatibility alias retained; canonical duplicate suppressed. Runtime name/path compatibility requires caller review.', digest: entry.digest, files: entry.files }); continue;
      }
      const dest = path.join(target, entry.name);
      const stat = leaf(dest);
      const old = linkTarget(dest);
      const owned = ctx.local.links[dest];
      let state = !stat ? 'missing' : old && equalPath(old, entry.source) ? 'correct' : 'collision';
      if (old && owned && equalPath(old, owned.target) && state === 'collision') state = 'repair-owned';
      plan.push({ state, source: entry.source, destination: dest, oldTarget: old, ownership: owned ? 'recorded' : state === 'correct' ? 'will-record-on-apply' : 'unrecorded', digest: entry.digest, files: entry.files });
    }
    // Unknown entries, similarly prefixed links, and merely absent sources are never pruned.
    for (const [dest, owned] of Object.entries(ctx.local.links)) {
      if (!equalPath(path.dirname(dest), target) || active.has(path.basename(dest))) continue;
      const retired = ctx.config.retired.includes(path.basename(dest));
      const current = linkTarget(dest);
      plan.push({ state: retired && current && equalPath(current, owned.target) ? 'retire-owned' : !leaf(dest) && retired ? 'already-retired' : 'source-unavailable-or-collision', destination: dest, oldTarget: current, source: owned.target });
    }
    if (leaf(target)) for (const name of fs.readdirSync(target).sort()) {
      const dest = path.join(target, name);
      if (!name.startsWith(`${ctx.config.family}-`) || active.has(name) || Object.hasOwn(ctx.local.links, dest) || Object.hasOwn(ctx.local.adoptions || {}, dest)) continue;
      plan.push({ state: 'untracked-family-entry', destination: dest, ownership: 'unrecorded', warning: 'Family entry has no active source or ownership receipt; inspect and preserve it.' });
    }
  }
  return plan;
}
function verifyLink(row, cloud) {
  if (!equalPath(linkTarget(row.destination) || '', row.source)) throw new Error(`Wrong target: ${row.destination}`);
  if (hash(json(tree(row.source, cloud))) !== row.digest) throw new Error(`Source changed: ${row.source}`);
  for (const file of row.files) if (file.type !== 'directory' && hash(bytesAt(path.join(row.destination, file.path))) !== file.sha256) throw new Error(`Linked bytes differ: ${row.destination}`);
  if (!equalPath(linkTarget(row.destination) || '', row.source)) throw new Error(`Target changed during readback: ${row.destination}`);
}
export function summarizeInstallation(plan, adoptions, configured) {
  const counts = {};
  for (const row of plan) counts[row.state] = (counts[row.state] || 0) + 1;
  const recognized = new Set(['correct', 'adopted-alias', 'missing', 'repair-owned', 'retire-owned', 'already-retired']);
  const blockers = plan.filter(row => !recognized.has(row.state)).length;
  const callerIssues = adoptions.filter(row => row.state !== 'correct').length;
  const changes = ['missing', 'repair-owned', 'retire-owned', 'already-retired'].reduce((n, state) => n + (counts[state] || 0), 0);
  return { state: !configured ? 'unconfigured' : blockers || callerIssues ? 'attention-required' : changes ? 'changes-planned' : 'targets-match', countsBasis: 'reviewed-plan', counts, blockers, callerIssues, changes, next: !configured ? 'Choose and configure this machine\'s targets.' : blockers ? 'Inspect collisions, unavailable sources or unknown states; preserve existing entries.' : callerIssues ? 'Inspect adopted callers and their recovery receipts.' : changes ? 'Review the selected plan before reconciliation.' : 'Targets match; runtime pickup still requires observation.', linkedBytes: 'not-checked', runtimePickup: 'unverified' };
}
function reconcileImpl(options) {
  const ctx = context(options);
  const pending = pendingLocks(ctx);
  const entries = discover(ctx);
  const targets = options.targets ? JSON.parse(options.targets) : ctx.local.targets;
  if (!Array.isArray(targets) || (options.targets && !targets.length) || targets.some(t => typeof t !== 'string' || !path.isAbsolute(t) || !ctx.local.targets.some(p => equalPath(p, t)))) throw new Error('Selected targets must be a nonempty set of registered absolute paths; configure them first.');
  const plan = planLinks(ctx, entries, uniquePaths(targets));
  const adoptions = Object.entries(ctx.local.adoptions || {}).map(([caller, row]) => ({ caller, ...row, expectedTarget: path.join(ctx.root, row.name), state: equalPath(linkTarget(caller) || '', path.join(ctx.root, row.name)) && leaf(path.join(ctx.root, row.name)) ? 'correct' : 'adoption-unavailable-or-changed' }));
  const summary = summarizeInstallation(plan, adoptions, !!targets.length);
  if (pending.length) Object.assign(summary, { state: 'mutation-pending', blockers: summary.blockers + pending.length, pendingMutations: pending.length, next: 'Inspect active work or operation-specific recovery; a lock alone does not establish whether work has stopped.' });
  const result = { operation: 'reconcile', family: ctx.config.family, storage: storage(ctx.root, ctx.cloud), configured: !!targets.length, selectedTargets: targets, sources: entries.map(({ files, ...row }) => row), pendingMutations: pending, adoptions, summary, plan: plan.map(({ files, ...row }) => row), applied: false, runtimePickup: 'unverified' };
  if (!options.apply) return result;
  if (result.summary.blockers) throw new Error(`Reconciliation blocked; no links changed. ${json(result)}`);
  // Preflight the entire batch before creating a target directory or changing a link.
  for (const row of plan) if (row.files) {
    if (['missing', 'repair-owned'].includes(row.state)) preflightLink(row.source, row.destination, ctx.cloud, options['link-type']);
    if (hash(json(tree(row.source, ctx.cloud))) !== row.digest) throw new Error(`Source changed before apply: ${row.source}`);
    if (row.state === 'correct') verifyLink(row, ctx.cloud);
  }
  for (const row of plan) {
    if (row.state === 'adopted-alias') { verifyLink(row, ctx.cloud); continue; }
    if (row.state === 'correct') {
      // Explicit apply can record an already verified direct link in this selected scope.
      ctx.local.links[row.destination] = { target: row.source, digest: row.digest };
      saveLocal(ctx);
      continue;
    }
    makeDirectory(path.dirname(row.destination), ctx.cloud);
    const current = linkTarget(row.destination);
    if (row.state === 'missing' && leaf(row.destination)) throw new Error(`Destination appeared: ${row.destination}`);
    if (['repair-owned', 'retire-owned'].includes(row.state)) {
      if (!current || !equalPath(current, row.oldTarget)) throw new Error(`Destination changed: ${row.destination}`);
      saveRecovery(ctx, row);
      removeLink(row.destination, row.oldTarget, ctx.cloud);
    }
    if (['missing', 'repair-owned'].includes(row.state)) {
      if (row.state === 'missing') saveRecovery(ctx, row);
      createLink(row.source, row.destination, ctx.cloud, options['link-type']);
      verifyLink(row, ctx.cloud);
      ctx.local.links[row.destination] = { target: row.source, digest: row.digest };
    } else delete ctx.local.links[row.destination];
    saveLocal(ctx); // Persist each completed link, including partial batches.
  }
  return { ...result, applied: true, summary: { ...result.summary, state: result.summary.callerIssues ? 'attention-required' : targets.length ? 'reconciled' : 'unconfigured', changes: 0, linkedBytes: targets.length ? 'readback-performed' : 'not-checked', next: 'Inspect post-apply status; observe runtime pickup separately.' } };
}
export function inventory(options) {
  const ctx = context(options, true);
  const entries = discover(ctx, { metadataOnly: true, tolerant: true });
  return { family: ctx.config.family, purpose: ctx.config.purpose || null, source: ctx.root, storage: storage(ctx.root, ctx.cloud), skills: entries, invalid: entries.invalid, retired: ctx.config.retired, pendingMutations: pendingLocks(ctx, true), installation: 'Run status explicitly for machine-local state.', runtimePickup: 'unverified' };
}
export function compareUpstream(options) {
  if (options.apply) throw new Error('compare-upstream is read-only; prepare a reviewed draft to publish.');
  const ctx = context(options, true);
  const name = validName(options.name);
  if (!name.startsWith(`${ctx.config.family}-`) || name === `${ctx.config.family}-skills-manager` || !options.from) throw new Error('Choose an imported family skill and --from an acquired incoming directory.');
  const current = path.join(ctx.root, name);
  const incoming = path.resolve(options.from);
  if (inside(ctx.root, incoming) || inside(incoming, ctx.root)) throw new Error('Incoming source must be separate from the library.');
  const provenanceBytes = bytesAt(guard(path.join(current, 'provenance.json'), ctx.cloud));
  const provenance = JSON.parse(provenanceBytes);
  const rel = provenance.baseline;
  if (typeof rel !== 'string' || path.isAbsolute(rel) || rel.split(/[\\/]/).some(p => !p || p === '.' || p === '..')) throw new Error('Invalid upstream baseline coordinate.');
  const baseline = path.resolve(ctx.root, rel);
  if (!inside(path.join(ctx.root, '.library/upstream'), baseline) || equalPath(baseline, path.join(ctx.root, '.library/upstream'))) throw new Error('Baseline must be a retained upstream tree.');
  const roots = [baseline, current, incoming];
  const snapshots = roots.map(root => tree(root, ctx.cloud));
  if (snapshots[1].find(row => row.path === 'provenance.json')?.sha256 !== hash(provenanceBytes)) throw new Error('Provenance changed during comparison.');
  const ancestry = verifyOriginal(provenance, snapshots[0]);
  const texts = roots.map((root, i) => skillText(snapshotBytes(root, snapshots[i], 'SKILL.md', ctx.cloud)));
  const currentFields = metadata(texts[1]);
  if (currentFields.name !== name || currentFields.family !== ctx.config.family) throw new Error('Current skill name/family mismatch.');
  const incomingFields = metadata(texts[2]);
  if (!incomingFields.name || !incomingFields.description) throw new Error('Incoming source requires named skill frontmatter.');
  const loaderFields = ['name', 'family', 'skill-version', 'updated'];
  const normalized = texts.map(original => {
    let text = original;
    // Reapply only the documented pool loader adaptation. All other bytes remain significant.
    for (const key of loaderFields) text = setField(text, key, currentFields[key]);
    return hash(text);
  });
  const maps = snapshots.map(rows => new Map(rows.map(row => [row.path, row])));
  const coordinates = [...new Set(snapshots.flatMap(rows => rows.map(row => row.path)))].sort();
  const signature = (row, index, coordinate) => row ? json({ type: row.type, ...(row.type === 'file' ? { sha256: coordinate === 'SKILL.md' ? normalized[index] : row.sha256 } : {}) }) : null;
  const counts = {};
  const files = coordinates.map(coordinate => {
    const rows = maps.map(map => map.get(coordinate) || null);
    const [base, local, next] = rows.map((row, i) => signature(row, i, coordinate));
    const state = coordinate === 'provenance.json' ? 'provenance-review' : local === next ? local === base ? 'unchanged' : 'same-change' : local === base ? 'upstream-only' : next === base ? 'local-only' : 'conflict';
    counts[state] = (counts[state] || 0) + 1;
    return { path: coordinate, state, localChange: base === local ? 'none' : !base ? 'added' : !local ? 'removed' : 'modified', upstreamChange: base === next ? 'none' : !base ? 'added' : !next ? 'removed' : 'modified', permissionReview: new Set(rows.filter(Boolean).map(row => row.mode)).size > 1, baseline: rows[0], current: rows[1], incoming: rows[2] };
  });
  for (let i = 0; i < roots.length; i++) if (json(tree(roots[i], ctx.cloud)) !== json(snapshots[i])) throw new Error(`Comparison input changed: ${roots[i]}`);
  return { operation: 'compare-upstream', readOnly: true, name, baseline, current, incoming, origin: provenance.origin, baselineRevision: provenance.revision, incomingRevision: options.revision || 'unknown', ancestry, digests: snapshots.map(rows => hash(json(rows))), counts, files, loaderAdaptation: { fields: loaderFields, baseline: metadata(texts[0]), current: currentFields, incoming: incomingFields, note: 'Only these four loader fields are aligned for SKILL.md classification. Raw file hashes remain in every row; review metadata and provenance separately.' }, next: 'Inspect changed bytes, permissions, dependencies, notices and callers. File-level conflicts are conservative; no merge or update is applied.' };
}
function importSkillImpl(options) {
  const ctx = context(options);
  const name = validName(options.name);
  if (!name.startsWith(`${ctx.config.family}-`) || name === `${ctx.config.family}-skills-manager`) throw new Error('Choose an available family-prefixed skill name.');
  if (!['upstream', 'variant'].includes(options.mode)) throw new Error('Choose --mode upstream or --mode variant.');
  if (!options.from || !options.origin || !options.revision) throw new Error('Import requires --from, --origin and --revision (use an explicit unknown value when evidence is unavailable).');
  const source = path.resolve(options.from);
  const dest = path.join(ctx.root, name);
  if (inside(ctx.root, source) || inside(source, ctx.root)) throw new Error('Import source must be outside the library.');
  if (leaf(dest) || ctx.config.retired.includes(name)) throw new Error('Skill name already occupied or retired.');
  const before = tree(source, ctx.cloud);
  const originalBytes = snapshotBytes(source, before, 'SKILL.md', ctx.cloud);
  const original = skillText(originalBytes);
  const fields = metadata(original);
  if (!fields.name || !fields.description) throw new Error('Import requires a named skill with a description.');
  const plan = { operation: 'import', source, destination: dest, activation: 'staged only; publish after content/dependency review', originalName: fields.name, name, mode: options.mode, files: before, sourceDigest: hash(json(before)), origin: options.origin, revision: options.revision, adaptation: 'loader name, family, version and date only; behavior and callers require separate reviewed edits' };
  if (!options.apply) return plan;
  const candidate = path.join(ctx.root, '.library/candidates', `${name}-${token()}`);
  copyTree(source, candidate, ctx.cloud, before);
  const baseline = path.join(ctx.root, '.library/upstream', name, token());
  copyTree(source, baseline, ctx.cloud, before);
  let text = setField(original, 'name', name);
  text = setField(text, 'family', ctx.config.family);
  text = setField(text, 'skill-version', '1.0.0');
  text = setField(text, 'updated', date());
  const candidateMode = fs.lstatSync(guard(candidate, ctx.cloud)).mode & 0o777;
  const writableCandidate = process.platform !== 'win32' && !(candidateMode & 0o200);
  if (writableCandidate) fs.chmodSync(guard(candidate, ctx.cloud), candidateMode | 0o200);
  try {
    replace(path.join(candidate, 'SKILL.md'), text, hash(originalBytes), ctx.cloud);
    const origin = { schema: 1, originalName: fields.name, originalVersion: fields['skill-version'] || null, mode: options.mode, origin: options.origin, revision: options.revision, imported: new Date().toISOString(), originalDigest: plan.sourceDigest, originalContentDigest: contentDigest(before), digestBasis: 'path-type-sha256-v1', originalPlatform: process.platform, originalFiles: before, baseline: path.relative(ctx.root, baseline).split(path.sep).join('/'), namingAdaptation: { from: fields.name, to: name } };
    const provenancePath = path.join(candidate, 'provenance.json');
    if (leaf(provenancePath)) {
      const previousBytes = bytesAt(provenancePath);
      origin.upstreamProvenance = JSON.parse(previousBytes);
      replace(provenancePath, json(origin), hash(previousBytes), ctx.cloud);
    } else writeNew(provenancePath, json(origin), ctx.cloud);
  } finally {
    if (writableCandidate) fs.chmodSync(guard(candidate, ctx.cloud), candidateMode);
  }
  if (hash(json(tree(source, ctx.cloud))) !== plan.sourceDigest) throw new Error(`Source changed; candidate retained: ${candidate}`);
  return { ...plan, applied: true, candidate, adopted: false, next: 'Review candidate content, dependencies and callers; publish the reviewed draft, then finalize adoption or reconciliation.' };
}
function publishSkillImpl(options) {
  const ctx = context(options);
  const name = validName(options.name);
  if (!name.startsWith(`${ctx.config.family}-`) || name === `${ctx.config.family}-skills-manager` || ctx.config.retired.includes(name)) throw new Error('Publish requires an available non-manager family name.');
  if (!options.from) throw new Error('Publish requires --from DRAFT.');
  const source = path.resolve(options.from);
  const dest = path.join(ctx.root, name);
  if (equalPath(source, dest) || inside(dest, source) || inside(source, dest)) throw new Error('Draft must be separate from active destination.');
  const draft = tree(source, ctx.cloud);
  const markdown = skillText(snapshotBytes(source, draft, 'SKILL.md', ctx.cloud));
  const fields = metadata(markdown);
  if (fields.name !== name || fields.family !== ctx.config.family || !validPoolMetadata(fields)) throw new Error('Reviewed draft needs matching name/family, description, version and date.');
  const optedIn = fields['self-improvable'] === 'true';
  const loopReference = draft.some(row => row.path === 'references/self-improvement.md' && row.type === 'file');
  const loopRoute = markdown.includes('self-improvement.md');
  const loopComplete = loopReference && loopRoute;
  const currentFiles = leaf(dest) ? tree(dest, ctx.cloud) : null;
  const current = currentFiles ? hash(json(currentFiles)) : null;
  let oldFields, currentMetadataError = null;
  if (currentFiles) {
    try { oldFields = metadata(skillText(snapshotBytes(dest, currentFiles, 'SKILL.md', ctx.cloud))); }
    catch (error) { currentMetadataError = error.message; }
    if (oldFields && (!validPoolMetadata(oldFields) || oldFields.name !== name || oldFields.family !== ctx.config.family)) currentMetadataError = 'Current metadata is invalid.';
  }
  const recovery = current ? path.join(ctx.root, '.library/publication-recovery', `${name}-${current.slice(0, 12)}`) : null;
  const result = { operation: 'publish', source, destination: dest, name, draftDigest: hash(json(draft)), currentDigest: current, currentMetadataError, recovery, selfImprovement: { declared: optedIn, resourceAndRoutePresent: loopComplete, warnings: optedIn && !loopComplete ? ['Default loop wiring is not complete; inspect any equivalent self-contained loop before declaring content reviewed.'] : !optedIn && loopRoute ? ['A loop route is present without declared opt-in; inspect consent and remove unintended wiring before declaring content reviewed.'] : [], behavior: 'unverified' } };
  if (!options.apply) return result;
  if (!options['content-reviewed']) throw new Error('Publish requires --content-reviewed after behavior, dependency and caller review.');
  if (options['draft-expected'] !== result.draftDigest) throw new Error('Publish requires --draft-expected DRAFT_DIGEST from the reviewed preview; draft bytes changed or were not bound to review.');
  if (current && options.expected !== current) throw new Error('Existing publication requires --expected CURRENT_TREE_DIGEST from the reviewed publish preview or status.');
  if (optedIn && loopRoute && !loopReference) throw new Error('Self-improvement opt-in references a missing bundled self-improvement.md; inspect the selected route before publication.');
  if (current) {
    const oldProvenance = path.join(dest, 'provenance.json');
    if (leaf(oldProvenance) && !draft.some(row => row.path === 'provenance.json')) throw new Error('Updated publication must retain existing provenance.json; adapt it deliberately in the reviewed draft.');
    if (currentMetadataError && !options['repair-metadata']) throw new Error('Malformed current metadata requires an explicitly reviewed --repair-metadata publication; preserve the complete preimage and recover the intended version from evidence.');
    if (parseVersion(oldFields?.['skill-version']) && compareVersions(fields['skill-version'], oldFields['skill-version']) <= 0) throw new Error('Updated publication must increase the pool version.');
  }
  const candidate = path.join(ctx.root, '.library/publication-candidates', `${name}-${token()}`);
  result.candidate = candidate;
  copyTree(source, candidate, ctx.cloud, draft);
  if (hash(json(tree(candidate, ctx.cloud))) !== result.draftDigest) throw new Error(`Publication candidate differs from reviewed snapshot; retained: ${candidate}`);
  if (hash(json(tree(source, ctx.cloud))) !== result.draftDigest || (leaf(dest) ? hash(json(tree(dest, ctx.cloud))) : null) !== current) throw new Error(`Publication changed; candidate retained: ${candidate}`);
  if (recovery) { guard(recovery, ctx.cloud); makeDirectory(path.dirname(recovery), ctx.cloud); if (leaf(recovery)) throw new Error('Publication recovery occupied.'); }
  saveRecovery(ctx, result);
  if (recovery) fs.renameSync(dest, recovery);
  try { fs.renameSync(candidate, dest); } catch (error) { if (recovery && !leaf(dest)) fs.renameSync(recovery, dest); throw error; }
  const activatedDigest = hash(json(tree(dest, ctx.cloud)));
  if (activatedDigest !== result.draftDigest) throw new Error(`Activated publication differs from reviewed snapshot at ${dest}; expected ${result.draftDigest}, observed ${activatedDigest}. Preserve active bytes and recovery for inspection; no automatic rollback.`);
  return { ...result, activatedDigest, applied: true };
}
function sharedAdoptions(ctx, name) {
  const root = path.join(ctx.root, '.library/adoptions', name);
  guard(root, ctx.cloud);
  if (!leaf(root)) return [];
  return fs.readdirSync(root).map(file => {
    if (!/^[a-f0-9]{24}\.json$/.test(file)) throw new Error(`Unknown adoption dependency: ${root}`);
    const row = readJson(path.join(root, file), ctx.cloud);
    if (row.schema !== 1 || row.id !== file.slice(0, -5) || row.name !== name || !['pending', 'active'].includes(row.state)) throw new Error(`Invalid adoption dependency: ${file}`);
    return row;
  });
}
function adoptFinishImpl(options) {
  const ctx = context(options);
  const name = validName(options.name);
  const source = path.resolve(options.from || '');
  const dest = path.join(ctx.root, name);
  if (!name.startsWith(`${ctx.config.family}-`) || !options.from || inside(ctx.root, source) || inside(source, ctx.root)) throw new Error('Invalid adoption scope.');
  if (ctx.local.adoptions?.[source]) throw new Error('Recorded adoption already exists for this caller; inspect recovery and adopt-release before another attempt.');
  if (sharedAdoptions(ctx, name).some(row => row.state === 'pending')) throw new Error('Pending shared adoption must be resolved and released before another attempt.');
  const provenance = readJson(path.join(dest, 'provenance.json'), ctx.cloud);
  const before = tree(source, ctx.cloud);
  const ancestry = verifyOriginal(provenance, before);
  const originalDigest = hash(json(before));
  discover(ctx);
  const archive = options.recovery ? path.resolve(options.recovery) : path.join(ctx.state, 'adoption-recovery', `${name}-${provenance.originalDigest.slice(0, 12)}`);
  const archivePolicy = policy(options, archive);
  guard(archive, archivePolicy);
  if (inside(ctx.root, archive) || inside(path.dirname(source), archive) || inside(archive, source) || ctx.local.targets.some(t => inside(t, archive))) throw new Error('Adoption recovery must be outside active library, caller parent and harness discovery.');
  preflightLink(dest, source, ctx.cloud, options['link-type']);
  let archiveAncestor = path.dirname(archive);
  while (!leaf(archiveAncestor)) archiveAncestor = path.dirname(archiveAncestor);
  guard(archiveAncestor, archivePolicy);
  const sameDevice = fs.lstatSync(source).dev === fs.lstatSync(archiveAncestor).dev;
  const callerBasename = path.basename(source);
  const canonicalCaller = path.join(path.dirname(source), name);
  const duplicateCanonical = callerBasename !== name && ctx.local.targets.some(t => equalPath(t, path.dirname(source))) && !!leaf(canonicalCaller);
  const plan = { operation: 'finish-adoption', original: source, replacementTarget: dest, recovery: archive, originalDigest, ancestry, sameDevice, naming: { callerBasename, loaderName: name, mismatch: callerBasename !== name }, duplicateCanonical: duplicateCanonical ? canonicalCaller : null, blockedReason: duplicateCanonical ? 'Canonical discovery entry already exists; inspect a separately reviewed alias repair before adoption.' : sameDevice ? null : 'Choose a reviewed same-volume --recovery path outside discovery.', impact: 'Original directory moves to recovery; its path becomes a link to the pool. Existing callers require a reviewed compatibility check.' };
  if (!options.apply) return plan;
  if (!sameDevice) throw new Error('Adoption needs a same-volume --recovery path; no dependency or caller state changed.');
  if (duplicateCanonical) throw new Error(`Adoption would duplicate a canonical discovery entry: ${canonicalCaller}; no dependency or caller state changed.`);
  if (options.confirm !== source || !options['callers-reviewed']) throw new Error('Read back exact paths; supply --confirm ORIGINAL_ABSOLUTE_PATH --callers-reviewed only after compatibility review.');
  if (leaf(archive)) throw new Error('Recovery destination occupied.');
  guard(source, ctx.cloud);
  if (hash(json(tree(source, ctx.cloud))) !== originalDigest) throw new Error('Original changed before migration.');
  makeDirectory(path.dirname(archive), archivePolicy);
  const id = token();
  const dependency = path.join(ctx.root, '.library/adoptions', name, `${id}.json`);
  saveRecovery(ctx, plan);
  writeNew(dependency, json({ schema: 1, id, name, state: 'pending', created: new Date().toISOString() }), ctx.cloud);
  ctx.local.adoptions ||= {};
  ctx.local.adoptions[source] = { id, target: dest, recovery: archive, name };
  saveLocal(ctx);
  fs.renameSync(source, archive); // EXDEV fails before movement; choose a same-volume --recovery.
  try { createLink(dest, source, ctx.cloud, options['link-type']); }
  catch (error) {
    if (!leaf(source)) fs.renameSync(archive, source);
    throw new Error(`Adoption link failed; inspect original ${source}, recovery ${archive}, dependency ${id}: ${error.message}`);
  }
  const entry = discover(ctx).find(e => e.name === name);
  verifyLink({ ...entry, destination: source }, ctx.cloud);
  // Original caller path can have an unprefixed basename; track independently from harness roots.
  replace(dependency, json({ schema: 1, id, name, state: 'active', created: new Date().toISOString() }), hash(bytesAt(dependency)), ctx.cloud);
  saveLocal(ctx);
  return { ...plan, applied: true };
}
function adoptReleaseImpl(options) {
  const ctx = context(options);
  const source = path.resolve(options.from || '');
  const row = ctx.local.adoptions?.[source];
  if (!options.from || !row || row.name !== options.name) throw new Error('Recorded adoption not found in this private state.');
  guard(path.dirname(source), ctx.cloud);
  const target = linkTarget(source);
  if (leaf(source) && !target) guard(source, ctx.cloud);
  if (target && (equalPath(target, row.target) || equalPath(target, path.join(ctx.root, row.name)))) throw new Error('Caller still depends on this skill; review and migrate it before release.');
  const dependency = path.join(ctx.root, '.library/adoptions', row.name, `${row.id}.json`);
  const history = path.join(ctx.root, '.library/adoption-history', `${row.id}.json`);
  const result = { operation: 'adopt-release', caller: source, name: row.name, dependency: row.id, recovery: row.recovery, currentTarget: target, sharedHistory: history };
  if (!options.apply) return result;
  if (options.confirm !== source || !options['callers-reviewed']) throw new Error('Exact --confirm ORIGINAL and --callers-reviewed required after caller migration.');
  guard(dependency, ctx.cloud); guard(history, ctx.cloud);
  makeDirectory(path.dirname(history), ctx.cloud);
  if (leaf(history)) throw new Error('Dependency history occupied.');
  saveRecovery(ctx, result);
  fs.renameSync(dependency, history);
  delete ctx.local.adoptions[source];
  saveLocal(ctx);
  return { ...result, applied: true };
}
function retireImpl(options) {
  const ctx = context(options);
  const name = validName(options.name);
  if (name === `${ctx.config.family}-skills-manager`) throw new Error('Retiring the manager needs a separate library-lifecycle plan.');
  const entry = discover(ctx).find(e => e.name === name);
  if (!entry) throw new Error('Active skill not found.');
  const dest = path.join(ctx.root, '.library/retired', `${name}-${entry.digest.slice(0, 12)}`);
  const adoptionDependencies = sharedAdoptions(ctx, name).map(row => row.id);
  const adoptionCallers = Object.entries(ctx.local.adoptions || {}).filter(([, row]) => row.name === name).map(([caller]) => caller);
  const plan = { operation: 'retire', source: entry.source, recovery: dest, name, digest: entry.digest, adoptionDependencies, adoptionCallers, impact: 'Source leaves active discovery; this machine can unlink its recorded harness entries. Other machines reconcile on demand.' };
  if (!options.apply) return plan;
  if (options.confirm !== name || adoptionDependencies.length || adoptionCallers.length) throw new Error('Exact --confirm NAME required; adopted caller dependencies must be resolved before retirement.');
  if (hash(json(tree(entry.source, ctx.cloud))) !== entry.digest) throw new Error('Skill changed before retirement.');
  makeDirectory(path.dirname(dest), ctx.cloud);
  guard(dest, ctx.cloud);
  if (leaf(dest)) throw new Error('Retirement recovery destination occupied; inspect existing history.');
  saveRecovery(ctx, plan);
  fs.renameSync(entry.source, dest);
  ctx.config.retired.push(name);
  saveConfig(ctx);
  return { ...plan, applied: true };
}
function renameSkillImpl(options) {
  const ctx = context(options);
  const name = validName(options.name);
  const next = validName(options.to);
  if (!next.startsWith(`${ctx.config.family}-`) || name === `${ctx.config.family}-skills-manager` || next === `${ctx.config.family}-skills-manager`) throw new Error('Rename must stay in the family and cannot rename the manager.');
  const entry = discover(ctx).find(e => e.name === name);
  const dest = path.join(ctx.root, next);
  if (!entry || leaf(dest) || ctx.config.retired.includes(next)) throw new Error('Rename source unavailable or destination occupied/retired.');
  if (sharedAdoptions(ctx, name).length || Object.values(ctx.local.adoptions || {}).some(row => row.name === name)) throw new Error('Resolve adopted caller dependencies before renaming.');
  const recovery = path.join(ctx.root, '.library/rename-recovery', `${name}-${entry.digest.slice(0, 12)}`);
  const plan = { operation: 'rename', source: entry.source, destination: dest, recovery, name, next, digest: entry.digest, impact: 'Loader name changes; original name is retired. Caller and protocol adaptations require review.' };
  if (!options.apply) return plan;
  if (options.confirm !== name || !options['callers-reviewed']) throw new Error('Exact --confirm OLD_NAME and --callers-reviewed required after caller review.');
  try { copyTree(entry.source, recovery, ctx.cloud, entry.files); }
  catch (error) { throw new Error(`Rename preimage may be incomplete at ${recovery}; original was not moved. Inspect before retrying. ${error.message}`); }
  if (hash(json(tree(entry.source, ctx.cloud))) !== entry.digest) throw new Error('Rename source changed.');
  guard(dest, ctx.cloud);
  if (leaf(dest)) throw new Error('Rename destination appeared.');
  saveRecovery(ctx, plan);
  fs.renameSync(entry.source, dest);
  const md = path.join(dest, 'SKILL.md');
  const original = fs.readFileSync(md, 'utf8');
  let text = setField(original, 'name', next);
  text = setField(text, 'updated', date());
  const version = metadata(text)['skill-version'].match(/^(\d+)\./)?.[1];
  if (!version) throw new Error('Invalid version during rename.');
  text = setField(text, 'skill-version', `${BigInt(version) + 1n}.0.0`);
  replace(md, text, hash(Buffer.from(original)), ctx.cloud);
  const provenancePath = path.join(dest, 'provenance.json');
  if (leaf(provenancePath)) {
    const provenanceBytes = bytesAt(guard(provenancePath, ctx.cloud));
    const provenance = JSON.parse(provenanceBytes);
    provenance.namingHistory = [...(provenance.namingHistory || []), { from: name, to: next, date: date() }];
    if (provenance.namingAdaptation) provenance.namingAdaptation.to = next;
    replace(provenancePath, json(provenance), hash(provenanceBytes), ctx.cloud);
  }
  ctx.config.retired.push(name);
  saveConfig(ctx);
  return { ...plan, applied: true };
}
function upgradeImpl(options) {
  const ctx = context(options);
  if (compareVersions(VERSION, ctx.config.generator?.version) < 0) throw new Error('Generator downgrade refused; use a separate reviewed rollback plan.');
  const incomingDate = ctx.config.generator.version === VERSION ? ctx.config.generator.date || date() : date();
  const incoming = managerFiles(ctx.config.family, incomingDate, options);
  const manager = path.join(ctx.root, `${ctx.config.family}-skills-manager`);
  const baseRoot = path.join(ctx.root, '.library/generator-base');
  const plan = [];
  for (const [rel, bytes] of incoming) {
    const dest = path.join(manager, rel);
    guard(dest, ctx.cloud);
    const current = leaf(dest) ? hash(bytesAt(dest)) : null;
    const base = ctx.config.managed[rel] || null;
    const baselinePath = path.join(baseRoot, rel);
    const baselineBytes = leaf(baselinePath) ? bytesAt(guard(baselinePath, ctx.cloud)) : null;
    const observedBaseline = baselineBytes ? hash(baselineBytes) : null;
    const next = hash(bytes);
    const state = observedBaseline !== base ? 'baseline-drift-conflict' : current === null && base !== null ? 'missing-managed-conflict' : current === next ? 'unchanged' : current === base ? 'update' : next === base ? 'preserve-custom' : 'conflict';
    plan.push({ path: rel, current, baseline: base, observedBaseline, incoming: next, state });
  }
  for (const rel of Object.keys(ctx.config.managed)) if (!incoming.has(rel)) plan.push({ path: rel, state: 'removed-template-conflict' });
  const result = { operation: 'upgrade', from: ctx.config.generator.version, to: VERSION, incomingDate, plan, applied: false };
  result.planDigest = hash(json({ library: ctx.root, id: ctx.config.id, from: result.from, to: result.to, incomingDate, plan }));
  if (!options.apply) return result;
  if (plan.some(row => row.state.includes('conflict'))) throw new Error(`Upgrade needs a reviewed merge; no files changed. ${json(result)}`);
  if (options.expected !== result.planDigest) throw new Error('Upgrade requires --expected PLAN_DIGEST from the current reviewed preview; incoming or current bytes may have changed.');
  if (hash(bytesAt(guard(ctx.configPath, ctx.cloud))) !== ctx.configHash) throw new Error('Library configuration changed before upgrade.');
  for (const row of plan) if (row.current !== (leaf(path.join(manager, row.path)) ? hash(bytesAt(guard(path.join(manager, row.path), ctx.cloud))) : null)) throw new Error('Manager changed after preview.');
  const recovery = path.join(ctx.root, '.library/upgrade-recovery', token());
  saveRecovery(ctx, { ...result, recovery });
  writeNew(path.join(recovery, 'library.json'), bytesAt(ctx.configPath), ctx.cloud);
  for (const row of plan) {
    const dest = path.join(manager, row.path);
    const bytes = incoming.get(row.path);
    if (row.state === 'update') {
      if (row.current) writeNew(path.join(recovery, row.path), bytesAt(dest), ctx.cloud);
      if (row.current) replace(dest, bytes, row.current, ctx.cloud); else writeNew(dest, bytes, ctx.cloud);
    }
    const base = path.join(baseRoot, row.path);
    if (leaf(base)) {
      const oldBase = bytesAt(guard(base, ctx.cloud));
      if (hash(oldBase) !== row.observedBaseline) throw new Error(`Generator baseline changed: ${base}`);
      writeNew(path.join(recovery, 'baselines', row.path), oldBase, ctx.cloud);
    }
    if (leaf(base)) replace(base, bytes, hash(bytesAt(guard(base, ctx.cloud))), ctx.cloud); else writeNew(base, bytes, ctx.cloud);
    ctx.config.managed[row.path] = row.incoming;
  }
  ctx.config.generator.version = VERSION;
  ctx.config.generator.date = incomingDate;
  saveConfig(ctx);
  return { ...result, applied: true, recovery };
}
export function guide(options) {
  const topics = {
    create: 'For a new library use the creator; for a skill read references/authoring.md and publish its reviewed draft.',
    list: 'Metadata-only family inventory; see references/guide.md.',
    author: 'Create, enrich or specialize; publish reviewed drafts using references/authoring.md.',
    assess: 'Assess useful detail, correctness and lazy loading before proposing edits; references/assessment.md.',
    evaluate: 'Check changed behavior against observable criteria; report weaknesses, and repair only when authorized; references/evaluation.md.',
    'self-improvement': 'Optional concrete lesson proposals requiring approval; references/self-improvement.md.',
    import: 'Stage complete sources with provenance, then review and publish; references/imports.md.',
    adopt: 'Preflight, preserve original, link back and record shared dependency; references/imports.md.',
    check: 'Check registered targets, optionally select --targets; references/installation.md.',
    retire: 'Release adoption dependencies before archival; references/lifecycle.md.',
    restore: 'Inspect the complete archive and collisions; prepare a reviewed guarded restore; references/lifecycle.md.',
    rename: 'Review callers and naming history; references/lifecycle.md.',
    publish: 'Activate a reviewed complete draft; updates require current --expected digest; references/authoring.md.',
    'compare-upstream': 'Offline read-only baseline/current/acquired-incoming comparison; references/updates.md. No merge or download.',
    upgrade: 'Use the inspected creator and current --expected PLAN_DIGEST; references/updates.md.',
    recovery: 'Inspect operation-specific state, locks and receipts; references/recovery.md. No automatic unlock, resume or rollback.',
  };
  const aliases = { install: 'check', configure: 'check', improve: 'author', boil: 'assess', audit: 'assess', evaluation: 'evaluate', 'adopt-release': 'adopt' };
  options = { ...options, topic: Object.hasOwn(aliases, options.topic) ? aliases[options.topic] : options.topic };
  if (options.topic && !Object.hasOwn(topics, options.topic)) throw new Error(`Unknown help topic: ${options.topic}`);
  return options.topic ? { topic: options.topic, summary: topics[options.topic] } : { summary: 'A portable skill library has one physical source and a family manager. Each machine links selected harness locations to that source.', capabilities: topics, next: 'Choose a capability for details. A separate domain primer is optional.' };
}
let activeMutation = null;
export function withMutation(options, operation, callback) {
  if (!options.apply) return callback();
  const sourceWrites = !['configure', 'reconcile'].includes(operation);
  const ctx = operation === 'init' ? null : context(options);
  const scopes = ctx ? [{ directory: ctx.state, policy: ctx.privatePolicy }] : [{ directory: path.resolve(options.folder || ''), policy: policy(options, path.resolve(options.folder || '')) }];
  if (ctx && sourceWrites) scopes.push({ directory: path.join(ctx.root, '.library'), policy: ctx.cloud });
  if (ctx && !sourceWrites && leaf(path.join(ctx.root, '.library/mutation.lock'))) throw new Error('Shared mutation pending; inspect recovery before changing installations.');
  const locks = [];
  const previous = activeMutation;
  const mutation = { operation, id: token(), libraryId: ctx?.config.id, recovery: null };
  activeMutation = mutation;
  try {
    for (const scope of scopes) {
      makeDirectory(scope.directory, scope.policy, ctx && equalPath(scope.directory, ctx.state) ? 0o700 : undefined);
      const p = path.join(scope.directory, operation === 'init' ? '.skill-library-create.lock' : 'mutation.lock');
      const payload = json({ schema: 1, id: mutation.id, operation, state: 'running', created: new Date().toISOString() });
      try { writeNew(p, payload, scope.policy, 0o600); } catch (error) { throw new Error(`Mutation lock unavailable: ${p}. Inspect active work/recovery; never steal a lock. ${error.message}`); }
      locks.push({ path: p, digest: hash(payload), policy: scope.policy });
    }
    const result = callback();
    mutation.completed = true;
    return result;
  } catch (error) {
    if (mutation.recovery) throw new Error(`Partial ${operation}; recovery receipt: ${mutation.recovery}; retained locks: ${locks.map(row => row.path).join(', ')}. ${error.message}`);
    throw error;
  } finally {
    try { if (mutation.completed || !mutation.recovery) for (const row of locks.reverse()) {
      guard(row.path, row.policy);
      if (hash(bytesAt(row.path)) !== row.digest) throw new Error(`Mutation lock changed; retained: ${row.path}`);
      fs.unlinkSync(row.path); // Only this operation's regular lock leaf, never recursive.
    } } finally { activeMutation = previous; }
  }
}
export const initialize = options => { if (options.apply) initializeImpl({ ...options, apply: false }); return withMutation(options, 'init', () => initializeImpl(options)); };
export const configure = options => withMutation(options, 'configure', () => configureImpl(options));
export const reconcile = options => withMutation(options, 'reconcile', () => reconcileImpl(options));
export const importSkill = options => withMutation(options, 'import', () => importSkillImpl(options));
export const publishSkill = options => withMutation(options, 'publish', () => publishSkillImpl(options));
export const adoptFinish = options => { if (options.apply) adoptFinishImpl({ ...options, apply: false }); return withMutation(options, 'adopt-finish', () => adoptFinishImpl(options)); };
export const adoptRelease = options => withMutation(options, 'adopt-release', () => adoptReleaseImpl(options));
export const retire = options => withMutation(options, 'retire', () => retireImpl(options));
export const renameSkill = options => withMutation(options, 'rename', () => renameSkillImpl(options));
export const upgrade = options => withMutation(options, 'upgrade', () => upgradeImpl(options));
export function cli(argv = process.argv.slice(2)) {
  if (argv[0] === '--help') argv.unshift('help');
  const command = argv.shift() || 'help';
  const flags = new Set(['apply', 'callers-reviewed', 'content-reviewed', 'repair-metadata', 'unregister']);
  const allowed = new Set(['folder', 'family', 'purpose', 'library', 'scope', 'project', 'targets', 'state', 'cloud-root', 'cloud-roots', 'mount-root', 'link-type', 'from', 'origin', 'revision', 'mode', 'name', 'to', 'confirm', 'topic', 'expected', 'draft-expected', 'recovery']);
  const options = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--help') return { commands: 'init --folder PATH --family PREFIX [--purpose TEXT] (creator only); configure --library SKILLS --scope global|project [--project PATH] or --targets JSON [--unregister --confirm TARGET]; list|status|reconcile --library SKILLS [--targets JSON]; compare-upstream --library SKILLS --name NAME --from INCOMING [--revision REV] (read-only); import --from PATH --name NAME --mode upstream|variant --origin SOURCE --revision REV (stages only); publish --from DRAFT --name NAME --content-reviewed --draft-expected DRAFT_DIGEST [--expected CURRENT_DIGEST] [--repair-metadata]; adopt-finish --from ORIGINAL --name NAME --confirm ORIGINAL --callers-reviewed [--recovery PATH]; adopt-release --from ORIGINAL --name NAME --confirm ORIGINAL --callers-reviewed; rename --name OLD --to NEW --confirm OLD --callers-reviewed; retire --name NAME --confirm NAME; upgrade --library SKILLS (creator only); help [--topic TOPIC]', mutations: 'Preview is default; --apply authorizes only this operation. All library operations accept --library SKILLS and private --state PATH. Storage: --cloud-root confirmed provider root; --mount-root confirmed volume boundary; --link-type junction|symlink (Windows symlink requires explicit host permission, no elevation).' };
    const key = argv[i].replace(/^--/, '');
    if (!argv[i].startsWith('--') || Object.hasOwn(options, key)) throw new Error(`Invalid or repeated argument: ${argv[i]}`);
    if (flags.has(key)) options[key] = true;
    else if (allowed.has(key) && argv[i + 1] && !argv[i + 1].startsWith('--')) options[key] = argv[++i];
    else throw new Error(`Unknown or incomplete argument: ${argv[i]}`);
  }
  const commands = { init: initialize, configure, list: inventory, status: reconcile, reconcile, 'compare-upstream': compareUpstream, import: importSkill, publish: publishSkill, 'adopt-finish': adoptFinish, 'adopt-release': adoptRelease, rename: renameSkill, retire, upgrade, help: guide };
  if (!Object.hasOwn(commands, command)) throw new Error(`Unknown command: ${command}`);
  if (command === 'status' && options.apply) throw new Error('status is read-only; use reconcile --apply.');
  return commands[command](options);
}
if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  try { console.log(json(cli())); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
