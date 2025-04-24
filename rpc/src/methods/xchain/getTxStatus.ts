
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import { GetTxStatusParameters, GetTxStatusReturnType } from "./types/getTxStatus.js";

export async function getTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxStatusParameters
): Promise<GetTxStatusReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getTxStatus";
      params: GetTxStatusParameters;
    },
    GetTxStatusReturnType
  >({
    method: "avm.getTxStatus",
    params,
  });
}