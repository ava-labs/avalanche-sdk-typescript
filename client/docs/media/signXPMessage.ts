import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import {
  SignXPMessageParameters,
  SignXPMessageReturnType,
} from "./types/signXPMessage.js";

/**
 * Sign a message with the account
 * @param client - The client to use {@link AvalancheWalletCoreClient}
 * @param params - The parameters for the message {@link SignXPMessageParameters}
 * @returns The signature of the message with double checksum {@link SignXPMessageReturnType} encoded in CB58 format
 * The signature is for the following string:
 * "0x1A" + "Avalanche Signed Message:\n" + "size of message represented in 4 bytes" + message
 *
 * @example
 *
 * import { createWalletCoreClient, http } from '@avalanche-sdk/client'
 * import { avalanche } from '@avalanche-sdk/client/chains'
 * import { signXPMessage } from '@avalanche-sdk/client/methods/wallet'
 *
 * const client = createWalletCoreClient({
 *   chain: avalanche,
 *   transport: {
 *     type: "custom",
 *     provider: window.avalanche!,
 *   },
 * })
 *
 * const signature = await signXPMessage(client, {
 *   message: "Hello, world!",
 * })
 *
 */
export async function signXPMessage(
  client: AvalancheWalletCoreClient,
  params: SignXPMessageParameters
): Promise<SignXPMessageReturnType> {
  const { message, account, accountIndex } = params;
  const paramAc = parseAvalancheAccount(account);
  const xpAccount = paramAc?.xpAccount || client.xpAccount;
  if (xpAccount) {
    const signature = await xpAccount.signMessage(message);
    return { signature: signature as Hex };
  }

  return client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalanche_signMessage";
      params: Omit<SignXPMessageParameters, "account">;
    },
    SignXPMessageReturnType
  >({
    method: "avalanche_signMessage",
    params: { message, accountIndex },
  });
}
