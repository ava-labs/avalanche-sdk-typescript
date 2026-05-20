/**
 * Validation schemas used by the tmpnet driver.
 *
 * Trimmed-down port of avalanche-ai's `src/lib/validation/{index,schemas}.ts`.
 * Only the schemas actually consumed by tmpnet/lock/network-operations are
 * included.
 */

import { z, type ZodError, type ZodSchema, type ZodIssue } from "zod";
import { logger } from "./logger.ts";

// ----------------------------------------------------------------------------
// Schemas
// ----------------------------------------------------------------------------

/** Lock file content used by `tmpnet/lock.ts`. */
export const LockInfoSchema = z.object({
  operation: z.string(),
  pid: z.number(),
  timestamp: z.number(),
  hostname: z.string().optional(),
});

/**
 * Tmpnet node config (config.json inside each node directory).  Some fields
 * are optional for backwards compatibility with partial configs.
 */
export const NodeConfigSchema = z.object({
  nodeId: z.string(),
  httpPort: z.number().positive(),
  stakingPort: z.number().positive().optional(),
  isValidator: z.boolean().optional(),
  trackedSubnets: z.array(z.string()).optional(),
});

/** Top-level config.json stored at the network root. */
export const TmpnetNetworkConfigSchema = z.object({
  uuid: z.string(),
  created: z.string(),
  avalanchegoPath: z.string(),
  nodeCount: z.number().positive(),
});

export type LockInfo = z.infer<typeof LockInfoSchema>;
export type NodeConfig = z.infer<typeof NodeConfigSchema>;
export type TmpnetNetworkConfig = z.infer<typeof TmpnetNetworkConfigSchema>;

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function formatZodError(error: ZodError<unknown>): string {
  return error.issues.map((e: ZodIssue) => `${e.path.join(".")}: ${e.message}`).join(", ");
}

/**
 * Parse a JSON string with schema validation.  Returns `null` on parse or
 * validation failure (logging the reason).
 */
export function safeJsonParse<T>(input: string, schema: ZodSchema<T>, context?: string): T | null {
  try {
    const parsed = JSON.parse(input);
    const result = schema.safeParse(parsed);

    if (!result.success) {
      logger.file(
        `[validation] Schema validation failed${context ? ` for ${context}` : ""}: ${formatZodError(result.error)}`
      );
      return null;
    }

    return result.data;
  } catch (error) {
    logger.file(
      `[validation] JSON parse failed${context ? ` for ${context}` : ""}: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
    return null;
  }
}
