/**
 * Cross-Process File Locking for Tmpnet
 *
 * Provides advisory file locks to prevent race conditions when multiple
 * processes operate on the same network concurrently.  Ported from
 * avalanche-ai.
 */

import {
  closeSync,
  existsSync,
  constants as fsConstants,
  openSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeSync,
} from "fs";
import { dirname, join } from "path";
import { mkdirSecure, writeFileSecure } from "../utils/fs-secure.ts";
import { logger } from "../utils/logger.ts";
import { LockInfoSchema, safeJsonParse } from "../utils/validation.ts";
import { NETWORKS_DIR, TMPNET_ROOT } from "./constants.ts";

interface LockInfo {
  pid: number;
  timestamp: number;
  operation: string;
  hostname: string;
}

export interface LockOptions {
  /** Maximum time to wait for lock acquisition in ms (default: 30000) */
  timeout?: number;
  /** Time between retry attempts in ms (default: 100) */
  retryInterval?: number;
  /** Description of the operation acquiring the lock */
  operation?: string;
  /** Maximum age in ms before a lock is considered stale (default: 300000 = 5 min) */
  staleThreshold?: number;
}

const DEFAULT_OPTIONS: Required<LockOptions> = {
  timeout: 30000,
  retryInterval: 100,
  operation: "unknown",
  staleThreshold: 300000,
};

function getNetworkLockPath(networkName: string): string {
  return join(NETWORKS_DIR, networkName, ".lock");
}

function getGlobalLockPath(): string {
  return join(TMPNET_ROOT, ".global.lock");
}

function isProcessRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readLockInfo(lockPath: string): LockInfo | null {
  try {
    if (!existsSync(lockPath)) return null;
    const content = readFileSync(lockPath, "utf-8");
    const parsed = safeJsonParse(content, LockInfoSchema, lockPath);
    if (!parsed) return null;
    return {
      pid: parsed.pid,
      timestamp: parsed.timestamp,
      operation: parsed.operation,
      hostname: parsed.hostname ?? "unknown",
    };
  } catch {
    return null;
  }
}

function writeLockInfo(lockPath: string, operation: string): void {
  const lockInfo: LockInfo = {
    pid: process.pid,
    timestamp: Date.now(),
    operation,
    hostname: process.env.HOSTNAME || "localhost",
  };

  const lockDir = dirname(lockPath);
  if (!existsSync(lockDir)) {
    mkdirSecure(lockDir, { recursive: true });
  }

  writeFileSecure(lockPath, JSON.stringify(lockInfo, null, 2));
}

function isLockStale(lockInfo: LockInfo, staleThreshold: number): boolean {
  if (!isProcessRunning(lockInfo.pid)) {
    logger.file(`[lock] Lock held by dead process ${lockInfo.pid}`);
    return true;
  }
  const age = Date.now() - lockInfo.timestamp;
  if (age > staleThreshold) {
    logger.file(`[lock] Lock is stale (age: ${age}ms, threshold: ${staleThreshold}ms)`);
    return true;
  }
  return false;
}

function removeLockFile(lockPath: string): void {
  try {
    if (existsSync(lockPath)) {
      unlinkSync(lockPath);
    }
  } catch (e) {
    logger.ignored("removing lock file", e);
  }
}

/**
 * Atomically create a lock file using O_CREAT | O_EXCL.  Returns true if we
 * won the race, false if the file already existed.
 */
function tryCreateLockFileAtomic(lockPath: string, operation: string): boolean {
  const lockInfo: LockInfo = {
    pid: process.pid,
    timestamp: Date.now(),
    operation,
    hostname: process.env.HOSTNAME || "localhost",
  };

  try {
    const fd = openSync(lockPath, fsConstants.O_CREAT | fsConstants.O_EXCL | fsConstants.O_WRONLY, 0o600);
    try {
      writeSync(fd, JSON.stringify(lockInfo, null, 2));
      return true;
    } finally {
      closeSync(fd);
    }
  } catch (error: any) {
    if (error?.code === "EEXIST") return false;
    logger.file(`[lock] Failed to create lock file atomically: ${error?.message}`);
    return false;
  }
}

function tryAcquireLock(lockPath: string, operation: string, staleThreshold: number): boolean {
  const existingLock = readLockInfo(lockPath);

  if (existingLock) {
    if (existingLock.pid === process.pid) {
      writeLockInfo(lockPath, operation); // re-entrant: refresh timestamp
      return true;
    }
    if (isLockStale(existingLock, staleThreshold)) {
      logger.file(`[lock] Removing stale lock from PID ${existingLock.pid}`);
      removeLockFile(lockPath);
      // fall through to atomic create
    } else {
      return false;
    }
  }

  const lockDir = dirname(lockPath);
  if (!existsSync(lockDir)) {
    try {
      mkdirSecure(lockDir, { recursive: true });
    } catch (error: any) {
      if (error?.code !== "EEXIST") {
        logger.file(`[lock] Failed to create lock directory: ${error?.message}`);
        return false;
      }
    }
  }

  return tryCreateLockFileAtomic(lockPath, operation);
}

