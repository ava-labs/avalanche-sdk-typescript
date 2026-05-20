/**
 * Shared utility types used by the ported tmpnet / signature-aggregator code.
 */

/**
 * Result-like wrapper returned by most tmpnet operations.  This is a slimmed
 * version of avalanche-ai's `CommandOutput<T>`: we keep the `success / data /
 * error` shape but drop the strict `ErrorCode` enum -- a string `code` is
 * sufficient for e2e tests.
 */
export interface CommandOutput<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: {
    code: string;
    message: string;
    category?: string;
    retryable?: boolean;
    suggestedAction?: string;
    details?: Record<string, unknown>;
  };
  next?: string[];
}

/**
 * Anything with an async `dispose()` cleanup hook.  Kept as an interface to
 * match the source code shape; no DI container needed.
 */
export interface IDisposable {
  dispose(): Promise<void>;
}
