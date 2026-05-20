/**
 * Secure filesystem helpers ported from avalanche-ai.
 *
 * Sets restrictive permissions on directories (0o700) and files (0o600) used
 * by the tmpnet driver, and bumps binaries to 0o755 so avalanchego /
 * signature-aggregator can execute.
 */

import { chmodSync, existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { logger } from "./logger.ts";

export const EXECUTABLE_MODE = 0o755;
export const SECURE_DIR_MODE = 0o700;
export const SECURE_FILE_MODE = 0o600;

/**
 * Create a directory with secure permissions (0o700).
 */
export function mkdirSecure(path: string, options?: { recursive?: boolean }): string | undefined {
  const result = mkdirSync(path, { ...options, mode: SECURE_DIR_MODE });

  if (existsSync(path)) {
    try {
      chmodSync(path, SECURE_DIR_MODE);
    } catch (e) {
      logger.ignored(`setting secure permissions on ${path}`, e);
    }
  }

  return result;
}

/**
 * Write a file with secure permissions (0o600).
 */
export function writeFileSecure(
  path: string,
  data: string | NodeJS.ArrayBufferView,
  options?: Parameters<typeof writeFileSync>[2]
): void {
  const opts = typeof options === "object" && options !== null ? options : {};
  writeFileSync(path, data, { ...opts, mode: SECURE_FILE_MODE });

  try {
    chmodSync(path, SECURE_FILE_MODE);
  } catch (e) {
    logger.ignored(`setting secure permissions on ${path}`, e);
  }
}

/**
 * Check if a file exists and has the owner-execute bit set.
 *
 * Uses mode bits rather than accessSync(X_OK) because root can execute
 * anything regardless of mode on Linux, which breaks CI assumptions.
 */
export function isExecutable(path: string): boolean {
  try {
    const stat = statSync(path);
    return (stat.mode & 0o100) !== 0;
  } catch {
    return false;
  }
}

/**
 * Ensure a binary file is executable; chmod 0o755 if needed.
 */
export function ensureExecutable(path: string): void {
  if (!existsSync(path)) {
    throw new Error(`Binary not found: ${path}`);
  }

  if (!isExecutable(path)) {
    try {
      chmodSync(path, EXECUTABLE_MODE);
      logger.file(`Fixed executable permissions on ${path}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      throw new Error(`Failed to make binary executable: ${path} - ${message}`);
    }

    if (!isExecutable(path)) {
      throw new Error(`Binary still not executable after chmod: ${path}`);
    }
  }
}
