import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "./types/getUTXOs.js";

/**
 * Get the UTXOs for a set of addresses.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetutxos
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The addresses and source chain {@link GetUTXOsParameters}
 * @returns The UTXOs. {@link GetUTXOsReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getUTXOs } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const utxos = await getUTXOs(client, {
 *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"],
 *   sourceChain: "X"
 * })
 * ```
 */
export async function getUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetUTXOsParameters
): Promise<GetUTXOsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getUTXOs";
      params: GetUTXOsParameters;
    },
    GetUTXOsReturnType
  >({
    method: "platform.getUTXOs",
    params,
  });
}
