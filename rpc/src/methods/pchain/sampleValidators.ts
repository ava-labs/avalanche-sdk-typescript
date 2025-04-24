
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { SampleValidatorsParameters, SampleValidatorsReturnType } from "./types/sampleValidators.js";

export async function sampleValidators<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: SampleValidatorsParameters
): Promise<SampleValidatorsReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.sampleValidators";
      params: SampleValidatorsParameters;
    },
    SampleValidatorsReturnType
  >({
    method: "platform.sampleValidators",
    params,
  });
}