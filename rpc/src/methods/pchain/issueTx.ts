
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { IssueTxParameters, IssueTxReturnType } from "./types/issueTx.js";

export async function issueTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IssueTxParameters
): Promise<IssueTxReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.issueTx";
      params: IssueTxParameters;
    },
    IssueTxReturnType
  >({
    method: "platform.issueTx",
    params,
  });
}