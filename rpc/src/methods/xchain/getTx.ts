
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import { GetTxParameters, GetTxReturnType } from "./types/getTx.js";

export async function getTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxParameters
): Promise<GetTxReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getTx";
      params: GetTxParameters;
    },
    GetTxReturnType
  >({
    method: "avm.getTx",
    params,
  });
}