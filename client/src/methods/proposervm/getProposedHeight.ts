import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { ProposervmRpcSchema } from "../../methods/proposervm/proposervmRpcSchema.js";
import { GetProposedHeightReturnType } from "./types/getProposedHeight.js";

/**
 * Returns this node's current proposer VM height.
 *
 * - Docs: https://build.avax.network/docs/api-reference/proposervm-api#proposervmgetproposedheight
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns This node's current proposer VM height. {@link GetProposedHeightReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getProposedHeight } from '@avalanche-sdk/client/methods/proposervm'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const height = await getProposedHeight(client)
 * ```
 */
export async function getProposedHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetProposedHeightReturnType> {
  return client.request<
    ProposervmRpcSchema,
    { method: "proposervm.getProposedHeight"; params: {} },
    GetProposedHeightReturnType
  >({
    method: "proposervm.getProposedHeight",
    params: {},
  });
}
