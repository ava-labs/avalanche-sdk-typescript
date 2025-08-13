import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { ValidatesParameters, ValidatesReturnType } from "./types/validates.js";

/**
 * Validates a transaction.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformvalidates
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The parameters for the request
 * @returns The result of the validation. {@link ValidatesReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { validates } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const result = await validates(client, {
 *   tx: "0x1234567890abcdef",
 * })
 * ```
 */
export async function validates<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ValidatesParameters
): Promise<ValidatesReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.validates";
      params: ValidatesParameters;
    },
    ValidatesReturnType
  >({
    method: "platform.validates",
    params,
  });
}
