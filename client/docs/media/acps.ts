import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { AcpsReturnType } from "./types/acps.js";

/**
 * Returns peer preferences for Avalanche Community Proposals (ACPs).
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infoacps
 *
 * @param client - The client to use.
 * @returns The ACP preferences. {@link AcpsReturnType}
 *
 * @example
 * ```ts
 * import { createInfoApiClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { acps } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createInfoApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const acpPreferences = await acps(client)
 * ```
 */
export async function acps<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<AcpsReturnType> {
  const acps = await client.request<
    InfoRpcSchema,
    { method: "info.acps"; params: {} },
    AcpsReturnType
  >({
    method: "info.acps",
    params: {},
  });
  return Object.keys(acps.acps).reduce(
    (acc, curr) => {
      const key = parseInt(curr);
      acc.acps.set(key, {
        supportWeight: BigInt((acps.acps as any)?.[key]?.supportWeight || 0n),
        supporters: new Set((acps.acps as any)?.[key]?.supporters || []),
        objectWeight: BigInt((acps.acps as any)?.[key]?.objectWeight || 0n),
        objectors: new Set((acps.acps as any)?.[key]?.objectors || []),
        abstainWeight: BigInt((acps.acps as any)?.[key]?.abstainWeight || 0n),
      });
      return acc;
    },
    { acps: new Map() } as AcpsReturnType
  );
}
