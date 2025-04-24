
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetStakingAssetIDParameters, GetStakingAssetIDReturnType } from "./types/getStakingAssetID.js";

export async function getStakingAssetID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetStakingAssetIDParameters
): Promise<GetStakingAssetIDReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getStakingAssetID";
      params: GetStakingAssetIDParameters;
    },
    GetStakingAssetIDReturnType
  >({
    method: "platform.getStakingAssetID",
    params,
  });
}