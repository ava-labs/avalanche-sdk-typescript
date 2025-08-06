import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetFeeConfigReturnType } from "./types/getFeeConfig.js";

/**
 * Get the fee configuration for the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeeconfig
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The fee configuration. {@link GetFeeConfigReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getFeeConfig } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const feeConfig = await getFeeConfig(client)
 * ```
 */
export async function getFeeConfig<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetFeeConfigReturnType> {
  const feeConfig = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getFeeConfig";
      params: {};
    },
    GetFeeConfigReturnType
  >({
    method: "platform.getFeeConfig",
    params: {},
  });
  return {
    ...feeConfig,
    maxCapacity: BigInt(feeConfig.maxCapacity),
    maxPerSecond: BigInt(feeConfig.maxPerSecond),
    minPrice: BigInt(feeConfig.minPrice),
    targetPerSecond: BigInt(feeConfig.targetPerSecond),
    excessConversionConstant: BigInt(feeConfig.excessConversionConstant),
  };
}
