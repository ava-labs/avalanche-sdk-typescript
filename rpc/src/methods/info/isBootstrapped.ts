import { Chain, Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { InfoRpcSchema } from "./infoRpcSchema.js";
import {
  IsBootstrappedParameters,
  IsBootstrappedReturnType,
} from "./types/isBootstrapped.js";

export async function isBootstrapped<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IsBootstrappedParameters
): Promise<IsBootstrappedReturnType> {
  return client.request<
    InfoRpcSchema,
    {
      method: "info.isBootstrapped";
      params: IsBootstrappedParameters;
    },
    IsBootstrappedReturnType
  >({
    method: "info.isBootstrapped",
    params,
  });
}
