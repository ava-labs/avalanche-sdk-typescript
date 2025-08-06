import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNetworkIDReturnType } from "./types/getNetworkID.js";

/**
 * Get the ID of the network this node is participating in.
 * Network ID of 1 = Mainnet, Network ID of 5 = Fuji (testnet).
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnetworkid
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The network ID. {@link GetNetworkIDReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getNetworkID } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const networkID = await getNetworkID(client)
 * ```
 */
export async function getNetworkID<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNetworkIDReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNetworkID"; params: {} },
    GetNetworkIDReturnType
  >({
    method: "info.getNetworkID",
    params: {},
  });
}
