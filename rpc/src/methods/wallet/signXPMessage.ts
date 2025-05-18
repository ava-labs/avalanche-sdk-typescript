import { Hex } from "viem";
import { parseAvalancheAccount } from "../../accounts/utils/parseAvalancheAccount.js";
import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient.js";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import {
  SignXPMessageParameters,
  SignXPMessageReturnType,
} from "./types/signXPMessage.js";

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
