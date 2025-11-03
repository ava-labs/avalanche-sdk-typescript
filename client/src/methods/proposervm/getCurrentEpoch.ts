import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { ProposervmRpcSchema } from "../../methods/proposervm/proposervmRpcSchema.js";
import { GetCurrentEpochReturnType } from "./types/getCurrentEpoch.js";

/**
 * Returns the current epoch information.
 *
 * - Docs: https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetcurrentepoch
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The current epoch information. {@link GetCurrentEpochReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getCurrentEpoch } from '@avalanche-sdk/client/methods/proposervm'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const epoch = await getCurrentEpoch(client)
 * ```
 */
export async function getCurrentEpoch<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetCurrentEpochReturnType> {
  return client.request<
    ProposervmRpcSchema,
    { method: "proposervm.getCurrentEpoch"; params: {} },
    GetCurrentEpochReturnType
  >({
    method: "proposervm.getCurrentEpoch",
    params: {},
  });
}
