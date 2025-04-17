
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetSubnetsParameters, GetSubnetsReturnType } from "./types/getSubnets.js";

export async function getSubnets<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetSubnetsParameters
): Promise<GetSubnetsReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getSubnets";
      params: GetSubnetsParameters;
    },
    GetSubnetsReturnType
  >({
    method: "platform.getSubnets",
    params,
  });
}