import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetBlockchainStatusParameters,
  GetBlockchainStatusReturnType,
} from "./types/getBlockchainStatus.js";

/**
 * Get the status of a blockchain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetblockchainstatus
 *
 * @param client - The client to use to make the request
 * @param parameters - The blockchain ID {@link GetBlockchainStatusParameters}
 * @returns The blockchain status. {@link GetBlockchainStatusReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getBlockchainStatus } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const status = await getBlockchainStatus(client, {
 *   blockchainID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function getBlockchainStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockchainStatusParameters
): Promise<GetBlockchainStatusReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlockchainStatus";
      params: GetBlockchainStatusParameters;
    },
    GetBlockchainStatusReturnType
  >({
    method: "platform.getBlockchainStatus",
    params,
  });
}
