import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetCurrentSupplyParameters,
  GetCurrentSupplyReturnType,
} from "./types/getCurrentSupply.js";

/**
 * Get the current supply of an asset.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetcurrentsupply
 *
 * @param client - The client to use to make the request {@link AvalancheCoreClient}
 * @param params - The asset ID {@link GetCurrentSupplyParameters}
 * @returns The current supply. {@link GetCurrentSupplyReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getCurrentSupply } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const supply = await getCurrentSupply(client, {
 *   assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
 * })
 * ```
 */
export async function getCurrentSupply<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetCurrentSupplyParameters
): Promise<GetCurrentSupplyReturnType> {
  const currentSupply = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getCurrentSupply";
      params: GetCurrentSupplyParameters;
    },
    GetCurrentSupplyReturnType
  >({
    method: "platform.getCurrentSupply",
    params,
  });
  return {
    supply: BigInt(currentSupply.supply),
  };
}
