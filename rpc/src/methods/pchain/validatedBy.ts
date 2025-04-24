
import { Chain,  Transport } from "viem";
import { AvalancheCoreClient as Client } from "../../clients/createAvalancheCoreClient.js";
import { PChainRpcSchema } from "./pChainRpcSchema.js";
import { ValidatedByParameters, ValidatedByReturnType } from "./types/validatedBy.js";

export async function validatedBy<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ValidatedByParameters
): Promise<ValidatedByReturnType> {
  return client.request<
    PChainRpcSchema,
    {
      method: "platform.validatedBy";
      params: ValidatedByParameters;
    },
    ValidatedByReturnType
  >({
    method: "platform.validatedBy",
    params,
  });
}