import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { PeersParameters, PeersReturnType } from "./types/peers.js";

/**
 * Get a description of peer connections.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infopeers
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param parameters - Optional node IDs to filter peers. {@link PeersParameters}
 * @returns Information about connected peers. {@link PeersReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { peers } from '@avalanche-sdk/rpc/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const peers = await peers(client, {
 *   nodeIDs: []
 * })
 * ```
 */
export async function peers<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: PeersParameters
): Promise<PeersReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.peers"; params: PeersParameters },
    PeersReturnType
  >({
    method: "info.peers",
    params,
  });
}
