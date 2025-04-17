
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { ValidatedByParameters, ValidatedByReturnType } from "./types/validatedBy.js";

export async function validatedBy<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ValidatedByParameters
): Promise<ValidatedByReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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