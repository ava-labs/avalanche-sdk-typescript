import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "./types/getUTXOs.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get the UTXOs for a set of addresses.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetutxos
 *
 * @param client - The client to use.
 * @param parameters - The addresses and source chain. {@link GetUTXOsParameters}
 * @returns The UTXOs. {@link GetUTXOsReturnType}
 *
 * @example
 * ```ts
 * import { createXChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getUTXOs } from '@avalanche-sdk/rpc/methods/xChain'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const utxos = await getUTXOs(client, {
 *   addresses: ["X-avax1wstkjcj4z8n0n6utxmcxap6mn9nrdz5k0v3fjh"],
 *   sourceChain: "X"
 * })
 * ```
 */
export async function getUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetUTXOsParameters
): Promise<GetUTXOsReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getUTXOs";
      params: GetUTXOsParameters;
    },
    GetUTXOsReturnType
  >({
    method: "avm.getUTXOs",
    params,
  });
}
