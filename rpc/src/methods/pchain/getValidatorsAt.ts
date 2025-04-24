
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { GetValidatorsAtParameters, GetValidatorsAtReturnType } from "./types/getValidatorsAt.js";

export async function getValidatorsAt<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetValidatorsAtParameters
): Promise<GetValidatorsAtReturnType> {
  return client.request<
    PChainRpcSchema,
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