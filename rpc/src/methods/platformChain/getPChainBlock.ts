import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetPChainBlockParameters, GetPChainBlockReturnType } from "./types/getPChainBlock.js";

export async function getPChainBlock<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetPChainBlockParameters
): Promise<GetPChainBlockReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getBlock";
      params: GetPChainBlockParameters;
    },
    GetPChainBlockReturnType
  >({
    method: "platform.getBlock",
    params,
  });
}
