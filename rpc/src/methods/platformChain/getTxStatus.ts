
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetTxStatusParameters, GetTxStatusReturnType } from "./types/getTxStatus.js";

export async function getTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxStatusParameters
): Promise<GetTxStatusReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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