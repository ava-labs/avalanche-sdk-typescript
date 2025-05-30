import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { AdminRpcSchema } from "./adminRpcSchema.js";
import { LoadVMsReturnType } from "./types/loadVMs.js";

/**
 * Dynamically loads any virtual machines installed on the node as plugins.
 *
 * - Docs: https://build.avax.network/docs/api-reference/admin-api#adminloadvms
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The virtual machines installed on the node. {@link LoadVMsReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { loadVMs } from '@avalanche-sdk/rpc/methods/admin'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * });
 *
 * const vms = await loadVMs(client);
 * ```
 */
export async function loadVMs<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<LoadVMsReturnType> {
  return client.request<
    AdminRpcSchema,
    {
      method: "admin.loadVMs";
      params: {};
    },
    LoadVMsReturnType
  >({
    method: "admin.loadVMs",
    params: {},
  });
}
