import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetNetworkNameReturnType } from "./types/getNetworkName.js";

/**
 * Get the name of the network this node is participating in.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetnetworkname
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The network name. {@link GetNetworkNameReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getNetworkName } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const networkName = await getNetworkName(client)
 * ```
 */
export async function getNetworkName<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetNetworkNameReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getNetworkName"; params: {} },
    GetNetworkNameReturnType
  >({
    method: "info.getNetworkName",
    params: {},
  });
}
