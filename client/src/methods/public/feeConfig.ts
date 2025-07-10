import { Chain } from "viem";

import { Client, Transport } from "viem";
import { AvalanchePublicRpcSchema } from "./avalanchePublicRpcSchema.js";
import { FeeConfigParameters, FeeConfigReturnType } from "./types/feeConfig.js";

/**
 * Get the fee config for a specific block.
 *
 * @param client - The client to use.
 * @param blk - The block number or hash to get the fee config for. {@link FeeConfigParameters  }
 * @returns The fee config for the specified block. {@link FeeConfigReturnType}
 *
 * @example
 * ```ts
 * import { createClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { feeConfig } from '@avalanche-sdk/client/methods/public'
 *
 * const client = createClient({
 *   chain: avalanche,
 *   transport: http(),
 * })
 *
 * const feeConfig = await feeConfig(client, { blk: "0x1" })
 * ```
 */
export async function feeConfig<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { blk }: FeeConfigParameters
): Promise<FeeConfigReturnType> {
  return client.request<
    AvalanchePublicRpcSchema,
    {
      method: "eth_feeConfig";
      params: [string];
    },
    FeeConfigReturnType
  >({
    method: "eth_feeConfig",
    params: [blk ?? "latest"],
  });
}
