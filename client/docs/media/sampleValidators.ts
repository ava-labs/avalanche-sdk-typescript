import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  SampleValidatorsParameters,
  SampleValidatorsReturnType,
} from "./types/sampleValidators.js";

/**
 * Sample validators from the specified Subnet.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformsamplevalidators
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The number of validators to sample and subnet ID {@link SampleValidatorsParameters}
 * @returns The sampled validators. {@link SampleValidatorsReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { sampleValidators } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const validators = await sampleValidators(client, {
 *   size: 2,
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function sampleValidators<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: SampleValidatorsParameters
): Promise<SampleValidatorsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.sampleValidators";
      params: SampleValidatorsParameters;
    },
    SampleValidatorsReturnType
  >({
    method: "platform.sampleValidators",
    params,
  });
}
