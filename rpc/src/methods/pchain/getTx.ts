
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetTxParameters, GetTxReturnType } from "./types/getTx.js";

export async function getTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxParameters
): Promise<GetTxReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getTx";
      params: GetTxParameters;
    },
    GetTxReturnType
  >({
    method: "platform.getTx",
    params,
  });
}