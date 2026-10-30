// Process-scoped Windows metadata adapter. Cache the capability, never path results.
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import { spawn } from 'node:child_process';
import path from 'node:path';

let worker, unavailable = false;
const TIMEOUT = 20_000;
export function windowsMetadata(file) {
  if (process.platform !== 'win32' || unavailable) return null;
  const result = new Int32Array(new SharedArrayBuffer(12));
  try {
    if (!worker) {
      worker = new Worker(new URL(import.meta.url), { execArgv: [], workerData: { skillLibraryMetadata: true } });
      worker.on('error', () => { unavailable = true; });
      worker.on('exit', () => { unavailable = true; });
      worker.unref();
    }
    worker.postMessage({ file, buffer: result.buffer });
    if (Atomics.wait(result, 0, 0, TIMEOUT) === 'timed-out' || Atomics.load(result, 0) !== 1) {
      unavailable = true;
      worker.postMessage({ close: true });
      return null; // The caller retains its existing bounded native fallback.
    }
    return { attributes: result[1] >>> 0, tag: result[2] >>> 0 };
  } catch {
    unavailable = true;
    worker?.postMessage({ close: true });
    return null;
  }
}

if (!isMainThread && workerData?.skillLibraryMetadata === true) {
  // A single pipe-owned helper amortizes PowerShell startup and Add-Type. Each
  // request opens a new no-follow handle. EOF or parent exit ends the helper.
  const script = String.raw`
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using Microsoft.Win32.SafeHandles;
public static class SkillMetadata {
  [StructLayout(LayoutKind.Sequential)]
  private struct AttributeTag { public uint Attributes; public uint Tag; }
  [DllImport("kernel32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
  private static extern SafeFileHandle CreateFileW(string path, uint access, uint share, IntPtr security, uint creation, uint flags, IntPtr template);
  [DllImport("kernel32.dll", SetLastError=true)]
  [return: MarshalAs(UnmanagedType.Bool)]
  private static extern bool GetFileInformationByHandleEx(SafeFileHandle handle, int kind, out AttributeTag info, uint size);
  private static Timer ownerTimer;
  public static void Watch(int pid) {
    Process owner = Process.GetProcessById(pid);
    ownerTimer = new Timer(delegate(object state) { if (owner.HasExited) Environment.Exit(0); }, null, 1000, 1000);
  }
  public static string Read(string path) {
    using (SafeFileHandle handle = CreateFileW(path, 0, 7, IntPtr.Zero, 3, 0x02200000, IntPtr.Zero)) {
      if (handle.IsInvalid) throw new Win32Exception(Marshal.GetLastWin32Error());
      AttributeTag info;
      if (!GetFileInformationByHandleEx(handle, 9, out info, 8)) throw new Win32Exception(Marshal.GetLastWin32Error());
      return info.Attributes.ToString() + ":" + info.Tag.ToString();
    }
  }
}
'@
[SkillMetadata]::Watch([int]$env:SKILL_LIBRARY_OWNER_PID)
while ($null -ne ($line = [Console]::ReadLine())) {
  try { $file = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($line)); [Console]::WriteLine([SkillMetadata]::Read($file)) }
  catch { [Console]::WriteLine('error') }
}
`;
  let child, pending, timer, output = '', closed = false;
  const finish = (state, attributes = 0, tag = 0) => {
    clearTimeout(timer);
    if (!pending) return;
    pending[1] = attributes; pending[2] = tag;
    Atomics.store(pending, 0, state); Atomics.notify(pending, 0);
    pending = null;
  };
  const close = () => { closed = true; finish(2); child?.stdin.destroy(); child?.kill(); parentPort.close(); };
  parentPort.on('message', message => {
    if (message.close) { close(); return; }
    pending = new Int32Array(message.buffer);
    if (closed) { finish(2); return; }
    timer = setTimeout(close, TIMEOUT - 1000);
    if (!child) {
      if (!process.env.SystemRoot) { close(); return; }
      child = spawn(path.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe'),
        ['-NoProfile', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64')],
        { windowsHide: true, env: { ...process.env, SKILL_LIBRARY_OWNER_PID: String(process.pid) }, stdio: ['pipe', 'pipe', 'ignore'] });
      child.on('error', close); child.on('exit', close); child.stdin.on('error', close);
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', text => {
        output += text;
        if (output.length > 1024) { close(); return; }
        const end = output.indexOf('\n');
        if (end < 0) return;
        const line = output.slice(0, end).trim(); output = output.slice(end + 1);
        const match = /^(\d+):(\d+)$/.exec(line);
        if (!match || Number(match[1]) > 0xffffffff || Number(match[2]) > 0xffffffff) { close(); return; }
        finish(1, Number(match[1]), Number(match[2]));
      });
    }
    child.stdin.write(Buffer.from(message.file, 'utf8').toString('base64') + '\n');
  });
}
