import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetBlockchainStatusParameters, GetBlockchainStatusReturnType } from "./types/getBlockchainStatus.js";

export async function getBlockchainStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockchainStatusParameters
): Promise<GetBlockchainStatusReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getBlockchainStatus";
      params: GetBlockchainStatusParameters;
    },
    GetBlockchainStatusReturnType
  >({
    method: "platform.getBlockchainStatus",
    params,
  });
}
