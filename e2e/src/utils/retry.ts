/**
 * Retry / polling / spawn helpers used by the tmpnet driver.
 *
 * Trimmed port of avalanche-ai's `src/lib/utils/retry.ts` plus
 * `src/utils/process.ts`.  Only the surfaces actually consumed by the ported
 * tmpnet / signature-aggregator / avalanchego modules are included.
 */

import { logger } from "./logger.ts";

// ============================================================================
// withRetry
// ============================================================================

export interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  shouldRetry?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown, nextDelayMs: number) => void;
}

const DEFAULT_RETRY_OPTIONS = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  maxDelayMs: 10000,
} as const;

export function isRetryableHttpStatus(status: number): boolean {
  return status >= 500 && status < 600;
}

export function isTransientError(error: unknown): boolean {
  if (error instanceof Error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") return true;
    const msg = error.message.toLowerCase();
    return (
      msg.includes("econnrefused") ||
      msg.includes("econnreset") ||
      msg.includes("etimedout") ||
      msg.includes("fetch failed") ||
      msg.includes("network") ||
      msg.includes("socket") ||
      msg.includes("epipe") ||
      msg.includes("ehostunreach") ||
      msg.includes("enetunreach")
    );
  }
  return false;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  const shouldRetry = opts.shouldRetry ?? isTransientError;

  let lastError: unknown;
  let delay = opts.delayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === opts.maxAttempts || !shouldRetry(error)) {
        throw error;
      }
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.fileDebug(
        `[retry] Attempt ${attempt}/${opts.maxAttempts} failed: ${errorMsg}. Retrying in ${delay}ms...`
      );
      opts.onRetry?.(attempt, error, delay);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
    }
  }

  throw lastError;
}

// ============================================================================
// pollWithBackoff
// ============================================================================

export interface PollOptions<T> {
  maxAttempts: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
  maxDelayMs?: number;
  isSuccess: (result: T) => boolean;
  onAttempt?: (attempt: number, result: T) => void;
  onRetry?: (attempt: number, nextDelayMs: number) => void;
}

const DEFAULT_POLL_OPTIONS = {
  initialDelayMs: 200,
  backoffMultiplier: 2,
  maxDelayMs: 2000,
} as const;

export async function pollWithBackoff<T>(options: PollOptions<T>, pollFn: () => Promise<T>): Promise<T> {
  const opts = { ...DEFAULT_POLL_OPTIONS, ...options };
  let delay = opts.initialDelayMs;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
    }

    const result = await pollFn();
    opts.onAttempt?.(attempt, result);

    if (opts.isSuccess(result)) {
      return result;
    }

    if (attempt < opts.maxAttempts) {
      opts.onRetry?.(attempt, delay);
    }
  }

  return await pollFn();
}

// ============================================================================
// spawnWithTimeout (used by avalanchego download)
// ============================================================================

export const SPAWN_TIMEOUTS = {
  SHORT: 10_000,
  EXTRACT: 120_000,
  DOWNLOAD: 300_000,
  BUILD: 600_000,
} as const;

export interface SpawnWithTimeoutOptions {
  cwd?: string;
  env?: Record<string, string | undefined>;
  timeoutMs?: number;
  stdout?: "pipe" | "ignore" | "inherit";
  stderr?: "pipe" | "ignore" | "inherit";
}

export interface SpawnResult {
  exitCode: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  output: string;
}

export async function spawnWithTimeout(
  cmd: string[],
  options: SpawnWithTimeoutOptions = {}
): Promise<SpawnResult> {
  const { timeoutMs = 60_000, cwd, env, stdout = "pipe", stderr = "pipe" } = options;

  let timedOut = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const proc = Bun.spawn(cmd, {
    cwd,
    env: env ? { ...process.env, ...env } : process.env,
    stdout,
    stderr,
  });

  const timeoutPromise = new Promise<void>((resolve) => {
    timeoutId = setTimeout(() => {
      timedOut = true;
      try {
        proc.kill();
      } catch (e) {
        logger.ignored(`killing timed out process: ${cmd[0]}`, e);
      }
      resolve();
    }, timeoutMs);
  });

  await Promise.race([proc.exited, timeoutPromise]);

  if (timeoutId) clearTimeout(timeoutId);

  let stdoutText = "";
  let stderrText = "";

  if (stdout === "pipe" && proc.stdout) {
    try {
      stdoutText = await new Response(proc.stdout).text();
    } catch (e) {
      logger.ignored("reading stdout", e);
    }
  }
  if (stderr === "pipe" && proc.stderr) {
    try {
      stderrText = await new Response(proc.stderr).text();
    } catch (e) {
      logger.ignored("reading stderr", e);
    }
  }

  return {
    exitCode: timedOut ? null : proc.exitCode,
    timedOut,
    stdout: stdoutText,
    stderr: stderrText,
    output: [stdoutText, stderrText].filter(Boolean).join("\n"),
  };
}
