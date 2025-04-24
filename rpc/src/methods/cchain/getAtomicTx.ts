import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { GetAtomicTxParameters, GetAtomicTxReturnType } from "./types/getAtomicTx.js";
import { CChainRpcSchema } from "./cChainRpcSchema.js";

export async function getAtomicTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAtomicTxParameters
): Promise<GetAtomicTxReturnType> {
  return client.request<
    CChainRpcSchema,
    {
      method: "avax.getAtomicTx";
      params: GetAtomicTxParameters;
    },
    GetAtomicTxReturnType
  >({
    method: "avax.getAtomicTx",
    params: params,
  });
}

