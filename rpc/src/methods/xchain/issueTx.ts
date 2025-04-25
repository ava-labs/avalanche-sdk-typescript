
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";
import { IssueTxParameters, IssueTxReturnType } from "./types/issueTx.js";

export async function issueTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IssueTxParameters
): Promise<IssueTxReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.issueTx";
      params: IssueTxParameters;
    },
    IssueTxReturnType
  >({
    method: "avm.issueTx",
    params,
  });
}