async function acquireLock(lockPath: string, options: LockOptions = {}): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  let currentInterval = opts.retryInterval;
  const maxInterval = 1000;

  while (true) {
    if (tryAcquireLock(lockPath, opts.operation, opts.staleThreshold)) {
      logger.file(`[lock] Acquired lock at ${lockPath} for operation: ${opts.operation}`);
      return;
    }

    const elapsed = Date.now() - startTime;
    if (elapsed >= opts.timeout) {
      const existingLock = readLockInfo(lockPath);
      const holder = existingLock ? `PID ${existingLock.pid} (${existingLock.operation})` : "unknown";
      throw new Error(`Failed to acquire lock at ${lockPath} after ${opts.timeout}ms. Lock held by: ${holder}`);
    }

    await Bun.sleep(currentInterval);
    currentInterval = Math.min(currentInterval * 1.5, maxInterval);
  }
}

function releaseLock(lockPath: string): void {
  const lockInfo = readLockInfo(lockPath);
  if (lockInfo && lockInfo.pid === process.pid) {
    removeLockFile(lockPath);
    logger.file(`[lock] Released lock at ${lockPath}`);
  }
}

export interface LockHandle {
  release: () => void;
  path: string;
}

export async function acquireNetworkLock(networkName: string, options: LockOptions = {}): Promise<LockHandle> {
  const lockPath = getNetworkLockPath(networkName);
  await acquireLock(lockPath, {
    ...options,
    operation: options.operation || `network:${networkName}`,
  });
  return { release: () => releaseLock(lockPath), path: lockPath };
}

export async function acquireGlobalLock(options: LockOptions = {}): Promise<LockHandle> {
  const lockPath = getGlobalLockPath();
  await acquireLock(lockPath, {
    ...options,
    operation: options.operation || "global",
  });
  return { release: () => releaseLock(lockPath), path: lockPath };
}

export async function withNetworkLock<T>(
  networkName: string,
  fn: () => Promise<T>,
  options: LockOptions = {}
): Promise<T> {
  const lock = await acquireNetworkLock(networkName, options);
  try {
    return await fn();
  } finally {
    lock.release();
  }
}

export async function withGlobalLock<T>(fn: () => Promise<T>, options: LockOptions = {}): Promise<T> {
  const lock = await acquireGlobalLock(options);
  try {
    return await fn();
  } finally {
    lock.release();
  }
}

export function getNetworkLockStatus(networkName: string): LockInfo | null {
  const lockPath = getNetworkLockPath(networkName);
  const lockInfo = readLockInfo(lockPath);
  if (!lockInfo) return null;
  if (isLockStale(lockInfo, DEFAULT_OPTIONS.staleThreshold)) return null;
  return lockInfo;
}

export function getGlobalLockStatus(): LockInfo | null {
  const lockPath = getGlobalLockPath();
  const lockInfo = readLockInfo(lockPath);
  if (!lockInfo) return null;
  if (isLockStale(lockInfo, DEFAULT_OPTIONS.staleThreshold)) return null;
  return lockInfo;
}

export function forceRemoveNetworkLock(networkName: string): void {
  const lockPath = getNetworkLockPath(networkName);
  removeLockFile(lockPath);
  logger.file(`[lock] Force removed lock at ${lockPath}`);
}

export function forceRemoveGlobalLock(): void {
  const lockPath = getGlobalLockPath();
  removeLockFile(lockPath);
  logger.file("[lock] Force removed global lock");
}

export function cleanupStaleLocks(): number {
  let cleaned = 0;

  const globalLock = readLockInfo(getGlobalLockPath());
  if (globalLock && isLockStale(globalLock, DEFAULT_OPTIONS.staleThreshold)) {
    forceRemoveGlobalLock();
    cleaned++;
  }

  if (existsSync(NETWORKS_DIR)) {
    try {
      const entries = readdirSync(NETWORKS_DIR);
      for (const entry of entries) {
        if (entry === "latest") continue;
        const lockPath = getNetworkLockPath(entry);
        const lockInfo = readLockInfo(lockPath);
        if (lockInfo && isLockStale(lockInfo, DEFAULT_OPTIONS.staleThreshold)) {
          removeLockFile(lockPath);
          cleaned++;
          logger.file(`[lock] Cleaned stale lock for network: ${entry}`);
        }
      }
    } catch (e) {
      logger.ignored("cleaning stale locks", e);
    }
  }

  return cleaned;
}

// ============================================================================
// In-Process Async Mutex (re-exported for convenience)
// ============================================================================

export { AsyncMutex } from "../utils/async-mutex.ts";
