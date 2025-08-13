import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetCurrentValidatorsParameters,
  GetCurrentValidatorsReturnType,
} from "./types/getCurrentValidators.js";

/**
 * Get the current validators of the specified Subnet.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetcurrentvalidators
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The subnet ID {@link GetCurrentValidatorsParameters}
 * @returns The current validators. {@link GetCurrentValidatorsReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getCurrentValidators } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const validators = await getCurrentValidators(client, {
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function getCurrentValidators<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetCurrentValidatorsParameters
): Promise<GetCurrentValidatorsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getCurrentValidators";
      params: GetCurrentValidatorsParameters;
    },
    GetCurrentValidatorsReturnType
  >({
    method: "platform.getCurrentValidators",
    params,
  });
}
