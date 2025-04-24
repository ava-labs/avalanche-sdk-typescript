import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import { GetTxFeeReturnType } from "./types/getTxFee.js";


export async function getTxFee<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
): Promise<GetTxFeeReturnType> {
  return client.request<
    InfoRpcSchema,
    { method: "info.getTxFee"; params: {} },
    GetTxFeeReturnType
  >({
    method: "info.getTxFee",
    params: {}, 
  });
}
