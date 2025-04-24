
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTxStatusParameters, GetTxStatusReturnType } from "./types/getTxStatus.js";

export async function getTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxStatusParameters
): Promise<GetTxStatusReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getTxStatus";
      params: GetTxStatusParameters;
    },
    GetTxStatusReturnType
  >({
    method: "platform.getTxStatus",
    params,
  });
}