import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetFeeStateReturnType } from "./types/getFeeState.js";

/**
 * Get the current fee state of the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeestate
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @returns The fee state. {@link GetFeeStateReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getFeeState } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const feeState = await getFeeState(client)
 * ```
 */
export async function getFeeState<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetFeeStateReturnType> {
  const feeState = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getFeeState";
      params: {};
    },
    GetFeeStateReturnType
  >({
    method: "platform.getFeeState",
    params: {},
  });

  return {
    ...feeState,
    capacity: BigInt(feeState.capacity),
    excess: BigInt(feeState.excess),
    price: BigInt(feeState.price),
  };
}
