
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { XChainRpcSchema } from "./xChainRpcSchema.js";
import { GetAssetDescriptionParameters, GetAssetDescriptionReturnType } from "./types/getAssetDescription.js";

export async function getAssetDescription<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetAssetDescriptionParameters
): Promise<GetAssetDescriptionReturnType> {
  return client.request<
    XChainRpcSchema,
    {
      method: "avm.getAssetDescription";
      params: GetAssetDescriptionParameters;
    },
    GetAssetDescriptionReturnType
  >({
    method: "avm.getAssetDescription",
    params,
  });
}