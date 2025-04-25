
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";
import { GetTxFeeReturnType } from "./types/getTxFee.js";

export async function getTxFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetTxFeeReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getTxFee";
      params: {};
    },
    GetTxFeeReturnType
  >({
    method: "avm.getTxFee",
    params: {},
  });
}