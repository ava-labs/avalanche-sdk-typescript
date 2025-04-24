import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetAtomicTxStatusReturnType } from "./types/getAtomicTxStatus.js";
import { GetAtomicTxStatusParameters } from "./types/getAtomicTxStatus.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

export async function getAtomicTxStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAtomicTxStatusParameters
): Promise<GetAtomicTxStatusReturnType> {
  return client.request<
    CChainRpcSchema,
    {   
        method: "avax.getAtomicTxStatus"; 
        params: GetAtomicTxStatusParameters
    },
    GetAtomicTxStatusReturnType
  >({
    method: "avax.getAtomicTxStatus",
    params,
  });
}
