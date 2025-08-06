import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetVMsReturnType } from "./types/getVMs.js";

/**
 * Get the virtual machines (VMs) this node is running.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infogetvms
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The VMs running on this node. {@link GetVMsReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getVMs } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
