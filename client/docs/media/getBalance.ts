import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "./types/getBalance.js";

/**
 * Get the balance of AVAX controlled by a given address.
 *
 * - Docs: https://build.avax.network/docs/api-reference/p-chain/api#platformgetbalance
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The addresses to get the balance of {@link GetBalanceParameters}
 * @returns The balance information. {@link GetBalanceReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBalance } from '@avalanche-sdk/client/methods/pChain'
 *
 * const client = createAvalancheCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "<url>",
 *   },
 * })
 *
 * const balance = await getBalance(client, {
 *   addresses: ["P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p"]
 * })
 * ```
 */
export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBalanceParameters
): Promise<GetBalanceReturnType> {
  const balance = await client.request<
    PChainRpcSchema,
    {
      method: "platform.getBalance";
      params: GetBalanceParameters;
    },
    GetBalanceReturnType
  >({
    method: "platform.getBalance",
    params,
  });
  return {
    ...balance,
    balance: BigInt(balance.balance),
    unlocked: BigInt(balance.unlocked),
    lockedNotStakeable: BigInt(balance.lockedNotStakeable),
    lockedStakeable: BigInt(balance.lockedStakeable),
  };
}
