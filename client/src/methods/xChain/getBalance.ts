import { Chain, Transport } from "viem";
import {
  AvalancheCoreClient,
  AvalancheCoreClient as Client,
} from "../../clients/createAvalancheCoreClient.js";
import {
  GetBalanceParameters,
  GetBalanceReturnType,
} from "./types/getBalance.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";

/**
 * Get the balance of an asset controlled by given addresses.
 *
 * - Docs: https://build.avax.network/docs/api-reference/x-chain/api#avmgetbalance
 *
 * @deprecated `avm.getBalance` is deprecated in AvalancheGo, and AvalancheGo plans to remove it in an upcoming release. Use `getUTXOs` instead: page through all UTXOs, decode each with `getUtxoFromBytes` from `@avalanche-sdk/client/utils`, and add the amounts of the asset's secp256k1fx transfer outputs that only this address owns (threshold 1) and whose locktime has passed. `avm.getBalance` skips all other outputs.
 *
 * @param client - The client to use. {@link AvalancheCoreClient}
 * @param params - The addresses and asset ID. {@link GetBalanceParameters}
 * @returns The balance of the asset. {@link GetBalanceReturnType}
 *
 * @example
 * ```ts
 * import { createAvalancheCoreClient } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { getBalance } from '@avalanche-sdk/client/methods/xChain'
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
 *   addresses: ["X-avax18jma8ppw3nhx5r4ap8clazz0dps7rv5ukulre5"],
 *   assetID: "FvwEAhmxKfeiG8SnEvq42hc6whRyY3EFYAvebMqDNDGCgxN5Z"
 * })
 * ```
 */
export async function getBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBalanceParameters
): Promise<GetBalanceReturnType> {
  const balance = await client.request<
    XChainRpcSchema,
    {
      method: "avm.getBalance";
      params: GetBalanceParameters;
    },
    GetBalanceReturnType
  >({
    method: "avm.getBalance",
    params,
  });
  return {
    ...balance,
    balance: BigInt(balance.balance),
  };
}
