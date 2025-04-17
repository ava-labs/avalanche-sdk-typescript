
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { IssueTxParameters, IssueTxReturnType } from "./types/issueTx.js";

export async function issueTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: IssueTxParameters
): Promise<IssueTxReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.issueTx";
      params: IssueTxParameters;
    },
    IssueTxReturnType
  >({
    method: "platform.issueTx",
    params,
  });
}