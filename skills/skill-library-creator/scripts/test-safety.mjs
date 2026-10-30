import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { parseMountInfo, parseDarwinMounts, mountBoundaryAllowed, equalPath, inside, guard, writeNew, WINDOWS } from './safety.mjs';

const rootMount = '1 0 8:1 / / rw - ext4 /dev/root rw\n';

test('synthetic Linux records retain same-device bind mounts and decode proc pathname escapes', () => {
  const mounts = parseMountInfo(rootMount + String.raw`2 1 8:1 /original /work/bind\040folder\011tab\012line\134name rw shared:3 - ext4 /dev/root rw` + '\n');
  assert(mounts.has('/work/bind folder\ttab\nline\\name'));
  assert.equal(mounts.size, 2);
  assert.throws(() => parseMountInfo(rootMount + String.raw`2 1 8:1 /original /work/\123 rw - ext4 /dev/root rw`), /escape/);
  assert.throws(() => parseMountInfo('invalid'), /parse/);
  assert.throws(() => parseMountInfo(''), /root/);
});

test('synthetic Darwin output uses source on mountpoint and refuses ambiguous records', () => {
  const root = '/dev/disk1s1 on / (apfs, local, read-only)\n';
  assert(parseDarwinMounts(root + '//user@host/share on /Volumes/Team files (smbfs, nodev, mounted by alex)\n').has('/Volumes/Team files'));
  assert.throws(() => parseDarwinMounts(root + 'source on /Volumes/a on /b (smbfs)\n'), /unambiguously/);
  assert.throws(() => parseDarwinMounts(root + 'source on /Volumes/a (nested) (smbfs)\n'), /unambiguously/);
  assert.throws(() => parseDarwinMounts(''), /root/);
});

test('mount authorization uses coordinates and retains selected-root boundaries', () => {
  assert.equal(mountBoundaryAllowed('/work/bind', '/work/bind/child', ['/work']), false);
  assert.equal(mountBoundaryAllowed('/work/bind', '/work/bind/child', ['/outside/original']), false);
  assert.equal(mountBoundaryAllowed('/work/bind', '/work/bind/child', ['/work/bind']), true);
  assert.equal(mountBoundaryAllowed('/work/bind', '/work/bind/child', ['/work/bind/child']), true);
  assert.equal(mountBoundaryAllowed('/work/bind', '/work/bind/child', ['/work/bind/sibling']), false);
  assert.equal(mountBoundaryAllowed('/work/bind', '/work/bind/child', ['/work/binder']), false);
});

test('native physical paths retain existing case aliases and conservatively distinguish missing names', () => {
  const fixture = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'skill-library-safety-'));
  const directory = path.join(fixture, 'MixedCase');
  fs.mkdirSync(directory);
  assert.equal(equalPath(directory, directory), true);
  assert.equal(equalPath(path.join(directory, 'Missing'), path.join(directory, 'missing')), false);
  assert.equal(inside(path.join(directory, 'Missing'), path.join(directory, 'missing', 'child')), false);
  assert.equal(inside(directory, path.join(directory, 'missing', 'child')), true);
  const alias = path.join(fixture, 'MIXEDCASE');
  if (fs.existsSync(alias)) assert.equal(equalPath(directory, alias), true);
  else {
    fs.mkdirSync(alias);
    assert.equal(equalPath(directory, alias), false);
    assert.equal(inside(directory, path.join(alias, 'child')), false);
  }
  const output = path.join(directory, 'bounded-write.txt');
  writeNew(output, 'physical safety smoke\n', { mountRoot: fixture });
  assert.equal(guard(output, { mountRoot: fixture }), output);
  assert.equal(fs.readFileSync(output, 'utf8'), 'physical safety smoke\n');
  // Deliberately retained. No recursive cleanup or link/permission changes.
});
