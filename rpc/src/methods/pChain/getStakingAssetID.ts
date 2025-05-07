import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetStakingAssetIDParameters,
  GetStakingAssetIDReturnType,
} from "./types/getStakingAssetID.js";

/**
 * Get the staking asset ID for a subnet.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetstakingassetid
 *
 * @param client - The client to use to make the request
 * @param parameters - The subnet ID {@link GetStakingAssetIDParameters}
 * @returns The staking asset ID. {@link GetStakingAssetIDReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getStakingAssetID } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const stakingAssetID = await getStakingAssetID(client, {
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function getStakingAssetID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetStakingAssetIDParameters
): Promise<GetStakingAssetIDReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getStakingAssetID";
      params: GetStakingAssetIDParameters;
    },
    GetStakingAssetIDReturnType
  >({
    method: "platform.getStakingAssetID",
    params,
  });
}
