import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetCurrentValidatorsParameters, GetCurrentValidatorsReturnType } from "./types/getCurrentValidators.js";

export async function getCurrentValidators<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetCurrentValidatorsParameters
): Promise<GetCurrentValidatorsReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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
