import { AvalancheWalletCoreClient } from "../../clients/createAvalancheWalletCoreClient";
import { AvalancheWalletRpcSchema } from "./avalancheWalletRPCSchema.js";
import { GetAccountPubKeyReturnType } from "./types/getAccountPubKey.js";

export async function getAccountPubKey(
  client: AvalancheWalletCoreClient
): Promise<GetAccountPubKeyReturnType> {
  return client.request<
    AvalancheWalletRpcSchema,
    {
      method: "avalance_getAccountPubKey";
      params: {};
    },
    GetAccountPubKeyReturnType
  >({
    method: "avalance_getAccountPubKey",
    params: {},
  });
}
