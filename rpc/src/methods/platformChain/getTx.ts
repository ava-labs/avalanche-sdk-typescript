
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetTxParameters, GetTxReturnType } from "./types/getTx.js";

export async function getTx<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetTxParameters
): Promise<GetTxReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getTx";
      params: GetTxParameters;
    },
    GetTxReturnType
  >({
    method: "platform.getTx",
    params,
  });
}