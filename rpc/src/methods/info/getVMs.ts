import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetVMsReturnType } from "./types/getVMs.js";

/**
 * Get the virtual machines (VMs) this node is running.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetvms
 *
 * @param client - The client to use.
 * @returns The VMs running on this node. {@link GetVMsReturnType}
 *
 * @example
 * ```ts
 * import { createInfoApiClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getVMs } from '@avalanche-sdk/rpc/methods/info'
 *
 * const client = createInfoApiClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const vms = await getVMs(client)
 * ```
 */
export async function getVMs<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetVMsReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getVMs"; params: {} },
    GetVMsReturnType
  >({
    method: "info.getVMs",
    params: {},
  });
}
