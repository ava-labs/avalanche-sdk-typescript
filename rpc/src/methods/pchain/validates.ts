
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { ValidatesParameters, ValidatesReturnType } from "./types/validates.js";

export async function validates<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ValidatesParameters
): Promise<ValidatesReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.validates";
      params: ValidatesParameters;
    },
    ValidatesReturnType
  >({
    method: "platform.validates",
    params,
  });
}