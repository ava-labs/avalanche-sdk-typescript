import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "./types/getUTXOs.js";

/**
 *   Get the UTXOs for a set of addresses.
 *
 * - Docs: https://build.avax.network/docs/api-reference/c-chain/api#avaxgetutxos
 *
 * @param client - The client to use.
 * @param params - The parameters to use. {@link GetUTXOsParameters}
 * @returns The UTXOs for a set of addresses. {@link GetUTXOsReturnType}
 *
 * @example
 * ```ts
 * import { createCChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getUTXOs } from '@avalanche-sdk/rpc/methods/cChain'
 *
 * const client = createCChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const utxos = await getUTXOs(client, {
 *   addresses: ["X-avax1...", "X-avax2..."],
 *   limit: 100
 * })
 * ```
 */
export async function getUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetUTXOsParameters
): Promise<GetUTXOsReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "avax.getUTXOs";
      params: GetUTXOsParameters;
    },
    GetUTXOsReturnType
  >({
    method: "avax.getUTXOs",
    params,
  });
}
