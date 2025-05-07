import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetFeeStateReturnType } from "./types/getFeeState.js";

/**
 * Get the current fee state of the P-Chain.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetfeestate
 *
 * @param client - The client to use to make the request
 * @returns The fee state. {@link GetFeeStateReturnType}
 *
 * @example
 * ```ts
 * import { createPChainClient} from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getFeeState } from '@avalanche-sdk/rpc/methods/pChain'
 *
 * const client = createPChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
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
