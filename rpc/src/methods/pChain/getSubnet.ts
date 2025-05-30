import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetSubnetParameters, GetSubnetReturnType } from "./types/getSubnet.js";

/**
 * Get information about a subnet.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetsubnet
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param parameters - The subnet ID {@link GetSubnetParameters}
 * @returns Information about the subnet. {@link GetSubnetReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getSubnet } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const subnet = await getSubnet(client, {
 *   subnetID: "11111111111111111111111111111111LpoYY"
 * })
 * ```
 */
export async function getSubnet<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetSubnetParameters
): Promise<GetSubnetReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getSubnet";
      params: GetSubnetParameters;
    },
    GetSubnetReturnType
  >({
    method: "platform.getSubnet",
    params,
  });
}
