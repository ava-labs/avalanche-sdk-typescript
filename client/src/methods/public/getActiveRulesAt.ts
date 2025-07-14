import { Chain, Client, Transport } from "viem";
import { AvalanchePublicRpcSchema } from "./avalanchePublicRpcSchema.js";
import {
  GetActiveRulesAtParameters,
  GetActiveRulesAtReturnType,
} from "./types/getActiveRulesAt.js";

/**
 * Get the active rules at a specific timestamp.
 *
 * @param client - The client to use.
 * @param timestamp - The timestamp to get the active rules at. {@link GetActiveRulesAtParameters}
 * @returns The active rules at the specified timestamp. {@link GetActiveRulesAtReturnType}
 *
 * @example
 * ```ts
 * import { createClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getActiveRulesAt } from '@avalanche-sdk/client/methods/public'
 *
 * const client = createClient({
 *   chain: avalanche,
 *   transport: http(),
 * })
 *
 * const activeRules = await getActiveRulesAt(client, { timestamp: "0x1" })
 * ```
 */
export async function getActiveRulesAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { timestamp }: GetActiveRulesAtParameters
): Promise<GetActiveRulesAtReturnType> {
  return client.request<
    AvalanchePublicRpcSchema,
    {
      method: "eth_getActiveRulesAt";
      params: [string];
    },
    GetActiveRulesAtReturnType
  >({
    method: "eth_getActiveRulesAt",
    params: [timestamp ?? "latest"],
  });
}
