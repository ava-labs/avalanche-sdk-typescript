import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import {
  GetAssetDescriptionParameters,
  GetAssetDescriptionReturnType,
} from "./types/getAssetDescription.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get information about an asset.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetassetdescription
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The asset ID. {@link GetAssetDescriptionParameters}
 * @returns The asset description. {@link GetAssetDescriptionReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getAssetDescription } from '@avalanche-sdk/client/methods/xChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const asset = await getAssetDescription(client, {
 *   assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
 * })
 * ```
 */
export async function getAssetDescription<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAssetDescriptionParameters
): Promise<GetAssetDescriptionReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getAssetDescription";
      params: GetAssetDescriptionParameters;
    },
    GetAssetDescriptionReturnType
  >({
    method: "avm.getAssetDescription",
    params,
  });
}
