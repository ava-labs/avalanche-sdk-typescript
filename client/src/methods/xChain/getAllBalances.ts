import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
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
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The addresses to get balances for. {@link GetAllBalancesParameters}
 * @returns The balances of all assets. {@link GetAllBalancesReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getAllBalances } from '@avalanche-sdk/client/methods/xChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
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
