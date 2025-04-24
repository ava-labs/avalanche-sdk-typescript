import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetCurrentValidatorsParameters, GetCurrentValidatorsReturnType } from "./types/getCurrentValidators.js";

export async function getCurrentValidators<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetCurrentValidatorsParameters
): Promise<GetCurrentValidatorsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.getCurrentValidators";
      params: GetCurrentValidatorsParameters;
    },
    GetCurrentValidatorsReturnType
  >({
    method: "platform.getCurrentValidators",
    params,
  });
}
