import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetBlockchainStatusParameters, GetBlockchainStatusReturnType } from "./types/getBlockchainStatus.js";

export async function getBlockchainStatus<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetBlockchainStatusParameters
): Promise<GetBlockchainStatusReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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
