import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import {
  IsBootstrappedParameters,
  IsBootstrappedReturnType,
} from "./types/isBootstrapped.js";

/**
 * Check whether a given chain is done bootstrapping.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infoisbootstrapped
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The chain ID or alias. {@link IsBootstrappedParameters}
 * @returns Whether the chain is bootstrapped. {@link IsBootstrappedReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { isBootstrapped } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const isBootstrapped = await isBootstrapped(client, {
 *   chain: "X"
 * })
 * ```
 */
export async function isBootstrapped<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IsBootstrappedParameters
): Promise<IsBootstrappedReturnType> {
  return client.request<
    InfoRpcSchema,
    {
      method: "info.isBootstrapped";
      params: IsBootstrappedParameters;
    },
    IsBootstrappedReturnType
  >({
    method: "info.isBootstrapped",
    params,
  });
}
