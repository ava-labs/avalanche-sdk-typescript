/**
 * Minimal logger replacement for e2e tests.
 *
 * Provides a console-backed logger compatible with the surface used by the
 * tmpnet / signature-aggregator code ported from avalanche-ai.  No chalk, no
 * file rotation, no secret scrubbing -- this is intentionally lean.
 */

let silent = false;

function fmt(level: string, msg: string): string {
  return `[${level}] ${msg}`;
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return String(error);
}

export const logger = {
  setSilent: (value: boolean) => {
    silent = value;
  },

  // Console-facing levels (respect silent)
  info: (msg: string) => {
    if (!silent) console.log(fmt("INFO", msg));
  },
  success: (msg: string) => {
    if (!silent) console.log(fmt("OK", msg));
  },
  warn: (msg: string) => {
    if (!silent) console.warn(fmt("WARN", msg));
  },
  error: (msg: string) => {
    if (!silent) console.error(fmt("ERROR", msg));
  },
  debug: (msg: string) => {
    if (!silent && process.env.DEBUG) {
      console.log(fmt("DEBUG", msg));
    }
  },

  // "File" loggers -- in this slim port they just go to stderr when DEBUG is set.
  file: (msg: string) => {
    if (process.env.DEBUG) console.error(fmt("FILE", msg));
  },
  fileError: (msg: string) => {
    if (process.env.DEBUG) console.error(fmt("FILE-ERROR", msg));
  },
  fileDebug: (msg: string) => {
    if (process.env.DEBUG) console.error(fmt("FILE-DEBUG", msg));
  },
  fileWarn: (msg: string) => {
    if (process.env.DEBUG) console.error(fmt("FILE-WARN", msg));
  },

  /**
   * Log an expected/ignorable error.  Used in place of empty catch blocks.
   */
  ignored: (context: string, error: unknown) => {
    if (process.env.DEBUG) {
      console.error(fmt("DEBUG", `[ignored] ${context}: ${formatError(error)}`));
    }
  },

  // Misc helpers used by avalanche-ai logger surface but irrelevant here.
  print: (msg: string) => {
    if (!silent) console.log(msg);
  },
  blank: () => {
    if (!silent) console.log();
  },
};

export { formatError };
