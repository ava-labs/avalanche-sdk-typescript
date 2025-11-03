import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetAllValidatorsAtParameters,
  GetAllValidatorsAtReturnType,
} from "./types/getAllValidatorsAt.js";

/**
 * Get all validators at a specific height across all Subnets and the Primary Network.
 *
 * Note: The public API (api.avax.network) only support height within 1000 blocks
 * from the P-Chain tip.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetallvalidatorsat
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The height {@link GetAllValidatorsAtParameters}
 * @returns All validators at that height across all Subnets. {@link GetAllValidatorsAtReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getAllValidatorsAt } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const validators = await getAllValidatorsAt(client, {
 *   height: 1000001
 * })
 * ```
 */
export async function getAllValidatorsAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAllValidatorsAtParameters
): Promise<GetAllValidatorsAtReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getAllValidatorsAt";
      params: GetAllValidatorsAtParameters;
    },
    GetAllValidatorsAtReturnType
  >({
    method: "platform.getAllValidatorsAt",
    params,
  });
}
