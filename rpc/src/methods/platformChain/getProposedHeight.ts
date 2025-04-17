import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetProposedHeightReturnType } from "./types/getProposedHeight.js";

export async function getProposedHeight<chain extends Chain | undefined>(
  client: Client<Transport, chain>
): Promise<GetProposedHeightReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getProposedHeight";
      params: {};
    },
    GetProposedHeightReturnType
  >({
    method: "platform.getProposedHeight",
    params: {},
  });
}