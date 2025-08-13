import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { UpgradesReturnType } from "./types/upgrades.js";

/**
 * Returns the upgrade history and configuration of the network.
 *
 * - Docs: https://build.avax.network/docs/api-reference/info-api#infoupgrades
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The network upgrade information. {@link UpgradesReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { upgrades } from '@avalanche-sdk/client/methods/info'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const upgrades = await upgrades(client)
 * ```
 */
export async function upgrades<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<UpgradesReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.upgrades"; params: {} },
    UpgradesReturnType
  >({
    method: "info.upgrades",
    params: {},
  });
}
