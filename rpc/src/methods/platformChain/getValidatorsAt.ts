
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetValidatorsAtParameters, GetValidatorsAtReturnType } from "./types/getValidatorsAt.js";

export async function getValidatorsAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetValidatorsAtParameters
): Promise<GetValidatorsAtReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getValidatorsAt";
      params: GetValidatorsAtParameters;
    },
    GetValidatorsAtReturnType
  >({
    method: "platform.getValidatorsAt",
    params,
  });
}