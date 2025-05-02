import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use to make the request
 * @param parameters - The height and subnet ID {@link GetValidatorsAtParameters}
 * @returns The validators at that height. {@link GetValidatorsAtReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getValidatorsAt } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
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
