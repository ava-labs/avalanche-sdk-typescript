import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBlockParameters, GetBlockReturnType } from "./types/getBlock.js";

export async function getBlock<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockParameters
): Promise<GetBlockReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlock";
      params: GetBlockParameters;
    },
    GetBlockReturnType
  >({
    method: "platform.getBlock",
    params,
  });
}
