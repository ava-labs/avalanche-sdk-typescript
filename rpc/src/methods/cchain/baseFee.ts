import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { BaseFeeReturnType } from "./types/baseFee.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

export async function baseFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<BaseFeeReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "eth_baseFee";
      params: [];
    },
    BaseFeeReturnType
  >({
    method: "eth_baseFee",
    params: [],
  });
}
