
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "./types/getUTXOs.js";

export async function getUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetUTXOsParameters
): Promise<GetUTXOsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getUTXOs";
      params: GetUTXOsParameters;
    },
    GetUTXOsReturnType
  >({
    method: "platform.getUTXOs",
    params,
  });
}