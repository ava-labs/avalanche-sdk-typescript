import { PrivateKeyAccount } from "viem/accounts";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import { GetAccountPubKeyReturnType } from "./types/getAccountPubKey.js";

/**
 * Get the public key of the account
 * @param client - The client to use {@link AvalancheWalletCoreClient}
 * @returns The public key of the account {@link GetAccountPubKeyReturnType}
 *
 * @example
 *
 * import { createWalletCoreClient, http } from '@avalanche-sdk/rpc'
 * import { avalanche } from '@avalanche-sdk/rpc/chains'
 * import { getAccountPubKey } from '@avalanche-sdk/rpc/methods/wallet'
 *
 * // Create an local avalanche account otherwise pass custom transport
 * const privateKey = "0x..."
 * const account = privateKeyToAvalancheAccount(privateKey)
 *
 * // Create a wallet core client
 * const client = createWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "http",
 *     url: "https://api.avax.network/ext/bc/C/rpc",
 *   },
 *   account,
 * })
 *
 * // or pass custom transport
 * const client = createWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "custom",
 *     provider: window.avalanche!,
 *   },
 * })
 *
 *
 * const pubKey = await getAccountPubKey(client)
 *
 */
export async function getAccountPubKey(
  client: AvalancheWalletCoreClient
): Promise<GetAccountPubKeyReturnType> {
  if (client.account && client.xpAccount) {
    return {
      evm: (client.account as PrivateKeyAccount).publicKey,
      xp: client.xpAccount.publicKey,
    };
  }

  return client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalanche_getAccountPubKey";
      params: {};
    },
    GetAccountPubKeyReturnType
  >({
    method: "avalanche_getAccountPubKey",
    params: {},
  });
}
