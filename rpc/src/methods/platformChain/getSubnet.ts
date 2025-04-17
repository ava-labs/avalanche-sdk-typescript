
import { Chain, Client, Transport } from "viem";
import { PlatformChainRpcSchema } from "./platformChainSchema.js";
import { GetSubnetParameters, GetSubnetReturnType } from "./types/getSubnet.js";

export async function getSubnet<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  params: GetSubnetParameters
): Promise<GetSubnetReturnType> {
  return client.request<
    PlatformChainRpcSchema,
    {
      method: "platform.getSubnet";
      params: GetSubnetParameters;
    },
    GetSubnetReturnType
  >({
    method: "platform.getSubnet",
    params,
  });
}