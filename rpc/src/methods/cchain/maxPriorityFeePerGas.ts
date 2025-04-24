import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";
import { MaxPriorityFeePerGasReturnType } from "./types/maxPriorityFeePerGas.js";

export async function maxPriorityFeePerGas<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<MaxPriorityFeePerGasReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "eth_maxPriorityFeePerGas";
      params: [];
    },
    MaxPriorityFeePerGasReturnType
  >({
    method: "eth_maxPriorityFeePerGas",
    params: [],
  });
}
