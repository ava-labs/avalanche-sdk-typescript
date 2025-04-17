
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { ValidatesParameters, ValidatesReturnType } from "./types/validates.js";

export async function validates<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: ValidatesParameters
): Promise<ValidatesReturnType> {
  return client.request<
    PlatformChainRpcSchema,
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