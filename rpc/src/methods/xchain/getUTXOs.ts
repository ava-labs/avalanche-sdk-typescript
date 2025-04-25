
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";
import { GetUTXOsParameters, GetUTXOsReturnType } from "./types/getUTXOs.js";

export async function getUTXOs<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetUTXOsParameters
): Promise<GetUTXOsReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getUTXOs";
      params: GetUTXOsParameters;
    },
    GetUTXOsReturnType
  >({
    method: "avm.getUTXOs",
    params,
  });
}