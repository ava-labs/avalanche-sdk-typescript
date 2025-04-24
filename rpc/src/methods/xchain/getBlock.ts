
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./XChainRpcSchema.js";
import { GetBlockParameters, GetBlockReturnType } from "./types/getBlock.js";

export async function getBlock<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockParameters
): Promise<GetBlockReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getBlock";
      params: GetBlockParameters;
    },
    GetBlockReturnType
  >({
    method: "avm.getBlock",
    params,
  });
}