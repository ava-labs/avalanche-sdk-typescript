
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { SampleValidatorsParameters, SampleValidatorsReturnType } from "./types/sampleValidators.js";

export async function sampleValidators<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: SampleValidatorsParameters
): Promise<SampleValidatorsReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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