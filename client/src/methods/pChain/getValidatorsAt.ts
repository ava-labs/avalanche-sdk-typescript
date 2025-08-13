import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetValidatorsAtParameters,
  GetValidatorsAtReturnType,
} from "./types/getValidatorsAt.js";

/**
 * Get the validators at a specific height.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetvalidatorsat
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The height and subnet ID {@link GetValidatorsAtParameters}
 * @returns The validators at that height. {@link GetValidatorsAtReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getValidatorsAt } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const validators = await getValidatorsAt(client, {
 *   height: 1000001,
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function getValidatorsAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetValidatorsAtParameters
): Promise<GetValidatorsAtReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getValidatorsAt";
      params: GetValidatorsAtParameters;
    },
    GetValidatorsAtReturnType
  >({
    method: "platform.getValidatorsAt",
    params,
  });
}
