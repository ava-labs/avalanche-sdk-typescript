
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetStakingAssetIDParameters, GetStakingAssetIDReturnType } from "./types/getStakingAssetID.js";

export async function getStakingAssetID<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetStakingAssetIDParameters
): Promise<GetStakingAssetIDReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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