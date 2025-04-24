
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import { GetBlockByHeightParameters, GetBlockByHeightReturnType } from "./types/getBlockByHeight.js";

export async function getBlockByHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockByHeightParameters
): Promise<GetBlockByHeightReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getBlockByHeight";
      params: GetBlockByHeightParameters;
    },
    GetBlockByHeightReturnType
  >({
    method: "avm.getBlockByHeight",
    params,
  });
}