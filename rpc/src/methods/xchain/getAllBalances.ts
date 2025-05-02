import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import {
  GetAllBalancesParameters,
  GetAllBalancesReturnType,
} from "./types/getAllBalances.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get the balances of all assets controlled by given addresses.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetallbalances
 *
 * @param client - The client to use.
 * @param parameters - The addresses to get balances for. {@link GetAllBalancesParameters}
 * @returns The balances of all assets. {@link GetAllBalancesReturnType}
 *
 * @example
 * ```ts
 * import { createXChainClient } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getAllBalances } from '@avalanche-sdk/rpc/methods/xChain'
 *
 * const client = createXChainClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *   },
 * })
 *
 * const balances = await getAllBalances(client, {
 *   addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"]
 * })
 * ```
 */
export async function getAllBalances<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAllBalancesParameters
): Promise<GetAllBalancesReturnType> {
  const allBalances = await client.request<
    XChainRpcSchema,
    {
      method: "avm.getAllBalances";
      params: GetAllBalancesParameters;
    },
    GetAllBalancesReturnType
  >({
    method: "avm.getAllBalances",
    params,
  });
  return {
    balances: allBalances.balances.map((balance) => ({
      ...balance,
      balance: BigInt(balance.balance),
    })),
  };
}
