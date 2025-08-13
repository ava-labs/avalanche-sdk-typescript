import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import {
  GetBlockchainIDParameters,
  GetBlockchainIDReturnType,
} from "./types/getBlockchainID.js";

/**
 * Given a blockchain's alias, get its ID.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetblockchainid
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The blockchain alias. {@link GetBlockchainIDParameters}
 * @returns The blockchain ID. {@link GetBlockchainIDReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBlockchainID } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const blockchainID = await getBlockchainID(client, {
 *   alias: "X"
 * })
 * ```
 */
export async function getBlockchainID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockchainIDParameters
): Promise<GetBlockchainIDReturnType> {
  return client.request<
    InfoRpcSchema,
    {
      method: "info.getBlockchainID";
      params: GetBlockchainIDParameters;
    },
    GetBlockchainIDReturnType
  >({
    method: "info.getBlockchainID",
    params,
  });
}
