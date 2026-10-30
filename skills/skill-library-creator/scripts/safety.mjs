import { windowsMetadata } from './windows-metadata.mjs';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';

export const WINDOWS = process.platform === 'win32';
const PROCESS_TIMEOUT = 20_000; // Bounded native metadata/link operations, not inference.
export const hash = value => crypto.createHash('sha256').update(value).digest('hex');
export const canonical = p => {
  const absolute = path.resolve(p);
  let ancestor = absolute;
  const missing = [];
  while (!fs.existsSync(ancestor) && path.dirname(ancestor) !== ancestor) { missing.unshift(path.basename(ancestor)); ancestor = path.dirname(ancestor); }
  // A link's coordinate is its own name, never the target's identity.
  for (let cursor = ancestor;; cursor = path.dirname(cursor)) {
    if (fs.lstatSync(cursor).isSymbolicLink()) return absolute;
    if (path.dirname(cursor) === cursor) break;
  }
  // Resolve existing physical spelling/aliases for comparison only.
  return path.join(fs.realpathSync.native(ancestor), ...missing).replace(/[\\/]+$/, '') || path.parse(ancestor).root;
};
function physicalIdentity(p) {
  let identity;
  for (let cursor = path.resolve(p);; cursor = path.dirname(cursor)) {
    let stat;
    try { stat = fs.lstatSync(cursor, { bigint: true }); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
    // Do not identify distinct link coordinates through their shared target.
    if (stat.isSymbolicLink()) return null;
    identity ||= stat;
    if (path.dirname(cursor) === cursor) return identity.ino ? identity : null;
  }
}
export const equalPath = (a, b) => {
  const left = canonical(a), right = canonical(b);
  if (left === right) return true;
  const x = physicalIdentity(left), y = physicalIdentity(right);
  return !!x && !!y && x.dev === y.dev && x.ino === y.ino;
};
export const inside = (root, p) => {
  if (WINDOWS) {
    // win32.relative folds case even inside case-sensitive Windows directories.
    // Compare each coordinate using physical identity, with exact missing names.
    for (let cursor = path.resolve(p);; cursor = path.dirname(cursor)) {
      if (equalPath(root, cursor)) return true;
      if (path.dirname(cursor) === cursor) return false;
    }
  }
  const rel = path.relative(canonical(root), canonical(p));
  if (rel === '' || (!rel.startsWith(`..${path.sep}`) && rel !== '..' && !path.isAbsolute(rel))) return true;
  // Directory identity also covers case aliases on case-insensitive POSIX volumes.
  // Missing leaves have no identity; compare their existing ancestors instead.
  const base = physicalIdentity(root);
  if (!base?.isDirectory() || !base.ino) return false;
  let cursor = path.resolve(p);
  for (;;) {
    const candidate = physicalIdentity(cursor);
    if (candidate?.isDirectory() && candidate.ino === base.ino && candidate.dev === base.dev) return true;
    const parent = path.dirname(cursor);
    if (parent === cursor) return false;
    cursor = parent;
  }
};
export function leaf(p) {
  try { return fs.lstatSync(p); } catch (e) { if (e.code === 'ENOENT') return null; throw e; }
}
export function parseMountInfo(text) {
  const points = new Set();
  for (const line of text.split('\n').filter(Boolean)) {
    const fields = line.split(' '), separator = fields.indexOf('-');
    if (separator < 6 || fields.length !== separator + 4 || !/^\d+$/.test(fields[0]) || !/^\d+$/.test(fields[1]) || !/^\d+:\d+$/.test(fields[2])) throw new Error('Cannot parse Linux mount metadata.');
    const raw = fields[4];
    if (/\\(?!040|011|012|134)/.test(raw)) throw new Error('Unknown Linux mount path escape.');
    const point = raw.replace(/\\(040|011|012|134)/g, (_, octal) => String.fromCharCode(Number.parseInt(octal, 8)));
    if (!point.startsWith('/') || /[\0\uFFFD]/.test(point)) throw new Error('Cannot decode Linux mount path.');
    points.add(point);
  }
  if (!points.has('/')) throw new Error('Linux mount metadata lacks the process root.');
  return points;
}
export function parseDarwinMounts(text) {
  const points = new Set();
  for (const line of text.split('\n').filter(Boolean)) {
    // Darwin prints source on mountpoint (options), without pathname escaping.
    // Refuse ambiguous delimiters rather than silently omit a mount boundary.
    const match = line.match(/^(.+) on (\/[^\r\n()]*) \(([^\r\n()]+)\)$/);
    if (!match || match[1].includes(' on ') || match[2].includes(' on ') || /[\0\uFFFD]/.test(line)) throw new Error('Cannot unambiguously parse Darwin mount metadata.');
    points.add(match[2]);
  }
  if (!points.has('/')) throw new Error('Darwin mount metadata lacks the process root.');
  return points;
}
export function mountBoundaryAllowed(mount, target, roots) {
  const contains = (root, coordinate) => {
    const rel = path.posix.relative(path.posix.resolve(root), path.posix.resolve(coordinate));
    return rel === '' || (rel !== '..' && !rel.startsWith('../') && !path.posix.isAbsolute(rel));
  };
  // Mount permission belongs to coordinates, never inode aliases across a bind.
  return roots.filter(Boolean).some(root => contains(mount, root) && (contains(root, target) || contains(target, root)));
}
function mountPoints() {
  const maxBytes = 8 * 1024 * 1024; // Mount metadata only; fail closed beyond this bound.
  if (process.platform === 'linux') {
    const fd = fs.openSync('/proc/self/mountinfo', 'r');
    try {
      const chunk = Buffer.alloc(64 * 1024), chunks = [];
      let length = 0, count;
      while ((count = fs.readSync(fd, chunk, 0, chunk.length, null)) > 0) {
        length += count;
        if (length > maxBytes) throw new Error('Linux mount metadata exceeds the inspection limit.');
        chunks.push(Buffer.from(chunk.subarray(0, count)));
      }
      return parseMountInfo(Buffer.concat(chunks, length).toString('utf8'));
    } finally { fs.closeSync(fd); }
  }
  if (process.platform === 'darwin') return parseDarwinMounts(execFileSync('/sbin/mount', [], { encoding: 'utf8', timeout: PROCESS_TIMEOUT, maxBuffer: maxBytes, env: { ...process.env, LC_ALL: 'C' } }));
  throw new Error('Native mount discovery unavailable; filesystem writes cannot be verified on this platform.');
}
export function guard(p, cloudRoot = null) {
  const policy = typeof cloudRoot === 'object' && cloudRoot !== null ? cloudRoot : { cloudRoot, mountRoot: path.resolve(p) };
  cloudRoot = policy.cloudRoot;
  const cloudRoots = [cloudRoot, ...(policy.cloudRoots || [])].filter(Boolean);
  p = path.resolve(p);
  // Device changes alone miss same-device bind mounts. Refresh native metadata
  // for every mutation guard, keeping the existing selected-root boundaries.
  const mounts = !WINDOWS && !policy.readOnly ? mountPoints() : null;
  let cursor = path.parse(p).root;
  let device = leaf(cursor)?.dev;
  for (const part of p.slice(cursor.length).split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, part);
    const stat = leaf(cursor);
    if (!stat) break;
    if (stat.isSymbolicLink()) throw new Error(`Redirect rejected: ${cursor}`);
    if (WINDOWS) {
      if (!process.env.SystemRoot) throw new Error('SystemRoot unavailable; native Windows metadata capability cannot be resolved.');
      const native = windowsMetadata(cursor);
      if (native) {
        if ((native.attributes & 1024) && (((native.tag & 0xffff0fff) >>> 0) !== 0x9000001a || !cloudRoots.some(root => inside(root, cursor)))) throw new Error(`Unsupported redirect or unverified cloud placeholder: ${cursor}`);
      } else {
      const inspected = spawnSync(path.join(process.env.SystemRoot, 'System32/fsutil.exe'), ['reparsepoint', 'query', cursor], { encoding: 'utf8', timeout: PROCESS_TIMEOUT, windowsHide: true, maxBuffer: 1024 * 1024 });
      if (inspected.error) throw inspected.error;
      const output = `${inspected.stdout || ''}\n${inspected.stderr || ''}`;
      if (inspected.status === 0) {
        const match = output.match(/0x([a-f0-9]{8})\b/i);
        if (!match) throw new Error(`Unknown reparse tag: ${cursor}`);
        const tag = Number.parseInt(match[1], 16);
        if (((tag & 0xffff0fff) >>> 0) !== 0x9000001a || !cloudRoots.some(root => inside(root, cursor))) throw new Error(`Unsupported redirect or unverified cloud placeholder: ${cursor}`);
      } else if (!/^\s*[^:\r\n]*\b4390\s*:/m.test(output)) {
        // SMB/virtual filesystems may lack FSCTL_GET_REPARSE_POINT. Independently
        // inspect the no-follow attributes; unknown reparse entries still fail closed.
        const script = '[int](Get-Item -LiteralPath $env:SKILL_LIBRARY_METADATA_PATH -Force -ErrorAction Stop).Attributes';
        const attrs = spawnSync(path.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe'), ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], { env: { ...process.env, SKILL_LIBRARY_METADATA_PATH: cursor }, encoding: 'utf8', timeout: PROCESS_TIMEOUT, windowsHide: true });
        if (attrs.error || attrs.status !== 0 || !/^\d+\s*$/.test(attrs.stdout || '') || (Number(attrs.stdout) & 1024)) throw new Error(`Cannot verify no-follow metadata: ${cursor}: ${output.trim()}`);
      }
      }
    }
    if (!WINDOWS && !policy.readOnly && (mounts.has(cursor) || (device !== undefined && stat.dev !== device)) && !mountBoundaryAllowed(cursor, p, [policy.mountRoot, ...(policy.mountRoots || [])])) throw new Error(`Mount boundary requires a confirmed --mount-root: ${cursor}`);
    device = stat.dev;
    if (!stat.isFile() && !stat.isDirectory()) throw new Error(`Unsupported filesystem entry: ${cursor}`);
  }
  return p;
}
export function makeDirectory(p, cloudRoot = null, mode) {
  guard(p, cloudRoot);
  fs.mkdirSync(p, { recursive: true, ...(mode === undefined ? {} : { mode }) });
  guard(p, cloudRoot);
  if (!WINDOWS && mode !== undefined) fs.chmodSync(p, mode);
}
export function writeNew(p, bytes, cloudRoot = null, mode) {
  guard(p, cloudRoot);
  makeDirectory(path.dirname(p), cloudRoot);
  fs.writeFileSync(p, bytes, { flag: 'wx', ...(mode === undefined ? {} : { mode }) });
  if (!WINDOWS && mode !== undefined) { guard(p, cloudRoot); fs.chmodSync(p, mode); }
  if (!fs.readFileSync(p).equals(Buffer.from(bytes))) throw new Error(`Write readback failed: ${p}`);
}
export function replace(p, bytes, expectedHash, cloudRoot = null) {
  guard(p, cloudRoot);
  if (!leaf(p) || hash(fs.readFileSync(p)) !== expectedHash) throw new Error(`Concurrent change: ${p}`);
  const temp = `${p}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  writeNew(temp, bytes, cloudRoot, fs.lstatSync(p).mode & 0o777);
  guard(p, cloudRoot);
  if (hash(fs.readFileSync(p)) !== expectedHash) throw new Error(`Concurrent change; candidate retained: ${temp}`);
  fs.renameSync(temp, p);
  if (!fs.readFileSync(p).equals(Buffer.from(bytes))) throw new Error(`Replacement readback failed: ${p}`);
}
export function tree(root, cloudRoot = null) {
  if (cloudRoot === null || typeof cloudRoot === 'string') cloudRoot = { cloudRoot, mountRoot: path.resolve(root) };
  guard(root, cloudRoot);
  if (!leaf(root)?.isDirectory()) throw new Error(`Missing physical directory: ${root}`);
  const rows = [{ path: '.', type: 'directory', mode: fs.lstatSync(root).mode & 0o777 }];
  function walk(dir) {
    for (const name of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, name);
      guard(full, cloudRoot);
      const stat = fs.lstatSync(full);
      const coordinate = { path: path.relative(root, full).split(path.sep).join('/'), mode: stat.mode & 0o777 };
      if (stat.isDirectory()) { rows.push({ ...coordinate, type: 'directory' }); walk(full); }
      else if (stat.isFile()) rows.push({ ...coordinate, type: 'file', sha256: hash(fs.readFileSync(full)) });
      else throw new Error(`Unsupported entry: ${full}`);
    }
  }
  walk(root);
  return rows;
}
export function copyTree(source, dest, cloudRoot = null, expectedRows = null) {
  const rows = tree(source, cloudRoot);
  if (expectedRows && JSON.stringify(rows) !== JSON.stringify(expectedRows)) throw new Error(`Source differs from reviewed snapshot; no copy created: ${source}`);
  if (leaf(dest)) throw new Error(`Destination occupied: ${dest}`);
  makeDirectory(dest, cloudRoot);
  for (const row of rows) {
    if (row.type === 'directory') { makeDirectory(path.join(dest, row.path), cloudRoot); continue; }
    const src = path.join(source, row.path);
    guard(src, cloudRoot);
    const bytes = fs.readFileSync(src);
    if (hash(bytes) !== row.sha256) throw new Error(`Source changed: ${src}`);
    writeNew(path.join(dest, row.path), bytes, cloudRoot, row.mode);
  }
  // Apply restrictive directory modes after their contents have been populated.
  if (!WINDOWS) for (const row of [...rows].reverse()) if (row.type === 'directory') fs.chmodSync(guard(path.join(dest, row.path), cloudRoot), row.mode);
  if (JSON.stringify(tree(source, cloudRoot)) !== JSON.stringify(rows)) throw new Error(`Source changed during copy; preserve candidate: ${dest}`);
  if (JSON.stringify(tree(dest, cloudRoot)) !== JSON.stringify(rows)) throw new Error(`Copy readback differs; preserve candidate: ${dest}`);
  return rows;
}
export function linkTarget(p) {
  if (!leaf(p)?.isSymbolicLink()) return null;
  if (WINDOWS) {
    const raw = execFileSync(path.join(process.env.SystemRoot || path.parse(process.execPath).root + 'Windows', 'System32/fsutil.exe'), ['reparsepoint', 'query', p], { encoding: 'utf8', timeout: PROCESS_TIMEOUT, windowsHide: true });
    if (!/0xa000000[3c]\b/i.test(raw)) return null; // Junction or explicitly selected directory symlink.
  }
  return path.resolve(path.dirname(p), fs.readlinkSync(p));
}
export function preflightLink(source, dest, cloudRoot = null, type = 'junction') {
  source = path.resolve(source);
  dest = path.resolve(dest);
  guard(source, cloudRoot);
  guard(path.dirname(dest), cloudRoot);
  if (WINDOWS) {
    if (!['junction', 'symlink'].includes(type)) throw new Error('Select junction or symlink link type.');
    if (type === 'junction' && (source.startsWith('\\\\') || dest.startsWith('\\\\'))) throw new Error('UNC requires explicit --link-type symlink and host permission; no junction can represent it.');
    if (type === 'junction' && /["%\r\n&|<>^!]/.test(source + dest)) throw new Error('Unsupported Windows command-path characters; no link created.');
    if (type === 'junction') for (const root of new Set([path.parse(source).root, path.parse(dest).root])) {
      const script = '[int]([System.IO.DriveInfo]::new($env:SKILL_LIBRARY_DRIVE_ROOT).DriveType)';
      const inspected = spawnSync(path.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe'), ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')], { env: { ...process.env, SKILL_LIBRARY_DRIVE_ROOT: root }, encoding: 'utf8', timeout: PROCESS_TIMEOUT, windowsHide: true });
      if (inspected.error || inspected.status !== 0 || !/^[2-6]\s*$/.test(inspected.stdout || '')) throw new Error(`Cannot verify native drive type: ${root}`);
      if (Number(inspected.stdout) === 4) throw new Error(`Mapped/network drive ${root} requires explicit --link-type symlink and host permission; no junction can represent it.`);
    }
  }
  return { source, destination: dest, type: WINDOWS ? type : 'symlink', capability: 'metadata verified; actual creation privilege and runtime pickup unverified' };
}
export function createLink(source, dest, cloudRoot = null, type = 'junction') {
  ({ source, destination: dest } = preflightLink(source, dest, cloudRoot, type));
  if (leaf(dest)) throw new Error(`Destination appeared: ${dest}`);
  if (WINDOWS && type === 'junction') {
    execFileSync(path.join(process.env.SystemRoot, 'System32/cmd.exe'), ['/d', '/v:off', '/c', `mklink /J "${dest}" "${source}"`], { timeout: PROCESS_TIMEOUT, windowsHide: true, windowsVerbatimArguments: true });
  } else fs.symlinkSync(source, dest, 'dir');
  if (!equalPath(linkTarget(dest) || '', source)) throw new Error(`Link readback failed: ${dest}`);
}
export function removeLink(dest, expectedTarget, cloudRoot = null) {
  guard(path.dirname(dest), cloudRoot);
  const current = linkTarget(dest);
  if (!current || !equalPath(current, expectedTarget)) throw new Error(`Link changed or is not owned: ${dest}`);
  // Node unlink removes the entry itself, including Windows junctions. Never recursive.
  fs.unlinkSync(dest);
  if (leaf(dest)) throw new Error(`Unlink readback failed: ${dest}`);
}
export function stateRoot() {
  if (WINDOWS) {
    if (!process.env.LOCALAPPDATA) throw new Error('LOCALAPPDATA unavailable; supply an explicit private --state directory.');
    return path.join(process.env.LOCALAPPDATA, 'skill-libraries');
  }
  if (process.platform === 'darwin') return path.join(os.homedir(), 'Library/Application Support/skill-libraries');
  return path.join(process.env.XDG_STATE_HOME || path.join(os.homedir(), '.local/state'), 'skill-libraries');
}
